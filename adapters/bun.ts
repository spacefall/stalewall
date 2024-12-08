import { getWall } from "../src/getWall";
import { devLoadProviders } from "../src/providersDev";

const provs = devLoadProviders();

const server = Bun.serve({
	port: 3000,
	async fetch(req) {
		const cputime = process.cpuUsage();
		const url = new URL(req.url);

		// stopping any request not on root from continuing
		if (url.pathname !== "/") {
			return new Response("Requested api endpoint does not exist", { status: 404 });
		}
		const wall = await getWall(url, provs, process.env);
		const finalcputime = process.cpuUsage(cputime);
		console.log(
			`CPU time for request:\nUser: ${finalcputime.user / 1000}ms System: ${finalcputime.system / 1000}ms`,
		);
		return wall;
	},
});

console.log(`Listening on ${server.url}`);
