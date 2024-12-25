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
	const url = `https://api.nasa.gov/planetary/apod?count=3&thumbs=true&api_key=${set.keys?.get(providerName)}`;
	try {
		const jsonList = (await getData(url)) as PartialApodJson[];
		let jsonIndex = 0;

		// Kinda solved the issue with the videos, it just tries 3 times
		while (jsonList[jsonIndex].media_type !== "image" && jsonIndex < jsonList.length) {
			jsonIndex++;
		}

		// Shouldn't happen really (hopefully)
		if (jsonList[jsonIndex].media_type !== "image") {
			throw new Error("media_type is not image after 3 attempts");
		}

		const json = jsonList[jsonIndex];
		console.info("Original JSON:", json);

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
					copyright: json.copyright ?? "Public domain/NASA",
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
