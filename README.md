# stalewall
A simple to use (random) wallpaper api
A public instance can be found here: [stalewall.spacefell.workers.dev](https://stalewall.spacefell.workers.dev)
Uses [stalewall-proxy](https://github.com/spacefall/stalewall-proxy) to crop and proxy images with cors
A demo can be found [here](https://spacefall.github.io/stalewall-demo/)

## Host
This repo is ready to be deployed to Cloudflare Workers (and is in fact deployed [there](https://stalewall.spacefell.workers.dev)), just run `wrangler deploy`.
Alternatively, the repo includes a basic Bun server that functions the same way as the worker but runs on Bun (duh) and it's meant for development environments.

To host the complete project you should also deploy a [stalewall-proxy](https://github.com/spacefall/stalewall-proxy) instance as stalewall depends on it to proxy images for cors and to crop them.

## Providers
Stalewall can get a random wallpaper from various sources, these sources are called providers:
- Bing homepage image (`bing`)
- Windows Spotlight (`spotlight`)
- Chromecast 1 Ambient Mode (`chromecast`)
- Fire TV screensaver (`firetv`)
- Earth View by Google Earth (`earthview`)
- Unsplash (`unsplash`)
- NASA Astronomy Picture of The Day (`apod`)[^1]
[^1]: APOD is disabled by default, use the ?prov query to enable it

Note: value in parentheses is the one to use for prov query

## Parameters
Stalewall uses query parameters and environment variables.

Queries are used to change the response:

| Query   | Value                 | Example              | Description                                                                       |
|---------|-----------------------|----------------------|-----------------------------------------------------------------------------------|
| res     | (int>0)x(int>0)       | ?res=1920x1080       | Final resolution of proxied image (enables proxy), follow format (width)x(height) |
| proxy   | no value              | ?proxy               | Enables proxy without changing image resolution (max resolution possible)         |
| prov    | CSV list of providers | ?prov=bing,spotlight | Forces the api to only use the specified providers                                |
| quality | 0<=int<=100           | ?quality=92          | Sets image quality of proxied image (ignored if proxy is disabled)                |

While env vars are used to enable features:

| Name             | Content                         | Description                                                                                                       |
|------------------|---------------------------------|-------------------------------------------------------------------------------------------------------------------|
| PROXY_URL        | Url of stalewall-proxy instance | REQUIRED environment variable to pass, indicates the proxy instance to use to proxy the images                    |
| UNSPLASH_API_KEY | Unsplash Access Key             | Optional if Unsplash is disabled (Unsplash is enabled by default), is just the access key from your Unsplash app  |
| APOD_API_KEY     | APOD API Key                    | Optional if APOD is disabled (APOD is disabled by default), is just the api key from api.nasa.gov                 |
