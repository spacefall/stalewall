import type { Settings, StalewallResponse } from "../src/types";
import { getCommonProxyQueries, getData, randInt } from "../src/utils";

const providerName = "chromecast";

// URL of the Chromecast homepage (contains a json with 50 wallpapers)
const url = "https://google.com/cast/chromecast/home/";

export async function provide(set: Settings): Promise<StalewallResponse> {
	try {
		// Loads the homepage and extracts the text from the only script tag in the body (which is regenerated on every request)
		const homepage = (await getData(url)) as string;
		if (!homepage) {
			throw new Error("script tag not found");
		}

		const usefulString = homepage.between("JSON.parse('", "')).");

		// I don't know if it's just a bun thing but ì decodeURIComponent will unescape \x sequences only in a repl
		// Here it doesn't work for some reason so \x gets replaced with % which does work
		// I hate escape sequences after this.
		const stringJson = decodeURIComponent(usefulString.replaceAll("\\x", "%").replaceAll("\\\\", "\\"));

		// This json is just a series of nested arrays with strings, numbers and more in them
		// So I can't really give a type to this json unfortunately
		const json = JSON.parse(stringJson);

		const chosenOne = json[0][randInt(50)];

		const imageUrl = `${chosenOne[0].before("=")}=w0`;
		const proxyUrl = set.proxy ? proxy(imageUrl, set) : imageUrl;

		return {
			provider: providerName,
			url: proxyUrl,
			info: {
				credits: {
					copyright: chosenOne[1] ?? "Unknown/Google",
					urls: {
						image: chosenOne[9],
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

	// Set type and id (37 is the first character after "https://ccp-lh.googleusercontent.com/")
	switch (image.charAt(37)) {
		// when url is like https://ccp-lh.googleusercontent.com/proxy/XMMFyAC2fT8o0J60NRLRHbGsgWNeymvVDVe9oAnsEGbzXjHWg3pKuMWv2vcNj0WdBSmeT83jU5S7KikR-gLl8azQcMRsD_OI2i5mP6mhw5BVrdMRYQyteds3l6zTEytqVHVgvtHI3gBKEq_ypoN6N8RcWB1i9mNvP0vlNIK4plc3NvyVJNsFJCCuKM8Zew4nGofeINLDgupVKKVkVQA-7f85h2kfHP_U5gc3Ke0HEOLwCkpfFdrYTzkx26-3Bq63_dCPBtrwO7Bjz9HoWY2Hm5Y7D_SabhrGtQtNQLC9vw_ygb33KXQ=w0
		case "c":
			proxiedImage.searchParams.set("type", "pp");
			proxiedImage.searchParams.set("id", btoa(image.between("s/", "=")));
			break;

		// when url is like https://ccp-lh.googleusercontent.com/chromecast-private-photos/AOhGYywYHL0BVKpXQa_63eXDSWRhfK9RPkP6PZ9uRIvOsyikP05dET7o1OvqoJNjmdrb_tpkmItMOn6a87AU01xmbS6zVh6Tr0q-lJOmcL4sILtmVQCP65Q=w0
		case "p":
			proxiedImage.searchParams.set("type", "pr");
			proxiedImage.searchParams.set("id", btoa(image.between("y/", "=")));
			break;

		default:
			throw new Error("cannot proxy, invalid image url");
	}
	return proxiedImage.toString();
}
