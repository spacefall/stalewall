import type { Settings } from "../src/types";
import type { FinalJson } from "../src/types";
import { getData } from "../src/utils";

// json format of the api response
export interface ApodJson {
	copyright?: string;
	date: string;
	explanation: string;
	hdurl?: string;
	media_type: string;
	service_version: string;
	title: string;
	url: string;
	thumbnail_url?: string;
}

// Grabs a wallpaper from the Apod api and returns it
// noinspection JSUnusedGlobalSymbols
export async function provide(set: Settings): Promise<FinalJson> {
	const url = `https://api.nasa.gov/planetary/apod?count=1&thumbs=true&api_key=${set.keys?.get("apod")}`;
	const json = ((await getData(url)) as ApodJson[])[0];

	// could use the thumbnail of the video, but it's usually low quality and kinda bad, also there aren't a lot of videos
	if (json.media_type !== "image") {
		throw new Error("apod: media_type is not image");
	}

	const imageUrl = json.hdurl ?? json.url;

	// json build
	const finalJson: FinalJson = {
		provider: "apod",
		url: imageUrl,
		info: {
			desc: {
				title: json.title,
				long: json.explanation,
			},
			credits: {
				copyright: json.copyright ?? "Public domain, NASA",
			},
		},
	};
	if (set.proxy) {
		finalJson.url = proxy(imageUrl, set.proxyUrl, set.width, set.height);
	}
	return finalJson;
}

function proxy(img: string, proxyUrl: string, width?: number, height?: number): string {
	const finalURL = new URL(proxyUrl);

	// setting provider
	finalURL.searchParams.set("prov", "apod");
	finalURL.searchParams.set("id", btoa(img.after("e/").before(".jpg")));

	if (height && width) {
		finalURL.searchParams.set("h", height.toString());
		finalURL.searchParams.set("w", width.toString());
	}

	return finalURL.toString();
}
