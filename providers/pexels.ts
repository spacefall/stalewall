import type { Settings } from "../src/types";
import type { StalewallResponse } from "../src/types";
import { getData, randInt } from "../src/utils";

const providerName = "pexels";

// Pexels collections response
export interface PexelsCollectionsJson {
	media: {
		alt: string;
		width: number;
		height: number;
		url: string;
		photographer: string;
		photographer_url: string;
		photographer_id: number;
		src: {
			original: string;
		};
	}[];
}

const collections: Map<string, number> = new Map([
	["v5gk14h", 102], // Earth Unfiltered
]);

export async function provide(set: Settings): Promise<StalewallResponse> {
	const landscape = (set.width ?? 16) > (set.height ?? 9);

	// Gets a collection from the list above "randomly", giving priority to the collections with the biggest number of photos
	// Gets the as many photos as possible (80) and to shuffle it up, randomly chooses asc or desc order
	const randColl = weightedRand(collections);
	const orderBy = randInt(2) ? "asc" : "desc";
	console.info("Collection:", randColl);
	const url = `https://api.pexels.com/v1/collections/${randColl}?per_page=80&type=photos&sort=${orderBy}`;
	console.info("URL:", url);
	try {
		let correctOrientation: PexelsCollectionsJson["media"] = [];
		let tries = 0;
		do {
			tries++;
			const collJson = (await getData(url, {
				Authorization: set.keys?.get(providerName) ?? "",
			})) as PexelsCollectionsJson;

			correctOrientation = collJson.media.filter((item) => {
				if (landscape) {
					return item.width >= item.height;
				}
				return item.height > item.width;
			});
		} while (correctOrientation.length === 0 && tries <= 5);

		const choice = correctOrientation[randInt(correctOrientation.length)];

		// Don't proxy (ever) (pexels is also against it, i think)
		const imageUrl = `${choice.src.original}?fit=crop&crop=entropy&fm=jpg&q=${set.quality}${
			set.height && set.width ? `&w=${set.width}&h=${set.height}` : ""
		}`;

		// JSON
		return {
			provider: providerName,
			url: imageUrl,
			info: {
				desc: {
					short: choice.alt,
				},
				credits: {
					copyright: choice.photographer,
					urls: {
						author: `${choice.photographer_url}?utm_source=stalewall&utm_medium=referral`,
						image: `${choice.url}?utm_source=stalewall&utm_medium=referral`,
					},
				},
			},
		};
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
