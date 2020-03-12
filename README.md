# Overview
This is a storage adapter for use with Ghost. 
It assumes that the Backblaze B2 bucket is public, primarily so that we can download images via Cloudflare for free downloads.

# Installation
```
go to ghost root installation folder
sudo mkdir  -p  ./content/adapters/storage
cd content/adapters/storage
sudo git clone https://github.com/anazhd/ghost-storage-b2.git
sudo npm install
```
run ```ghost doctor``` in ghost root installation folder and follow fix instruction if there's so. 

### Set Up Your Cloudflare (optional)
1. First upload something to your bucket from backblaze website and acquire your bucket friendly url.
Usually it starts with ```fXXX.backblazeb2.com```

2. For sake of example, I use this two example domains ```images.myproject.com``` and ```f000.backblazeb2.com```

3. Go to your domain DNS tab in Cloudflare dashboard and add CNAME record like so

name: ```images``` 
target: ```f000.backblazeb2.com``` (yours may vary! read step 1)
proxy status: proxied (orange)

![dns](https://i.imgur.com/HXL7c32.png)

4. Then go to Page Rules tab and copy this and save. take note, your domain name my vary! you should know yours.
![pagerules](https://i.imgur.com/vGFMJtB.png)

# Main Config
Edit your ```config.production.json```

For host, if you dont use cloudflare, put your bucket friendly url ```https://fxxx.backblazeb2.com```.
For path prefix, it is the extra folder on your bucket. i recommend put ```uploads/``` so your file will be uploaded to ```uploads``` folder for sanity.

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

### Extra (optional)
You can add below in your config.env.json to reduce load on b2 api since ghost base storage adapter will upload 2 files instead of one. This parameter will remove image optimization and only upload 1 file to your bucket, which is faster.

```
  "imageOptimization": {
    "resize": false
  }
```

# Info
If you follow this, image upload should be working fine. Duplicate (same file name) will be renamed with numbered suffix (duplicate-1.jpg and so on). 

Gallery upload is working fine, so you can upload gallery up to 9 images. 

Other plugins or even the one I did for a fix is not working.

# Why do you need Cloudflare?
Every call from Cloudflare to BackBlaze is free so this wont effect your daily transaction limit. Direct call from BackBlaze is slower, while cached call through Cloudflare is way faster. If you concern about image load speed, consider using Cloudflare.

Thanks [Gnalck](https://github.com/gnalck) for this! Happy ghosting.

