import { getSettings } from "./settings";
import type { EnvVars, ProviderMap } from "./types";
import { randInt } from "./utils";

export async function getWall(url: URL, provs: ProviderMap, env: EnvVars | NodeJS.ProcessEnv): Promise<Response> {
	try {
		const settings = getSettings(url.searchParams, env, provs);
		const apiResp = await settings.providers[randInt(settings.providers.length)](settings);
		return new Response(JSON.stringify(apiResp), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		console.error(err);
		// TODO: make this a bit more professional
		return new Response(`shit broke: ${err}`, { status: 500 });
	}
}
