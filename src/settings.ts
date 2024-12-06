import type { EnvType, ProviderList, ProviderMap, Settings } from "./types";
import { numberBounds } from "./utils";

// parses the queries from the webserver to a settings object
export function parseQueries(queries: URLSearchParams, env: EnvType | NodeJS.ProcessEnv, provs: ProviderMap): Settings {
	const settings: Settings = { proxy: false, quality: 92, proxyUrl: "", providers: provs.values().toArray() };
	let providerNames = provs.keys().toArray();

	// quality -> int 0-100
	const qlt = queries.get("q");
	if (qlt) {
		settings.quality = numberBounds(Number.parseInt(qlt), 0, 100);
	}

	if (Number.isNaN(settings.quality)) {
		throw new Error("q is not a number");
	}

	// proxy -> boolean
	settings.proxy = queries.has("proxy");

	// height -> int
	// width -> int
	if (queries.has("res")) {
		const res = queries.get("res")?.split("x");
		if (res && res.length === 2) {
			settings.width = Number.parseInt(res[0]);
			settings.height = Number.parseInt(res[1]);
		} else {
			if (res && res.length < 2) {
				throw new Error("res: too few values");
			}
			if (res && res.length > 2) {
				throw new Error("res: too many values");
			}
		}

		if (Number.isNaN(settings.width) || Number.isNaN(settings.height)) {
			throw new Error("res is not valid");
		}
		settings.proxy = true;
	}

	// list of providers
	if (queries.has("prov")) {
		const provQuery = queries.get("prov");
		const newProvs: ProviderList = [];
		providerNames = [];
		if (provQuery) {
			const chosenProviders = provQuery.split(",");
			for (const prov of chosenProviders) {
				const providerToPush = provs.get(prov);
				if (!providerToPush) {
					throw new Error(`prov: ${prov} is not a valid provider`);
				}
				newProvs.push(providerToPush);
				providerNames.push(prov);
			}
		}
		settings.providers = newProvs;
	}

	// proxy url check
	if (!env.PROXY_URL) {
		throw new Error("PROXY_URL is not specified in environment variables");
	}

	if (!URL.canParse(env.PROXY_URL)) {
		throw new Error("PROXY_URL is invalid");
	}

	settings.proxyUrl = env.PROXY_URL;

	//TODO: add provider list
	console.info("Settings parsed:", settings);
	console.info("Providers:", providerNames);
	return settings;
}
