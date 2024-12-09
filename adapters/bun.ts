import { getWall } from "../src/getWall";
import { devLoadProviders } from "../src/providersDev";

// Load providers from folder
const provs = devLoadProviders();

const server = Bun.serve({
	port: 3000,
	async fetch(req) {
		const url = new URL(req.url);

		// Block unwanted requests
		if (url.pathname !== "/") {
			return new Response("Requested api endpoint does not exist", { status: 404 });
		}

		// Start measuring cpu time
		const cputime = process.cpuUsage();
		// Get the wallpaper
		const wall = await getWall(url, provs, process.env);
		// Stop measuring
		const finalcputime = process.cpuUsage(cputime);

		// Print the results (cpu time)
		console.group("CPU Time");
		console.log(`User: ${finalcputime.user / 1000}ms`);
		console.log(`System: ${finalcputime.system / 1000}ms`);
		console.log(`Total: ${(finalcputime.user + finalcputime.system) / 1000}ms`);
		console.groupEnd();
		return wall;
	},
});

console.log(`Listening on ${server.url}`);
