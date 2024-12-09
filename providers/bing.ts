import type { Settings } from "../src/types";
import type { StalewallResponse } from "../src/types";
import { getCommonProxyQueries, getData, randInt } from "../src/utils";

// Bing JSON response (used for type checking and code completion)
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

// Array of markets that have different images in Bing's daily wallpaper
// biome-ignore format: it takes too many lines (less than spotlight but still)
const markets = ["af-NA", "as-IN", "eu-ES", "zh-CN", "en-CA", "en-GB", "en-US", "fr-CA", "fr-FR", "de-DE", "it-IT", "ja-JP", "pt-BR"];

export async function provide(set: Settings): Promise<StalewallResponse> {
	const url = `https://www.bing.com/HPImageArchive.aspx?format=js&n=8&desc=1&idx=${randInt(8)}&mkt=${markets[randInt(markets.length)]}`;
	try {
		const json = (await getData(url)) as BingJson;
		const chosenOne = json.images[randInt(json.images.length)];

		const imageUrl = `https://bing.com${chosenOne.urlbase}_UHD.jpg&p=0&pid=hp&qlt=${set.quality}`;
		const proxyUrl = set.proxy ? proxy(imageUrl, set) : imageUrl;

		let desc = chosenOne.desc;
		if (chosenOne.desc2) {
			desc += `\n${chosenOne.desc2}`;
		}

		// JSON
		return {
			provider: "bing",
			url: proxyUrl,
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
						image: chosenOne.copyrightlink,
					},
				},
			},
		};
	} catch (e) {
		// @ts-ignore
		throw new Error(`bing: ${e.message}`);
	}
}

function proxy(image: string, settings: Settings): string {
	// Create url and set standard things (like height, width etc.)
	const proxiedImage = new URL(settings.proxyUrl);
	proxiedImage.search = getCommonProxyQueries(settings, "bing");

	// Setting ID
	proxiedImage.searchParams.set("id", btoa(image.between("id=", ".jpg")));

	return proxiedImage.toString();
}
