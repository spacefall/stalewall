import { getJson, randInt } from "../utils";
import type { FinalJson } from "../interfaces/stalewall";
import type { FTVJson } from "../interfaces/firetv";

const url =
  "https://gist.githubusercontent.com/spacefall/0cc095656f67e826977c84eecdd89b3c/raw/07553644e25c653fc099aa3e1058456b82c73d6f/firetv.json";

// chooses a random wallapaper from list and returns it in a json
export async function provide(): Promise<FinalJson> {
  const json = (await getJson(url)) as FTVJson[];
  const chosenOne = json[randInt(json.length)];
  return {
    provider: "firetv",
    url: chosenOne.url,
    info: {
      desc: {
        short: chosenOne.description,
      },
      credits: {
        copyright: "Unknown/Amazon",
      },
    },
  };
}
