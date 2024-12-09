import { getWall } from "../src/getWall";
import { providers } from "../src/providerList";
import type { EnvVars } from "../src/types";

// noinspection JSUnusedGlobalSymbols
export default {
	async fetch(request: Request, env: EnvVars): Promise<Response> {
		const url = new URL(request.url);

		// Stop unwanted requests
		if (url.pathname !== "/") {
			return new Response("Requested api endpoint does not exist", { status: 404 });
		}

		// Returns a StalewallResponse Json
		return getWall(url, providers, env);
	},
} satisfies ExportedHandler<EnvVars>;
