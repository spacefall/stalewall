import { parseQueries } from "./settings";
import type { EnvType, ProviderMap } from "./types";
import { randInt } from "./utils";

export async function getWall(url: URL, provs: ProviderMap, env: EnvType | NodeJS.ProcessEnv): Promise<Response> {
	try {
		const set = parseQueries(url.searchParams, env, provs);
		const apiResp = await set.providers[randInt(set.providers.length)](set);
		return new Response(JSON.stringify(apiResp), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		console.error(err);
		// TODO: make this a bit more professional
		return new Response(`shit broke: ${err}`, { status: 500 });
	}
}
