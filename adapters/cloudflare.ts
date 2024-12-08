import { getWall } from "../src/getWall";
import { providers } from "../src/providerList";
import type { EnvVars } from "../src/types";

// noinspection JSUnusedGlobalSymbols
export default {
	async fetch(request: Request, env: EnvVars, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// stops all pathnames that aren't / from continuing as someone tried to get login info on the worker.dev domain
		// the api just responded with a wallpaper, but it might be better to block them instead of ignoring them
		if (url.pathname !== "/") {
			return new Response("Requested api endpoint does not exist", { status: 404 });
		}
		return getWall(url, providers, env);
	},
} satisfies ExportedHandler<EnvVars>;
