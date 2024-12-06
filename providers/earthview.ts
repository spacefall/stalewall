import type { FinalJson, Settings } from "../src/types";
import { randInt } from "../src/utils";
import earthviewData from "./earthview_data.json";

// json format of the json file (in the gist)
export interface EarthviewJson {
	id: string;
	location: string;
	attribution: string;
}

// Grabs a list of wallpapers used on the FireTV screensaver and returns one
// noinspection JSUnusedGlobalSymbols
export async function provide(set: Settings): Promise<FinalJson> {
	const chosenOne = earthviewData[randInt(earthviewData.length)];

	// TODO: handle when PROXY_URL is non existant
	let imageUrl = `${set.proxyUrl}?prov=earthview&id=${btoa(chosenOne.id)}`;
	if (set.width && set.height) {
		imageUrl += `&w=${set.width}&h=${set.height}`;
	}

	// json build
	return {
		provider: "earthview",
		url: imageUrl,
		info: {
			desc: {
				short: chosenOne.location,
			},
			credits: {
				copyright: chosenOne.attribution,
			},
		},
	};
}
