import * as cheerio from "cheerio";
import type { FinalJson } from "../src/types";
import { getText, randInt } from "../src/utils";

// url of the chromecast homepage (contains a json with 50 wallpapers)
const url = "https://google.com/cast/chromecast/home/";

// Grabs a list of wallpapers from the Chromecast homepage and returns one
// noinspection JSUnusedGlobalSymbols
export async function provide(): Promise<FinalJson> {
    // loads the homepage and extracts the text from the only script tag in the body (which is regenerated on every request)
    const homepage = await getText(url);
    const $ = cheerio.load(homepage);
    const scriptTagText = $("body > script").text();
    if (!scriptTagText) {
        throw new Error("chromecast: script tag not found");
    }

    const usefulString = scriptTagText.substring(
        scriptTagText.indexOf("JSON.parse('") + 12,
        scriptTagText.indexOf("'))."),
    );

    // I don't know if it's just a bun thing but ì decodeURIComponent will unescape \x sequences only in a repl
    // Here it doesn't work for some reason so \x gets replaced with % which does work
	  // I hate escape sequences after this.
    const stringJson = decodeURIComponent(usefulString.replaceAll("\\x", "%").replaceAll("\\\\", "\\"));

    // This json is just a series of nested arrays with strings, numbers and more in them
    // So I can't really give a type to this json unfortunately
    const json = JSON.parse(stringJson);

    const chosenOne = json[0][randInt(50)];

    return {
        provider: "chromecast",
        url: chosenOne[0],
        info: {
            credits: {
                copyright: chosenOne[1],
                urls: {
                    image: chosenOne[9],
                }
            }
        }
    }
}
