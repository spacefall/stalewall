import type { Settings } from "./types";
import { numberBounds } from "./utils";

// parses the queries from the webserver to a settings object
export function parseQueries(queries: URLSearchParams): Settings {
	const settings: Settings = {};

	// quality -> int 0-100
	settings.quality = numberBounds(Number.parseInt(queries.get("q") ?? "92"), 0, 100);

	if (Number.isNaN(settings.quality)) {
		throw new Error("q is not a number");
	}

	// proxy -> boolean
	//settings.proxy = searchQueries.has("proxy");

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
	}

	//TODO: add provider list, env check
	console.info("Settings parsed:", settings);
	return settings;
}
