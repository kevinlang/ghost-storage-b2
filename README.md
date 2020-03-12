# Overview
This is a storage adapter for use with Ghost. 
It assumes that the Backblaze B2 bucket is public, primarily so that we can download images via Cloudflare for free downloads.

### Set Up Your Cloudflare
Add record on Cloudflare, for sake of example, i use this two example domains.

Add CNAME record images.myproject.com and point it to f000.backblazeb2.com (yours may vary)

### Config
Edit your config.env.json

path prefix is the extra folder on your b2 if you want. i recommend put "uploads/"
```
  "storage": {
    "active": "ghost-storage-b2",
    "ghost-storage-b2": {
      "applicationKeyId": "xxxxxxxxxxxx",
      "applicationKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "bucketId": "xxxxxxxxxxxxxxxxxxxxxxxx",
      "bucketName": "atestbucket",
      "host": "https://images.myproject.com",
      "pathPrefix": "uploads/"
    }
  }

```

### Extra
You can add below in your config.env.json to reduce load on b2 api since ghost base storage adapter will upload 2 files instead of one.
```
  "imageOptimization": {
    "resize": false
  }
```

### Info
If you follow this, image upload should be working fine. Duplicate (same file name) will be renamed with numbered suffix (duplicate-1.jpg and so on). 

Gallery upload is working fine, so you can upload gallery up to 9 images. Other plugins or even the one I did for a fix is not working.

Thanks Gnalck for this!

