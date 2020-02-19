
const BaseStore = require('ghost-storage-base');
const B2 = require('backblaze-b2');
const upath = require('upath');
const fs = require('fs').promises;
const getBuffer = require('bent')('buffer');

class Store extends BaseStore {
  constructor(config) {
    super(config);

    this.b2 = new B2({
      applicationKeyId: config.applicationKeyId,
      applicationKey: config.applicationKey,
    });
    this.b2.authorize().then(() => {
      this.lastAuthTime = Date.now();
    });

    // does Ghost auto pass along ENV variables?
    this.pathPrefix = config.pathPrefix;
    this.bucketId = config.bucketId;
    this.bucketName = config.bucketName;
    this.host = config.host;
  }

  reauth() {
    const hoursPassed = (Date.now() - this.lastAuthTime) / (1000*60*60);
    if (hoursPassed < 20) {
      return Promise.resolve();
    }

    return this.b2.authorize().then(() => {
      this.lastAuthTime = Date.now();
    });
  }

  exists(filename, targetDir) {
    let filepath = upath.join((targetDir || this.getTargetDir()), filename);
    if (!filepath.startsWith(this.pathPrefix)) {
      filepath = upath.join(this.pathPrefix, filepath);
    }
    
    return this.reauth().then(() => {
      return this.b2.listFileNames({
        bucketId: this.bucketId,
        prefix: filepath,
        maxFileCount: 0,
      })
    }).then(({ data }) => {
      return !!(data && data.files && data.files.length);
    });
  }

  save(image, targetDir) {
    targetDir = targetDir || this.getTargetDir();
    if (!targetDir.startsWith(this.pathPrefix)) {
      targetDir = upath.join(this.pathPrefix, targetDir);
    }

    return Promise.all([
      this.getUniqueFileName(image, targetDir),
      this.reauth()
        .then(() => this.b2.getUploadUrl({ bucketId: this.bucketId })),
      fs.readFile(image.path),
    ]).then(([fileName, response, file]) => {
      return this.b2.uploadFile({
        uploadUrl: response.data.uploadUrl,
        uploadAuthToken: response.data.authorizationToken,
        fileName: fileName,
        data: file,
      }).then((response) => {
        return `${this.host}/file/${this.bucketName}/${response.data.fileName}`;
      })
    })
  }

  serve() {
    // no reason to serve from here - the absolute URLs should be 
    // hit directly from the client.
    return (req, res, next) => {
      next();
    }
  }

  delete() {
    return Promise.reject("Not implemented");
  }

  read(options) {
    if (!options || !options.path) {
      return Promise.reject("Cannot read file - no options.path provided");
    }

    // we may receive an absolute url, just pass through in that case
    // this hack can be removed after https://github.com/TryGhost/Ghost/issues/11604 is fixed
    if (options.path.startsWith('http://') || options.path.startsWith('https://')) {
      return getBuffer(options.path);
    }

    // otherwise, build up the absolute url
    const filepath = options.path;
    if (!filepath.startsWith(this.pathPrefix)) {
      filepath = upath.join(this.pathPrefix, options.path);
    }

    const url = `${this.host}/file/${this.bucketName}/${filepath}`;
    return getBuffer(url);
  }
}

module.exports = Store;