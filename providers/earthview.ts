import type { Settings, StalewallResponse } from "../src/types";
import { getCommonProxyQueries, randInt } from "../src/utils";
import earthviewData from "./earthview_data.json";

const providerName = "earthview";

export async function provide(set: Settings): Promise<StalewallResponse> {
	// Random wallpaper from json
	const chosenOne = earthviewData[randInt(earthviewData.length)];
	console.info("Chosen wallpaper: ", chosenOne);

	// Proxy here is forced as the api returns a JSON with the image encoded in base64 :/
	// I don't really like the idea of embedding a 4mb image into a JSON, so we return a link to the proxy that
	// downloads the image and sends it back
	const proxyUrl = new URL(set.proxyUrl);
	proxyUrl.search = getCommonProxyQueries(set, providerName);
	proxyUrl.searchParams.set("id", btoa(chosenOne.id));

	// JSON
	return {
		provider: providerName,
		url: proxyUrl.toString(),
		info: {
			desc: {
				short: chosenOne.location,
			},
			credits: {
				copyright: chosenOne.attribution,
			},
		},
	};
}
