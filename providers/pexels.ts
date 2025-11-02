import type { Settings } from "../src/types";
import type { StalewallResponse } from "../src/types";
import { getData, randInt } from "../src/utils";

const providerName = "pexels";

// Pexels collections response
export interface PexelsJson {
	media: {
		alt: string;
		width: number;
		height: number;
		url: string;
		photographer: string;
		photographer_url: string;
		photographer_id: number;
		src: {
			original: string;
		};
	}[];
}

// A list of collections to randomly choose, it's kinda big (160 items) and it took quite a while make but it has 13000+ images so i think it adds a lot of variety
const collections: Map<string, number> = new Map([
	["9lesipe", 163], //#dronelife
	["ibjj75j", 67], //Africa
	["oic4min", 291], //Amazing Landscapes
	["h8stntd", 138], //Animals
	["usy2j0g", 113], //Astrophotography
	["vlhsvu3", 99], //Aurora Gold
	["7aceoqp", 129], //Aurora Skies
	["xfllmkz", 108], //Aurora Skies
	["tr22rsl", 66], //Australia
	["mi3up33", 59], //Autumn Desktop Wallpapers
	["dywizpd", 95], //Autumn Leaves
	["ebp689w", 92], //Autumn Wallpapers
	["mwzkar3", 61], //Beach Sunsets
	["5p1yu5u", 106], //Beach Wallpapers
	["eulhibt", 21], //Beautiful Backgrounds
	["tqga8gk", 106], //Beautiful Landscapes
	["e3uq82x", 111], //Beautiful Skies
	["5ddk9ze", 70], //Beautiful Zoom Backgrounds
	["9jcjkih", 95], //Best Of Buildings
	["hzerzqh", 54], //Best of Japan
	["oqhg5wh", 258], //Best Of Macro
	["ja61psj", 249], //Best Of Wallpapers
	["iw9agrt", 31], //Bikes
	["369y68p", 131], //Birds
	["9sw8t59", 180], //Birds Eye View
	["mqjkyef", 122], //Blue Aesthetic
	["nsczbjd", 59], //Blue Flowers
	["fppfy6o", 49], //Boats
	["3qnnss0", 166], //Buildings
	["vbxvu2g", 33], //Buildings
	["kpeic8f", 127], //Butterflies
	["84p9di6", 72], //Cabin In The Woods
	["xlb95hq", 68], //Calming Lakes
	["dw6zl6x", 113], //Castles
	["ud5i27d", 72], //Cherry Blossoms In Bloom
	["gr0a7ek", 53], //China
	["ns9k4g8", 51], //Cities In The Night
	["kudaxhv", 93], //Citiyscapes
	["gyeicaf", 97], //Clouds
	["jnxtcnx", 132], //Coastal Life
	["kv44eql", 76], //Cold Weather Blues â„ï¸
	["ddybiyd", 59], //Color: Red
	["v8cw86j", 96], //Dark Backgrounds
	["h9qufva", 56], //Dark Green Nature
	["lamirvz", 65], //Deserts
	["sbbslu5", 34], //Dewdrop Reflections
	["qp01hav", 159], //Drone Shot
	["j0ihm3a", 89], //Dunes
	["uard3w7", 20], //Eagles
	["v5gk14h", 102], //Earth Unfiltered
	["32h4igf", 125], //Fall Colors
	["9plvf50", 78], //Fall Decor Inspiration
	["ptg7ywo", 208], //Feline Friends ðŸ±
	["xzvcls8", 53], //Fields Of Green
	["uefplky", 67], //Fish
	["wnqdced", 65], //Flower Backgrounds
	["eqmlpo6", 37], //Flower Gardens
	["kkchgxe", 39], //Fly High
	["rmc5knf", 94], //Foggy Forests
	["i65nd00", 138], //Foliage
	["abimmfd", 144], //Food
	["a45g2hw", 42], //Forest
	["mcpqsra", 48], //Frost
	["sga0vxh", 60], //Full Moon Glow
	["coxzweb", 72], //Fungi
	["7ai9hep", 83], //Gradient
	["zpwhbcc", 75], //Green Desktop Backgrounds
	["3mlznrz", 20], //Highways
	["zwykscd", 50], //Hiking
	["de1vdyw", 39], //Ice Ice Baby
	["nkpr355", 90], //Iceland
	["ywitytf", 50], //Islands
	["shrhxjk", 46], //Italy
	["pw7terc", 80], //Jellyfish
	["wcqf5h2", 57], //Jellyfish
	["uslxc6u", 41], //lakes + reflections
	["jgiu9ii", 75], //Lavender Dreams
	["wa3ohdn", 46], //Lightning
	["5jjnkjn", 84], //Lotus Flowers
	["sysbccd", 38], //Making Waves
	["m4kswat", 65], //Marigold Dreams
	["cwgidat", 119], //Mighty Mountains
	["48l0h38", 130], //Milky Way Galaxy
	["e9ostbh", 133], //Moonrise Kingdom ðŸŒ’
	["91mwque", 60], //Morning Sun
	["84d5jca", 52], //National Bee Awareness Day
	["q3v1wjd", 106], //Nature Reverie
	["dpuvdx7", 106], //Nature Wallpapers
	["l7peg8v", 63], //Nature's Small Details
	["ektcwdf", 45], //Neon Colors
	["eg0ubyv", 80], //Neon-Noir
	["kq1u7vh", 87], //Night Lights
	["ihtiz2u", 85], //Night Skies
	["lvi9kfn", 31], //Night Time
	["xxxmtks", 96], //Night Time
	["lpbcdm1", 97], //One Flower
	["vxjgm5r", 24], //Owls
	["pec4v27", 72], //PC Wallpapers
	["3ezi1en", 68], //Pink skies
	["wqan45k", 120], //Plant Backgrounds
	["2r9xsvp", 95], //Pollinators
	["mboyk0q", 121], //Pretty Backgrounds
	["jb6r1s4", 61], //Rainbow Backgrounds
	["tq6q5jj", 121], //Reptiles
	["uyqjgvs", 51], //Rivers Flow
	["g5o0cec", 30], //Rocks
	["ze2ermq", 79], //Romania
	["ntuu9wg", 47], //Sailboats For Mary â›µ
	["inmfz0v", 99], //Scenic Views
	["26hkdmt", 74], //Scotland
	["alttuky", 87], //Seascapes
	["xq5g6nx", 103], //Seashells From The Seashore
	["mc7ibxb", 57], //Ships
	["uhvgflr", 69], //Skylines
	["jjf26ij", 92], //Snow is Falling
	["npd5xek", 47], //Snowy Days
	["kszksep", 102], //Somewhere Over The Rainbow
	["fpqhz1c", 77], //Soothing Colours
	["vsjdlqy", 42], //Space ðŸª âœ¨
	["3onyhbm", 65], //Space Wallpapers
	["p54jp4d", 52], //Space: The Final Frontier
	["pnvbcqd", 47], //Spring Time
	["j5y9dtd", 38], //Starry Skies
	["lbe8bv4", 42], //Stones
	["fpyycnd", 78], //Stormy Weather
	["qvb4vxb", 94], //Streets At Night
	["y2e7wcu", 155], //Sunflowers
	["zvp2j2m", 42], //Sunset
	["e0fifvd", 78], //Switzerland
	["vzdsnyi", 59], //Textiles
	["7szvzph", 102], //Textured Botanicals
	["s0yl2o2", 15], //The Eclipse - Curator Picks
	["7vvlgjc", 58], //The Hidden Spectrum
	["95jccrd", 60], //The Moon
	["fchhrfy", 71], //The Power Of Water
	["b5sgybo", 89], //Tulips
	["gqg4zqs", 110], //Twilight Skies
	["ftgeo7k", 53], //Up In Space
	["ydh0gk5", 70], //Wales
	["3dr8gy8", 113], //Wallpapers: Black
	["65nkrie", 58], //Wallpapers: Green
	["hoz264t", 62], //Wallpapers: Roses ðŸŒ¹
	["gq42jee", 94], //Wallpapers: White
	["jbnnqe2", 45], //White Clouds
	["7a04uy3", 88], //White Flowers
	["ofyw7dd", 92], //Wild Flowers
	["zeq8cje", 209], //Wildlife
	["91hm8tk", 108], //Winter
	["uq9nuzt", 93], //Winter Landscapes
	["63ehcmp", 99], //Winter Nights
	["rhryly0", 91], //Winter Solstice
	["46qp0mt", 113], //Winter Wallpapers
	["ougyjjc", 40], //Wolves
	["69slvqq", 60], //Wonderful Trees
	["khw7vdd", 117], //Wonderful Waterfalls
	["8i4rkfl", 95], //World Wildlife Day
	["ylxa5x6", 106], //Yellow Flowers Aesthetic
	["bhrlwyy", 64], //Yellow Roses Collection
	["jqhmujd", 103], //Zoom Backgrounds
	["xbncfpg", 40], //Zoom Backgrounds - Nature
]);

export async function provide(set: Settings): Promise<StalewallResponse> {
	console.time("t1");
	const landscape = (set.width ?? 16) > (set.height ?? 9);

	// Gets a collection from the list above "randomly", giving priority to the collections with the biggest number of photos
	// Gets the as many photos as possible (80) and to shuffle it up, randomly chooses asc or desc order
	const randColl = weightedRand(collections);
	const orderBy = randInt(2) ? "asc" : "desc";
	console.info("Collection:", randColl);
	const url = `https://api.pexels.com/v1/collections/${randColl}?per_page=80&type=photos&sort=${orderBy}`;
	console.info("URL:", url);
	console.timeLog("t1", "Fetched URL");

	try {
		// Grab only images with correct orientation
		let correctOrientation: PexelsJson["media"] = [];
		let tries = 0;
		do {
			tries++;
			const collJson = (await getData(url, {
				Authorization: set.keys?.get(providerName) ?? "",
			})) as PexelsJson;
			console.timeLog("t1", "Got JSON");

			correctOrientation = collJson.media.filter((item) => {
				if (landscape) {
					return item.width >= item.height;
				}
				return item.height > item.width;
			});
		} while (correctOrientation.length === 0 && tries <= 5);
		console.timeLog("t1", "Filtered JSON");
		const choice = correctOrientation[randInt(correctOrientation.length)];

		// Don't proxy (ever) (pexels is also against it, i think)
		const imageUrl = `${choice.src.original}?fit=crop&crop=entropy&fm=jpg&q=${set.quality}${
			set.height && set.width ? `&w=${set.width}&h=${set.height}` : ""
		}`;

		// JSON
		return {
			provider: providerName,
			url: imageUrl,
			info: {
				desc: {
					short: choice.alt,
				},
				credits: {
					copyright: choice.photographer,
					urls: {
						author: `${choice.photographer_url}?utm_source=stalewall&utm_medium=referral`,
						image: `${choice.url}?utm_source=stalewall&utm_medium=referral`,
					},
				},
			},
		};
	} catch (e) {
		if (e instanceof Error) throw new Error(`${providerName}: ${e.message}`);
		// ? means that IDK what happened as the error is not an Error, but it has been thrown anyway
		throw new Error(`${providerName}?: ${e}`);
	}
}

function weightedRand(collections: Map<string, number>): string {
	let sum = 0;
	for (const v of collections.values()) {
		sum += v;
	}
	const rand = randInt(sum);
	let current = 0;
	for (const [k, v] of collections) {
		current += v;
		if (rand < current) return k;
	}
	// wtf happened
	return "2"; // it's a valid collection id
}
