import { defaultProviders, providersWithApiKeys } from "./providerList";
import type { ProviderList, ProviderMap, Settings } from "./types";

/**
 * Parses and retrieves the settings from the given query parameters, environment variables,
 * and provider map.
 *
 * @param {URLSearchParams} queries - The query parameters from the request.
 * @param {Object.<string, string | undefined>} env - The environment variables that may contain
 *    configuration such as the proxy URL.
 * @param {ProviderMap} provs - Map of providers that is then filtered according to the queries.
 * @return {Settings} - The settings object containing the parsed and configured settings.
 */
export function getSettings(
	queries: URLSearchParams,
	env: { [type: string]: string | undefined },
	provs: ProviderMap,
): Settings {
	const settings: Settings = { proxy: false, quality: 92, proxyUrl: "", providers: [] };

	// quality -> int 0-100
	settings.quality = parseQuality(queries.get("quality"));

	// proxy -> boolean
	// value is also changed in res
	settings.proxy = queries.has("proxy");

	// height -> int
	// width -> int
	const res = parseRes(queries.get("res"));
	if (res) {
		settings.width = res.width;
		settings.height = res.height;
		settings.proxy = true;
	}

	// prov -> ProviderList
	const provList = queries.get("prov")?.split(",") ?? defaultProviders;
	const { providers, apiKeys } = parseProviders(provList, provs, env);
	settings.providers = providers;
	if (apiKeys.size > 0) {
		settings.keys = apiKeys;
	}

	// proxy url check (env var)
	settings.proxyUrl = validateProxyURL(env.PROXY_URL);

	// logging
	console.group("Settings");
	console.log("quality:", settings.quality);
	console.log("proxy:", settings.proxy);
	if (res) console.log("res:", settings.width, settings.height);
	console.log("providers:", provList);
	console.groupEnd();

	return settings;
}

function parseQuality(qualityStr: string | null): number {
	if (qualityStr) {
		const quality = Number.parseInt(qualityStr);
		if (Number.isNaN(quality)) {
			throw new Error("quality: not a valid number");
		}
		if (quality < 0 || quality > 100) {
			throw new Error("quality: not in range 0-100");
		}
		return quality;
	}
	return 92;
}

function parseRes(resStr: string | null): { width: number; height: number } | undefined {
	if (!resStr) return undefined;
	const res = resStr.split("x");
	if (res.length !== 2) {
		throw new Error(`res: ${res.length < 2 ? "too few" : "too many"} values`);
	}
	const width = Number.parseInt(res[0]);
	const height = Number.parseInt(res[1]);
	if (Number.isNaN(width) || Number.isNaN(height)) {
		throw new Error("res: not a valid number");
	}
	return { width, height };
}

function parseProviders(
	provList: string[],
	provMap: ProviderMap,
	env: { [type: string]: string | undefined },
): { providers: ProviderList; apiKeys: Map<string, string> } {
	const providers: ProviderList = [];
	const apiKeys = new Map<string, string>();

	for (const prov of provList) {
		const provider = provMap.get(prov);
		if (!provider) throw new Error(`prov: ${prov} is not a valid provider`);
		providers.push(provider);
		if (providersWithApiKeys.includes(prov)) {
			const key = env[`${prov.toUpperCase()}_API_KEY`];
			if (!key) throw new Error(`prov: ${prov} requires an API key, but no API key was set`);
			apiKeys.set(prov, key);
		}
	}
	return { providers, apiKeys };
}

function validateProxyURL(proxyUrl: string | undefined): string {
	if (!proxyUrl) {
		throw new Error("PROXY_URL: not specified in environment variables");
	}
	if (!URL.canParse(proxyUrl)) {
		throw new Error("PROXY_URL: invalid url");
	}
	return proxyUrl;
}
