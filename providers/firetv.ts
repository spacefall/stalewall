import { getJson, randInt } from "../src/utils";
import type { FinalJson } from "../src/types";

// json format of the json file (in the gist)
export interface FTVJson {
	url: string;
	width: number;
	height: number;
	description: string;
}

// url of the json containing the firetv wallpapers
const url =
	"https://gist.githubusercontent.com/spacefall/0cc095656f67e826977c84eecdd89b3c/raw/07553644e25c653fc099aa3e1058456b82c73d6f/firetv.json";

// Grabs a list of wallpapers used on the FireTV screensaver and returns one
// noinspection JSUnusedGlobalSymbols
export async function provide(): Promise<FinalJson> {
	const json = (await getJson(url)) as FTVJson[];
	const chosenOne = json[randInt(json.length)];

	// json build
	return {
		provider: "firetv",
		url: chosenOne.url,
		info: {
			desc: {
				short: chosenOne.description,
			},
			credits: {
				copyright: "Unknown/Amazon",
			},
		},
	};
}
