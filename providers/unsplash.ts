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

// A map of collections to randomly use and how many images they contain currently (imprecise as it doesn't separate portrait from landscape pics)
// They are in order from the smallest number of photos to biggest
const collections: Map<string, number> = new Map([
	["89", 7], // Collection 89
	["96", 7], // Collection 96
	["92", 8], // Collection 92
	["101", 8], // Collection 101
	["57", 9], // Collection 57
	["58", 9], // Collection 58
	["80", 9], // Collection 80
	["104", 9], // Collection 104
	["2", 10], // Collection 2
	["49", 10], // Collection 49
	["62", 10], // Collection 62
	["72", 10], // Collection 72
	["90", 10], // Collection 90
	["91", 10], // Collection 91
	["103", 10], // Collection 103
	["111", 10], // Collection 111
	["113", 10], // Collection 113
	["235", 18], // Best of NASA
	["9670693", 36], // Arctic
	["910", 169], // Earth day
	["9270463", 210], // Lush life
	["17098", 329], // Floral Beauty
	["1053828", 552], // Tabliss
	["998309", 764], // Stellar Photos
	["3348849", 1271], // Architecture
	["3330448", 2259], // Nature
	["1459961", 2340], // Photo of the Day (Archive)
	["XwrRKbw8nSI", 3037], // Minim curated
	["317099", 8504], // Unsplash editorial
]);

export async function provide(set: Settings): Promise<StalewallResponse> {
	const orient = (set.width ?? 16) > (set.height ?? 9) ? "landscape" : "portrait";
	// Gets a collection from the list above "randomly", giving priority to the collections with the biggest number of photos
	// Also 1/2 of the time it will just skip all of this and just get a picture from the wallpapers or nature topics
	const randColl =
		randInt(3) === 0
			? ["topics=wallpapers", "topics=nature"][randInt(2)]
			: `collection=${weightedRand(collections)}`;
	console.info("Collection:", randColl);
	const url = `https://api.unsplash.com/photos/random?${randColl}&orientation=${orient}`;
	console.info("URL:", url);
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

function weightedRand(collections: Map<string, number>): string {
	let sum = 0;
	for (const v of collections.values()) {
		sum += v;
	}
	const rand = randInt(sum);
	let current = 0;
	for (const [k, v] of collections) {
		current += v;
		if (rand < current) return k;
	}
	// wtf happened
	return "2"; // it's a valid collection id
}
