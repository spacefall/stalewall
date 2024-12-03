import { devLoadProviders } from "../src/providersDev";
import { parseQueries } from "../src/settings";
import { randInt } from "../src/utils";

const provs = devLoadProviders();

const server = Bun.serve({
	port: 3000,
	async fetch(req) {
		const url = new URL(req.url);

		// stopping any request not on root from continuing
		if (url.pathname !== "/") {
			return new Response("Requested api endpoint does not exist", { status: 404 });
		}

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
	},
});

console.log(`Listening on ${server.url}`);
