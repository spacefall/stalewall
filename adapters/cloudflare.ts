import { parseQueries } from "../src/settings";
import { providerArray } from "../src/providerList";
import { randInt } from "../src/utils";

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === "/favicon.ico") {
			return new Response("Favicon doesn't exist", { status: 404 });
		}
		try {
			const set = parseQueries(url.searchParams);
			const apiResp = await providerArray[randInt(providerArray.length)](set);
			return new Response(JSON.stringify(apiResp), {
				headers: { "Content-Type": "application/json" },
			});
		} catch (err) {
			console.error(err);
			// TODO: make this a bit more professional
			return new Response(`shit broke: ${err}`, { status: 500 });
		}
	},
} satisfies ExportedHandler;
