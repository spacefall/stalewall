import { getSettings } from "./settings";
import type { EnvVars, ProviderMap, Settings } from "./types";
import { randInt } from "./utils";

/**
 * Asynchronously fetches a response from a random provider based on the given URL parameters and environment variables.
 *
 * @param {URL} url - The URL containing the search parameters used for generating settings.
 * @param {ProviderMap} provs - A map of providers containing all enabled providers, is a provider is not in this map, it doesn't exist.
 * @param {EnvVars | NodeJS.ProcessEnv} env - The environment variables that are used to configure settings.
 *
 * @return {Promise<Response>} A promise that resolves to the response from the selected provider, or an error response if something fails.
 */
export async function getWall(url: URL, provs: ProviderMap, env: EnvVars | NodeJS.ProcessEnv): Promise<Response> {
	let settings: Settings;

	// Parse settings, return a 400 error if it fails (as it's user error usually)
	try {
		settings = getSettings(url.searchParams, env, provs);
	} catch (e) {
		console.error("Error parsing settings:", e);
		if (e instanceof Error)
			return new Response(`Error occurred while parsing queries: ${e.message}`, { status: 400 });
		return new Response(`Unknown error occurred while parsing queries: ${e}`, { status: 400 });
	}

	// Run the provider with the parsed settings, return 500 error if it fails
	try {
		console.group("Provider");
		const apiResp = await settings.providers[randInt(settings.providers.length)](settings);
		console.log("Returned JSON:", apiResp);
		console.groupEnd();
		return new Response(JSON.stringify(apiResp), {
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "*",
			},
		});
	} catch (e) {
		console.error(e);
		if (e instanceof Error)
			return new Response(`Error occurred while getting a wallpaper: ${e.message}`, { status: 500 });
		return new Response(`Unknown error occurred while getting a wallpaper: ${e}`, { status: 500 });
	}
}
