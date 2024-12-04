import * as cheerio from "cheerio";
import type { FinalJson, Settings } from "../src/types";
import { getProxyUrl, getText, randInt } from "../src/utils";

// url of the chromecast homepage (contains a json with 50 wallpapers)
const url = "https://google.com/cast/chromecast/home/";

// Grabs a list of wallpapers from the Chromecast homepage and returns one
export async function provide(set: Settings): Promise<FinalJson> {
	// loads the homepage and extracts the text from the only script tag in the body (which is regenerated on every request)
	const homepage = await getText(url);
	const $ = cheerio.load(homepage);
	const scriptTagText = $("body > script").text();
	if (!scriptTagText) {
		throw new Error("chromecast: script tag not found");
	}

	const usefulString = scriptTagText.substring(scriptTagText.indexOf("JSON.parse('") + 12, scriptTagText.indexOf("'))."));

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
		finalJson.url = proxy(finalJson.url, set.width, set.height);
	}
	return finalJson;
}

function proxy(img: string, width?: number, height?: number): string {
	const proxyURL = getProxyUrl();
	const imgURL = new URL(img);

	// setting provider
	proxyURL.searchParams.set("prov", "chromecast");
	// specifying if original url is /proxy/ or /chromecast-private-photos/
	switch (imgURL.pathname.charAt(1)) {
		case "c":
			proxyURL.searchParams.set("type", "pp");
			proxyURL.searchParams.set("id", imgURL.pathname.after("photos/").before("="));
			break;

		case "p":
			proxyURL.searchParams.set("type", "pr");
			proxyURL.searchParams.set("id", imgURL.pathname.after("proxy/").before("="));
			break;

		default:
			throw new Error("Invalid chromecast image url");
	}

	if (height && width) {
		proxyURL.searchParams.set("h", height.toString());
		proxyURL.searchParams.set("w", width.toString());
	}

	return proxyURL.toString();
}
