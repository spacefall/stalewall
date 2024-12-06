import * as bing from "../providers/bing";
import * as chrcast from "../providers/chromecast";
import * as earth from "../providers/earthview";
import * as ftv from "../providers/firetv";
import * as spot from "../providers/spotlight";
import type { ProviderList } from "./types";

// This file exists to import all providers and put them in a list, this would be done at runtime (see devLoadProviders)
// but unfortunately Cloudflare Workers doesn't support fs so they have to be shoved in a list manually

export const providers: ProviderList = [bing, ftv, chrcast, spot, earth].map((prov) => prov.provide);
