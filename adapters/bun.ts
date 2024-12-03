import { getWall } from "../src/getWall";
import { devLoadProviders } from "../src/providersDev";

const provs = devLoadProviders();

const server = Bun.serve({
	port: 3000,
	async fetch(req) {
		const url = new URL(req.url);

		// stopping any request not on root from continuing
		if (url.pathname !== "/") {
			return new Response("Requested api endpoint does not exist", { status: 404 });
		}

		return await getWall(url, provs);
	},
});

console.log(`Listening on ${server.url}`);
