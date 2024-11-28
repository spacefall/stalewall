import * as fs from "node:fs";
import * as path from "node:path";
import { randInt } from "./utils";
import type { Settings } from "./interfaces/settings";
import type { FinalJson } from "./interfaces/stalewall";

const providerArray: Array<(set: Settings) => FinalJson> = []

const settings: Settings = {
    quality: 100
}

//loads all providers in folder to providerArray
export function loadProviders() {
    const files = fs.readdirSync(path.join(__dirname, "providers"));

    for (const file of files) {
        if (file.endsWith("js") || file.endsWith("ts")) {
            import(`./providers/${file}`).then((module) => {
                if (typeof module.provide === 'function') {
                    providerArray.push(module.provide);
                    console.log(`Loaded module ${file}`);
                } else {
                    console.warn(`Module ${file} does not contain function 'provide'`);
                }
            }).catch(err => {
                console.error(`Error occurred while loading module ${file}:`, err);
            });
        }
    }
}

export async function serveProvider(): Promise<FinalJson> {
    return providerArray[randInt(providerArray.length)](settings);
}

