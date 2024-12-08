import { getSettings } from "./settings";
import type { EnvVars, ProviderMap, Settings } from "./types";
import { randInt } from "./utils";

export async function getWall(url: URL, provs: ProviderMap, env: EnvVars | NodeJS.ProcessEnv): Promise<Response> {
	let settings: Settings;
	try {
		settings = getSettings(url.searchParams, env, provs);
	} catch (e) {
		// @ts-ignore
		return new Response(e.message, { status: 400 });
	}
	try {
		const apiResp = await settings.providers[randInt(settings.providers.length)](settings);
		return new Response(JSON.stringify(apiResp), {
			headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
		});
	} catch (err) {
		console.error(err);
		// TODO: make this a bit more professional
		return new Response(`shit broke: ${err}`, { status: 500 });
	}
}
