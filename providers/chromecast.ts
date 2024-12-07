import * as cheerio from "cheerio";
import type { FinalJson, Settings } from "../src/types";
import { getData, randInt } from "../src/utils";

// url of the chromecast homepage (contains a json with 50 wallpapers)
const url = "https://google.com/cast/chromecast/home/";

// Grabs a list of wallpapers from the Chromecast homepage and returns one
export async function provide(set: Settings): Promise<FinalJson> {
	// loads the homepage and extracts the text from the only script tag in the body (which is regenerated on every request)
	const homepage = (await getData(url)) as string;
	const $ = cheerio.load(homepage);
	const scriptTagText = $("body > script").text();
	if (!scriptTagText) {
		throw new Error("chromecast: script tag not found");
	}

	const usefulString = scriptTagText.after("JSON.parse('").before("')).");

	// I don't know if it's just a bun thing but ì decodeURIComponent will unescape \x sequences only in a repl
	// Here it doesn't work for some reason so \x gets replaced with % which does work
	// I hate escape sequences after this.
	const stringJson = decodeURIComponent(usefulString.replaceAll("\\x", "%").replaceAll("\\\\", "\\"));

	// This json is just a series of nested arrays with strings, numbers and more in them
	// So I can't really give a type to this json unfortunately
	const json = JSON.parse(stringJson);

	const chosenOne = json[0][randInt(50)];

	const finalJson: FinalJson = {
		provider: "chromecast",
		url: `${chosenOne[0].before("=")}=w0`,
		info: {
			credits: {
				copyright: chosenOne[1] ?? "Unknown/Google",
				urls: {
					image: chosenOne[9],
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
	finalURL.searchParams.set("prov", "chromecast");
	// specifying if original url is /proxy/ or /chromecast-private-photos/
	switch (img.charAt(37)) {
		case "c":
			finalURL.searchParams.set("type", "pp");
			finalURL.searchParams.set("id", btoa(img.after("s/").before("=")));
			break;

		case "p":
			finalURL.searchParams.set("type", "pr");
			finalURL.searchParams.set("id", btoa(img.after("y/").before("=")));
			break;

		default:
			throw new Error("Invalid chromecast image url");
	}

	if (height && width) {
		finalURL.searchParams.set("h", height.toString());
		finalURL.searchParams.set("w", width.toString());
	}

	return finalURL.toString();
}
