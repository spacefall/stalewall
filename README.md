# stalewall
A simple to use random wallpaper api  
Relies on [stalewall-proxy](https://github.com/spacefall/stalewall-proxy) to crop and proxy images

## Usage
A public instance of this api can be found here: [stalewall.spacefell.workers.dev](https://stalewall.spacefell.workers.dev).  
If you want to play with it, you can find a basic demo/playground [here](https://spacefall.github.io/stalewall-demo/) or if you want a more practical example, a rust application to refresh your desktop and lockscreen wallpaper can be found [here](https://github.com/spacefall/stalewall-desktop).

## Providers
Stalewall can get a random wallpaper from various sources, these sources are called providers:
- Bing homepage image (`bing`)
- Windows Spotlight (`spotlight`)
- Chromecast (1) Ambient Mode (`chromecast`)
- Fire TV screensaver (`firetv`)
- Earth View by Google Earth (`earthview`)
- Unsplash (`unsplash`)
- NASA Astronomy Picture of The Day (`apod`)[^1]
[^1]: APOD is disabled by default, use the `prov` query to enable it

**Note:** value in parentheses is the one to use for the `prov` query.  
**Note<sub>2</sub>:** this api returns images of any size since many providers don't stick to a single resolution. All providers (except APOD) return images with a resolution >= 1600x900 though.
## Parameters
Stalewall uses the following query parameters:

| Query   | Value                 | Example              | Description                                                                       |
|---------|-----------------------|----------------------|-----------------------------------------------------------------------------------|
| res     | (int>0)x(int>0)       | ?res=1920x1080       | Final resolution of proxied image (enables proxy), follow format (width)x(height) |
| proxy   | no value              | ?proxy               | Enables proxy without changing image resolution (max resolution possible)         |
| prov    | CSV list of providers | ?prov=bing,spotlight | Forces the api to only use the specified providers                                |
| quality | 0<=int<=100           | ?quality=92          | Sets image quality of proxied image (ignored if proxy is disabled)                |

And the following environment variables:

| Name             | Content                         | Description                                                                                                       |
|------------------|---------------------------------|-------------------------------------------------------------------------------------------------------------------|
| PROXY_URL        | Url of stalewall-proxy instance | REQUIRED environment variable to pass, indicates the proxy instance to use to proxy the images                    |
| UNSPLASH_API_KEY | Unsplash Access Key             | Optional if Unsplash is disabled (Unsplash is enabled by default), is just the access key from your Unsplash app  |
| APOD_API_KEY     | APOD API Key                    | Optional if APOD is disabled (APOD is disabled by default), is just the api key from api.nasa.gov                 |

## Response
Stalewall will return a json that follows the following interface:
```ts
export interface StalewallResponse {
	provider: string;
	url: string;
	info: {
		desc?: {
			title?: string;
			short?: string;
			long?: string;
		};
		credits: {
			copyright: string;
			urls?: {
				author?: string;
				image?: string;
			};
		};
	};
}
```
**Note:** the values with `?` won't be present on every api call, as some providers won't return them.

For a more informative description of the values:

| Key                      | Content                                                                                      |
|--------------------------|----------------------------------------------------------------------------------------------|
| provider                 | Name of the provider used to grab the wallpaper                                              |
| url                      | URL of the image                                                                             |
| info.desc.title          | Shortest description of the three, often contains only location info                         |
| info.desc.short          | Useful description of the image and is the most common to find                               |
| info.desc.long           | Longest description, often contains lore about the picture/place                             |
| info.credits.copyright   | Author of the picture, might be "Unknown" if the photographer isn't returned by the provider |
| info.credits.urls.author | URL to photographer's profile (e.g. Unsplash)                                                |
| info.credits.urls.image  | URL to original source of image returned by provider                                         |

## Hosting
This repo is ready to be deployed to Cloudflare Workers, just run `wrangler deploy`.  
Alternatively, the repo includes a basic Bun server that functions the same way as the worker. (it may output more data for developement purposes)

If you're considering self-hosting, you should also deploy [stalewall-proxy](https://github.com/spacefall/stalewall-proxy) as this api relies on it for image cropping and proxying, more info in its repo.

## Thanks
The Spotlight provider was made with the research made by ORelio [here](https://github.com/ORelio/Spotlight-Downloader)  
The FireTV provider was using data from [this](https://www.reddit.com/r/fireTV/comments/wzt2yg/comment/im5e42b/) reddit thread, the same data was made into a [json](https://gist.github.com/spacefall/0cc095656f67e826977c84eecdd89b3c) before discovering that the firetv grabs a [json with image urls by itself](https://d21m0ezw6fosyw.cloudfront.net/manifest/collections_en_US_v3.json)
