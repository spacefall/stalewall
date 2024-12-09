import type { Settings } from "../src/types";
import type { StalewallResponse } from "../src/types";
import { getData, randInt } from "../src/utils";

const providerName = "unsplash";

// Partial Unsplash API (full would have been over 200 lines, also it trims what's not present so it's a mess)
export interface PartialUnsplashJson {
	urls: {
		raw: string;
	};
	links: {
		html: string;
	};
	user: {
		name: string;
		links: {
			html: string;
		};
	};
	location?: {
		name?: string;
	};
	description?: string;
	alt_description?: string;
}

// A list of collections and topics to randomly use
// Collections are in order:
//	- Tabliss
//	- Stellar Photos
const collections = ["collections=1053828", "collections=998309", "topics=wallpapers", "topics=nature"];

export async function provide(set: Settings): Promise<StalewallResponse> {
	const orient = (set.width ?? 16) > (set.height ?? 9) ? "landscape" : "portrait";
	const url = `https://api.unsplash.com/photos/random?${collections[randInt(collections.length)]}&orientation=${orient}`;
	console.info(`URL: ${url}`);
	try {
		const json = (await getData(url, {
			Authorization: `Client-ID ${set.keys?.get(providerName)}`,
			"Accept-Version": "v1",
		})) as PartialUnsplashJson;

		// Don't proxy (ever) (unsplash doesn't want it)
		const imageUrl = `${json.urls.raw}&fit=crop&crop=entropy&fm=jpg&q=${set.quality}${set.height && set.width ? `&w=${set.width}&h=${set.height}` : ""}`;

		// Edit the alt_description (this will be the "short" desc)
		let altDesc = json.alt_description;
		if (altDesc) {
			altDesc += json.location?.name ? `[${json.location.name}]` : "";
		}

		// JSON
		const finalJSON: StalewallResponse = {
			provider: providerName,
			url: imageUrl,
			info: {
				desc: {},
				credits: {
					copyright: json.user.name,
					urls: {
						author: `${json.user.links.html}?utm_source=stalewall&utm_medium=referral`,
						image: `${json.links.html}?utm_source=stalewall&utm_medium=referral`,
					},
				},
			},
		};

		if (finalJSON.info.desc) {
			// Add long desc if it exists
			if (json.description) {
				finalJSON.info.desc.long = json.description;
			}
			// Add short desc if it exists
			if (altDesc) {
				finalJSON.info.desc.short = altDesc;
			}
		}
		return finalJSON;
	} catch (e) {
		if (e instanceof Error) throw new Error(`${providerName}: ${e.message}`);
		// ? means that IDK what happened as the error is not an Error, but it has been thrown anyway
		throw new Error(`${providerName}?: ${e}`);
	}
}
