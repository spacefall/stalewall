import * as bing from "../providers/bing";
import * as chrcast from "../providers/chromecast";
import * as earth from "../providers/earthview";
import * as ftv from "../providers/firetv";
import * as spot from "../providers/spotlight";
import type { Provider, ProviderMap } from "./types";

// This file exists to import all providers and put them in a list, this would be done at runtime (see devLoadProviders)
// but unfortunately Cloudflare Workers doesn't support fs so they have to be shoved in a list manually

export const providers: ProviderMap = new Map<string, Provider>([
	["bing", bing.provide],
	["chromecast", chrcast.provide],
	["earthview", earth.provide],
	["firetv", ftv.provide],
	["spotlight", spot.provide],
	["apod", bing.provide],
]);

export const defaultProviders: Array<string> = ["bing", "chromecast", "earthview", "firetv", "spotlight"];
export const providersWithApiKeys: Array<string> = ["apod", "unsplash"];
