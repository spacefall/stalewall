import type { Settings } from "../src/types";
import type { FinalJson } from "../src/types";
import { getJson, randInt } from "../src/utils";

// json format of the api response
export interface BingJson {
	images: [
		{
			startdate: string;
			fullstartdate: string;
			enddate: string;
			url: string;
			urlbase: string;
			copyright: string;
			copyrightlink: string;
			title: string;
			desc: string;
			desc2: string;
			quiz: string;
			wp: boolean;
			hsh: string;
			drk: number;
			top: number;
			bot: number;
			hs: [];
		},
	];
	tooltips: {
		loading: string;
		previous: string;
		next: string;
		walle: string;
		walls: string;
	};
}

// list of bing supported markets
const markets = [
	"af-NA",
	"as-IN",
	"eu-ES",
	"zh-CN",
	"en-CA",
	"en-GB",
	"en-US",
	"fr-CA",
	"fr-FR",
	"de-DE",
	"it-IT",
	"ja-JP",
	"pt-BR",
];

// Grabs a wallpaper from the Bing homepage api and returns it
// noinspection JSUnusedGlobalSymbols
export async function provide(set: Settings): Promise<FinalJson> {
	const url = `https://www.bing.com/HPImageArchive.aspx?format=js&n=8&desc=1&idx=${randInt(8)}&mkt=${markets[randInt(markets.length)]}`;
	const json = (await getJson(url)) as BingJson;
	const chosenOne = json.images[randInt(json.images.length)];

	let desc = chosenOne.desc;
	if (chosenOne.desc2) {
		desc += `\n${chosenOne.desc2}`;
	}

	// json build
	const finalJson: FinalJson = {
		provider: "bing",
		url: `https://bing.com${chosenOne.urlbase}_UHD.jpg&p=0&pid=hp&qlt=${set.quality}`,
		info: {
			desc: {
				title: chosenOne.title,
				// short description is the location before the copyright info
				short: chosenOne.copyright.before("(").slice(0, -1),
				long: desc,
			},
			credits: {
				// the copyright info has the location removed
				copyright: chosenOne.copyright.after("(").slice(0, -1),
				urls: {
					copyright: chosenOne.copyrightlink,
				},
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
	// TODO: this ignores quality, either remove quality from the api here or add it to the proxy
	finalURL.searchParams.set("prov", "bing");
	finalURL.searchParams.set("id", btoa(img.after("id=").before(".jpg")));

	if (height && width) {
		finalURL.searchParams.set("h", height.toString());
		finalURL.searchParams.set("w", width.toString());
	}

	return finalURL.toString();
}
