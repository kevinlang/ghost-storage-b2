# Overview
This is a storage adapter for use with Ghost. 
It assumes that the Backblaze B2 bucket is public, primarily so that we can download images via Cloudflare for free downloads. 

### Config
```
const config = {
  // required
  applicationKeyId: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  applicationKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  bucketId: 'XXXXXXXXXXXXXXXXXXXXXXXX',
  bucketName: 'mybucket',
  host: 'my-cloudflare-proxy.com',

  // optional
  pathPrefix: 'path/'
};
```
