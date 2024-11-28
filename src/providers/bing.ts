import type { Settings } from "../interfaces/settings";
import { getJson, randInt } from "../utils";
import type { BingJson } from "../interfaces/bing";
import type { FinalJson } from "../interfaces/stalewall";

const markets = [
  "af-NA",
  "as-IN",
  "eu-ES",
  "zh-CN",
  "en-CA",
  "en-GB",
  "en-US",
  "fr-CA",
  "fr-FR",
  "de-DE",
  "it-IT",
  "ja-JP",
  "pt-BR",
];

// chooses a random wallapaper from list and
export async function provide(set: Settings): Promise<FinalJson> {
  const url = `https://www.bing.com/HPImageArchive.aspx?format=js&n=8&desc=1&idx=${randInt(8)}&mkt=${markets[randInt(markets.length)]}`;
  const json = (await getJson(url)) as BingJson;
  const chosenOne = json.images[randInt(json.images.length)];

  return {
    provider: "bing",
    url: `https://bing.com${chosenOne.urlbase}_UHD.jpg&p=0&pid=hp&qlt=${set.quality}`,
    info: {
      desc: {
        title: chosenOne.title,
        // short description is the location before the copyright info
        short: chosenOne.copyright.substring(
          0,
          chosenOne.copyright.indexOf("("),
        ),
        long: `${chosenOne.desc}\n\n${chosenOne.desc2}`,
      },
      credits: {
        // the copyright info has the location removed and set as the short description
        copyright: chosenOne.copyright.substring(
          chosenOne.copyright.indexOf("(") + 3,
          chosenOne.copyright.indexOf(")"),
        ),
        urls: {
          copyright: chosenOne.copyrightlink,
        },
      },
    },
  };
}