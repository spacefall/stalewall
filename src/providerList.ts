import * as bing from "../providers/bing";
import * as chrcast from "../providers/chromecast";
import * as ftv from "../providers/firetv";
import * as spot from "../providers/spotlight";
import type { FinalJson, Settings } from "./types";

// This file exists to import all providers and put them in a list, this would be done at runtime (see devLoadProviders)
// but unfortunately Cloudflare Workers doesn't support fs so they have to be shoved in a list manually

export const providerArray: Array<(set: Settings) => Promise<FinalJson>> = [bing.provide, ftv.provide, chrcast.provide, spot.provide];
