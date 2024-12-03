import { parseQueries } from "./settings";
import type { ProviderList } from "./types";
import { randInt } from "./utils";

export async function getWall(url: URL, provs: ProviderList): Promise<Response> {
	try {
		const set = parseQueries(url.searchParams);
		const apiResp = await provs[randInt(provs.length)](set);
		return new Response(JSON.stringify(apiResp), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		console.error(err);
		// TODO: make this a bit more professional
		return new Response(`shit broke: ${err}`, { status: 500 });
	}
}
