import type { Settings } from "../src/types";
import { getJson, randInt } from "../src/utils";
import type { FinalJson } from "../src/types";

// json format of the api response
export interface BingJson {
    images: Image[];
    tooltips: Tooltips;
}

export interface Image {
    startdate: string;
    fullstartdate: string;
    enddate: string;
    url: string;
    urlbase: string;
    copyright: string;
    copyrightlink: string;
    title: string;
    desc: string;
    desc2: string;
    quiz: string;
    wp: boolean;
    hsh: string;
    drk: number;
    top: number;
    bot: number;
    hs: [];
}

export interface Tooltips {
    loading: string;
    previous: string;
    next: string;
    walle: string;
    walls: string;
}

// list of bing supported markets
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

// chooses a random wallapaper from list and returns it in a json
export async function provide(set: Settings): Promise<FinalJson> {
    const url = `https://www.bing.com/HPImageArchive.aspx?format=js&n=8&desc=1&idx=${randInt(8)}&mkt=${markets[randInt(markets.length)]}`;
    const json = (await getJson(url)) as BingJson;
    const chosenOne = json.images[randInt(json.images.length)];

    // json build
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
                // the copyright info has the location removed
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
