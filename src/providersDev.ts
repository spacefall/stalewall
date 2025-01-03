import * as fs from "node:fs";
import * as path from "node:path";
import type { Provider, ProviderMap } from "./types";

// Loads all js/ts files in the providers folder and adds all valid providers to a providermap
export function devLoadProviders(): ProviderMap {
	const providers: ProviderMap = new Map<string, Provider>();
	const providerPath = path.join(__dirname, "..", "providers");
	const files = fs.readdirSync(providerPath);

	for (const file of files) {
		// loads both js and ts files since bun supports ts trasnspile at runtime
		if (file.endsWith("js") || file.endsWith("ts")) {
			// loads the module and pushes it to providerArray if it contains a function 'provide'
			import(path.join(providerPath, file))
				.then((module) => {
					if (typeof module.provide === "function") {
						providers.set(file.before("."), module.provide);
						console.log(`Loaded module: ${file.before(".")}`);
					} else {
						console.warn(`Module ${file.before(".")} does not contain function 'provide'`);
					}
				})
				.catch((err) => {
					console.error(`Error occurred while loading module ${file}:`, err);
				});
		}
	}
	return providers;
}
