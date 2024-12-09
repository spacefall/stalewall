import type { Settings } from "../src/types";
import type { StalewallResponse } from "../src/types";
import { getCommonProxyQueries, getData } from "../src/utils";

const providerName = "apod";

// Partial APOD api JSON response (used for type checking and code completion)
export interface PartialApodJson {
	copyright?: string;
	explanation: string;
	hdurl?: string;
	media_type: string;
	title: string;
	url: string;
}

export async function provide(set: Settings): Promise<StalewallResponse> {
	const url = `https://api.nasa.gov/planetary/apod?count=1&thumbs=true&api_key=${set.keys?.get(providerName)}`;
	try {
		const json = ((await getData(url)) as PartialApodJson[])[0];
		console.info("Original JSON:", json);

		// TODO: resolve this?
		// Error out if video is returned instead of image, the thumbnail could be used, but it's usually low-res and not well-made
		// This could also be replaced with a while media_type != "image" { getData(url) } but the api has a limit and I don't want (accidentally) to spam it
		// Also not many videos show up so it may not even show up that frequently
		// This could also be resolved by upping the count and choosing a random one until media_type == "image"
		if (json.media_type !== "image") {
			throw new Error("media_type is not image");
		}

		// Proxy if necessary
		const imageUrl = json.hdurl ?? json.url;
		const proxyUrl = set.proxy ? proxy(imageUrl, set) : imageUrl;

		// JSON
		return {
			provider: providerName,
			url: proxyUrl,
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
	proxiedImage.searchParams.set("id", btoa(image.between("e/", ".jpg")));

	return proxiedImage.toString();
}
