import type { FinalJson, Settings } from "../src/types";
import { randInt } from "../src/utils";
import ftvData from "./firetv_data.json";

// json format of the json file (in the gist)
export interface FTVJson {
	url: string;
	width: number;
	height: number;
	description: string;
}

// url of the json containing the firetv wallpapers
//const url = "https://gist.githubusercontent.com/spacefall/0cc095656f67e826977c84eecdd89b3c/raw/07553644e25c653fc099aa3e1058456b82c73d6f/firetv.json";

// Grabs a list of wallpapers used on the FireTV screensaver and returns one
// noinspection JSUnusedGlobalSymbols
export async function provide(set: Settings): Promise<FinalJson> {
	const json = ftvData as FTVJson[];
	const chosenOne = json[randInt(json.length)];

	// json build
	const finalJson: FinalJson = {
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

	if (set.proxy) {
		finalJson.url = proxy(finalJson.url, set.proxyUrl, set.width, set.height);
	}
	return finalJson;
}

function proxy(img: string, proxyUrl: string, width?: number, height?: number): string {
	const finalURL = new URL(proxyUrl);

	// setting provider
	finalURL.searchParams.set("prov", "firetv");
	finalURL.searchParams.set("id", img.after("net/").slice(0, -4));

	if (height && width) {
		finalURL.searchParams.set("h", height.toString());
		finalURL.searchParams.set("w", width.toString());
	}

	return finalURL.toString();
}
