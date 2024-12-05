import type { EnvType, Settings } from "./types";
import { numberBounds } from "./utils";

// parses the queries from the webserver to a settings object
export function parseQueries(queries: URLSearchParams, env: EnvType | NodeJS.ProcessEnv): Settings {
	const settings: Settings = { proxy: false, quality: 92, proxyUrl: "" };

	// quality -> int 0-100
	const qlt = queries.get("q");
	if (qlt) {
		settings.quality = numberBounds(Number.parseInt(qlt), 0, 100);
	}

	if (Number.isNaN(settings.quality)) {
		throw new Error("q is not a number");
	}

	// proxy -> boolean
	settings.proxy = queries.has("proxy");

	// height -> int
	// width -> int
	if (queries.has("res")) {
		const res = queries.get("res")?.split("x");
		if (res && res.length === 2) {
			settings.width = Number.parseInt(res[0]);
			settings.height = Number.parseInt(res[1]);
		} else {
			if (res && res.length < 2) {
				throw new Error("res: too few values");
			}
			if (res && res.length > 2) {
				throw new Error("res: too many values");
			}
		}

		if (Number.isNaN(settings.width) || Number.isNaN(settings.height)) {
			throw new Error("res is not valid");
		}
		settings.proxy = true;
	}

	if (settings.proxy && env.PROXY_URL) {
		if (!URL.canParse(env.PROXY_URL)) {
			throw new Error("PROXY_URL is invalid");
		}
		settings.proxyUrl = env.PROXY_URL;
	} else if (settings.proxy && !env.PROXY_URL) {
		throw new Error("PROXY_URL is not specified in environment variables");
	}

	//TODO: add provider list
	console.info("Settings parsed:", settings);
	return settings;
}
