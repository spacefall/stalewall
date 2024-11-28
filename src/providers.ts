import * as fs from "node:fs";
import * as path from "node:path";
import { randInt } from "./utils";
import type { FinalJson, Settings } from "./types";

// Q: why is this array used to store providers?
// A: it's the first way I thought of to load providers and serve them randomly (aka load'em into an array and access the array with Math.random)
const providerArray: Array<(set: Settings) => FinalJson> = [];

// loads providers from "providers" folder
export function loadProviders() {
    const providerPath = path.join(__dirname, "..", "providers");
    const files = fs.readdirSync(providerPath);

    for (const file of files) {
        // loads both js and ts files since bun supports ts trasnspile at runtime
        if (file.endsWith("js") || file.endsWith("ts")) {
            // loads the module and pushes it to providerArray if it contains a function 'provide'
            import(path.join(providerPath, file))
                .then((module) => {
                    if (typeof module.provide === "function") {
                        providerArray.push(module.provide);
                        console.log(`Loaded module ${file}`);
                    } else {
                        console.warn(
                            `Module ${file} does not contain function 'provide'`,
                        );
                    }
                })
                .catch((err) => {
                    console.error(
                        `Error occurred while loading module ${file}:`,
                        err,
                    );
                });
        }
    }
}

// serves a random provider from providerArray
// most of the work is done in the provider itself, so this function just pics a random provider
export async function serveProvider(set: Settings): Promise<FinalJson> {
    return providerArray[randInt(providerArray.length)](set);
}
