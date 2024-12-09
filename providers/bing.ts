import type { Settings } from "../src/types";
import type { StalewallResponse } from "../src/types";
import { getCommonProxyQueries, getData, randInt } from "../src/utils";

const providerName = "bing";

// Partial Bing JSON response (used for type checking and code completion)
export interface PartialBingJson {
	images: [
		{
			urlbase: string;
			copyright: string;
			copyrightlink: string;
			title: string;
			desc: string;
			desc2: string;
		},
	];
}

// Array of markets that have different images in Bing's daily wallpaper
// biome-ignore format: it takes too many lines (less than spotlight but still)
const markets = ["af-NA", "as-IN", "eu-ES", "zh-CN", "en-CA", "en-GB", "en-US", "fr-CA", "fr-FR", "de-DE", "it-IT", "ja-JP", "pt-BR"];

export async function provide(set: Settings): Promise<StalewallResponse> {
	const url = `https://www.bing.com/HPImageArchive.aspx?format=js&n=8&desc=1&idx=${randInt(8)}&mkt=${markets[randInt(markets.length)]}`;
	console.info("URL:", url);
	try {
		const json = (await getData(url)) as PartialBingJson;
		const chosenOne = json.images[randInt(json.images.length)];

		const imageUrl = `https://bing.com${chosenOne.urlbase}_UHD.jpg&p=0&pid=hp&qlt=${set.quality}`;
		const proxyUrl = set.proxy ? proxy(imageUrl, set) : imageUrl;

		let desc = chosenOne.desc;
		if (chosenOne.desc2) {
			desc += `\n${chosenOne.desc2}`;
		}

		// JSON
		return {
			provider: providerName,
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
		if (e instanceof Error) throw new Error(`${providerName}: ${e.message}`);
		// ? means that IDK what happened as the error is not an Error, but it has been thrown anyway
		throw new Error(`${providerName}?: ${e}`);
	}
}

function proxy(image: string, settings: Settings): string {
	// Create url and set standard things (like height, width etc.)
	const proxiedImage = new URL(settings.proxyUrl);
	proxiedImage.search = getCommonProxyQueries(settings, providerName);

	// Setting ID
	proxiedImage.searchParams.set("id", btoa(image.between("id=", ".jpg")));

	return proxiedImage.toString();
}
