import type { Settings } from "./interfaces/settings";
import { numberBounds } from "./utils";

export function parseQueries(searchQueries: URLSearchParams): Settings {
    const settings: Settings = {};

    settings.quality = numberBounds(Number.parseInt(searchQueries.get("q") ?? "92"), 0, 100);
    settings.proxy = searchQueries.has("proxy");

    if (searchQueries.has("res")) {
        const res = searchQueries.get("res")?.split("x");
        if (res && res.length === 2) {
            settings.width = Number.parseInt(res[0]);
            settings.height = Number.parseInt(res[1]);
        }
    }

    //TODO: add provider list, env check
    return settings;
}