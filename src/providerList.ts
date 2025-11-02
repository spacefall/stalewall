import * as apod from "../providers/apod";
import * as bing from "../providers/bing";
import * as chrcast from "../providers/chromecast";
import * as earth from "../providers/earthview";
import * as ftv from "../providers/firetv";
import * as spot from "../providers/spotlight";
import * as unspl from "../providers/unsplash";
import * as pex from "../providers/pexels";
import type { Provider, ProviderMap } from "./types";

// Static map of enabled providers, this is for Cloudflare Workers as it can't use the fs module.
// For bun devLoadProviders should be used as that enables quick testing of new providers (api keys still have to be declared here though)
export const providers: ProviderMap = new Map<string, Provider>([
	["bing", bing.provide],
	["chromecast", chrcast.provide],
	["earthview", earth.provide],
	["firetv", ftv.provide],
	["spotlight", spot.provide],
	["apod", apod.provide],
	["unsplash", unspl.provide],
	["pexels", pex.provide],
]);

// Providers to use by default, any provider not in the list won't appear automatically but can be used with the ?prov query
export const defaultProviders: Array<string> = ["bing", "chromecast", "earthview", "firetv", "spotlight"];

// Providers that have an api key (duh), when a provider in the list is encountered while parsing queries,
// the function will check if the key is present and throw an error if the key is non-existent
export const providersWithApiKeys: Array<string> = ["apod", "unsplash", "pexels"];
