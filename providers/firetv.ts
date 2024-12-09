import type { Settings, StalewallResponse } from "../src/types";
import { getCommonProxyQueries, randInt } from "../src/utils";
import ftvData from "./firetv_data.json";

const providerName = "firetv";

export async function provide(set: Settings): Promise<StalewallResponse> {
	// Load json and choose a random wallpaper
	const chosenOne = ftvData[randInt(ftvData.length)];
	console.info("Chosen wallpaper: ", chosenOne);
	// Proxy if necessary
	const imageUrl = set.proxy ? proxy(chosenOne.url, set) : chosenOne.url;

	// JSON
	return {
		provider: providerName,
		url: imageUrl,
		info: {
			desc: {
				short: chosenOne.description,
			},
			credits: {
				copyright: "Unknown/Amazon",
			},
		},
	};
}

function proxy(image: string, settings: Settings): string {
	// Create url and set standard things (like height, width etc.)
	const proxiedImage = new URL(settings.proxyUrl);
	proxiedImage.search = getCommonProxyQueries(settings, providerName);

	// Setting ID
	proxiedImage.searchParams.set("id", btoa(image.after("net/").slice(0, -4)));

	return proxiedImage.toString();
}
