import type { FinalJson, Settings } from "../src/types";
import { getJson, randInt } from "../src/utils";

// This array is a list of all locales supported by Windows Spotlight
// biome-ignore format: this array expanded is about 338 lines, it's better to keep it in a single line (sorry)
const locales = ["af-NA", "af-ZA", "sq-AL", "sq-XK", "sq-MK", "am-ET", "ar-DZ", "ar-BH", "ar-TD", "ar-KM", "ar-DJ", "ar-EG", "ar-ER", "ar-IQ", "ar-IL", "ar-JO", "ar-KW", "ar-LB", "ar-LY", "ar-MR", "ar-MA", "ar-OM", "ar-PS", "ar-QA", "ar-SA", "ar-SO", "ar-SS", "ar-SD", "ar-TN", "ar-AE", "ar-001", "ar-YE", "hy-AM", "as-IN", "az-Latn", "bn-BD", "bn-IN", "eu-ES", "bs-Latn", "bg-BG", "ca-AD", "ca-ES", "ca-FR", "ca-IT", "zh-Hans", "zh-Hans", "zh-CN", "zh-SG", "zh-Hant", "zh-Hant", "zh-HK", "zh-MO", "zh-TW", "hr-HR", "hr-BA", "cs-CZ", "da-DK", "da-GL", "nl-AW", "nl-BE", "nl-BQ", "nl-CW", "nl-NL", "nl-SX", "nl-SR", "en-AS", "en-AI", "en-AG", "en-AU", "en-AT", "en-BS", "en-BB", "en-BE", "en-BZ", "en-BM", "en-BW", "en-IO", "en-VG", "en-BI", "en-CM", "en-CA", "en-029", "en-KY", "en-CX", "en-CC", "en-CK", "en-CY", "en-DK", "en-DM", "en-ER", "en-150", "en-FK", "en-FJ", "en-FI", "en-GM", "en-DE", "en-GH", "en-GI", "en-GD", "en-GU", "en-GG", "en-GY", "en-HK", "en-IN", "en-ID", "en-IE", "en-IM", "en-IL", "en-JM", "en-JE", "en-KE", "en-KI", "en-LS", "en-LR", "en-MO", "en-MG", "en-MW", "en-MY", "en-MT", "en-MH", "en-MU", "en-FM", "en-MS", "en-NA", "en-NR", "en-NL", "en-NZ", "en-NG", "en-NU", "en-NF", "en-MP", "en-PK", "en-PW", "en-PG", "en-PN", "en-PR", "en-PH", "en-RW", "en-KN", "en-LC", "en-VC", "en-WS", "en-SC", "en-SL", "en-SG", "en-SX", "en-SI", "en-SB", "en-ZA", "en-SS", "en-SH", "en-SD", "en-SZ", "en-SE", "en-CH", "en-TZ", "en-TK", "en-TO", "en-TT", "en-TC", "en-TV", "en-UG", "en-GB", "en-US", "en-UM", "en-VI", "en-VU", "en-001", "en-ZM", "en-ZW", "et-EE", "fil-PH", "fi-FI", "fr-DZ", "fr-BE", "fr-BJ", "fr-BF", "fr-BI", "fr-CM", "fr-CA", "fr-029", "fr-CF", "fr-TD", "fr-KM", "fr-CD", "fr-CG", "fr-CI", "fr-DJ", "fr-GQ", "fr-FR", "fr-GF", "fr-PF", "fr-GA", "fr-GP", "fr-GN", "fr-HT", "fr-LU", "fr-MG", "fr-ML", "fr-MQ", "fr-MR", "fr-MU", "fr-YT", "fr-MC", "fr-MA", "fr-NC", "fr-NE", "fr-RE", "fr-RW", "fr-BL", "fr-MF", "fr-PM", "fr-SN", "fr-SC", "fr-CH", "fr-TG", "fr-TN", "fr-VU", "fr-WF", "gl-ES", "ka-GE", "de-AT", "de-BE", "de-DE", "de-IT", "de-LI", "de-LU", "de-CH", "el-CY", "el-GR", "gu-IN", "he-IL", "hi-IN", "hu-HU", "is-IS", "id-ID", "ga-IE", "it-IT", "it-SM", "it-CH", "it-VA", "ja-JP", "kn-IN", "kk-KZ", "km-KH", "kok-IN", "ko-KR", "lo-LA", "lv-LV", "lt-LT", "lb-LU", "mk-MK", "ms-BN", "ms-SG", "ms-MY", "ml-IN", "mt-MT", "mi-NZ", "mr-IN", "ne-IN", "ne-NP", "nb-NO", "nb-SJ", "nn-NO", "or-IN", "pl-PL", "pt-AO", "pt-BR", "pt-CV", "pt-GQ", "pt-GW", "pt-LU", "pt-MO", "pt-MZ", "pt-PT", "pt-ST", "pt-CH", "pt-TL", "pa-Arab", "pa-IN", "ro-MD", "ro-RO", "ru-BY", "ru-KZ", "ru-KG", "ru-MD", "ru-UA", "gd-GB", "sr-Cyrl", "sr-Latn", "sk-SK", "sl-SI", "es-AR", "es-BZ", "es-VE", "es-BO", "es-BR", "es-CL", "es-CO", "es-CR", "es-DO", "es-EC", "es-SV", "es-GQ", "es-GT", "es-HN", "es-419", "es-MX", "es-NI", "es-PA", "es-PY", "es-PE", "es-PH", "es-PR", "es-ES", "es-US", "es-UY", "sv-AX", "sv-FI", "sv-SE", "ta-IN", "ta-MY", "ta-SG", "ta-LK", "te-IN", "th-TH", "tr-CY", "tr-TR", "uk-UA", "ur-IN", "ur-PK", "ug-CN", "uz-Latn", "vi-VN", "cy-GB"]

// json structure up to item
interface SpotlightJsonExt {
	batchrsp: {
		ver: string;
		items: [
			{
				item: string;
			},
		];
	};
}

// json structure of parsed item
interface SpotlightJsonInt {
	f: string;
	v: string;
	rdr: [
		{
			c: string;
			u: string;
		},
	];
	ad: {
		landscapeImage: {
			asset: string;
		};
		portraitImage: {
			asset: string;
		};
		iconLabel: string;
		iconHoverText: string;
		title: string;
		description: string;
		copyright: string;
		likeGlyph: string;
		dislikeGlyph: string;
		ctaText: string;
		ctaUri: string;
		relatedContent: [
			{
				glyph: string;
				label: string;
				actionUri: string;
			},
		];
		relatedHotspots: [
			{
				glyph: string;
				label: string;
				actionUri: string;
			},
		];
		entityId: string;
	};
	tracking: {
		baseUri: string;
	};
	prm: {
		_id: string;
		_imp: string;
		_flight: string;
	};
}

// This implementation wouldn't have been possible without ORelio's api docs: https://github.com/ORelio/Spotlight-Downloader/blob/master/SpotlightAPI.md
export async function provide(set: Settings): Promise<FinalJson> {
	const chosenLocale = locales[randInt(locales.length)];
	const url = `https://fd.api.iris.microsoft.com/v4/api/selection?&placement=88000820&bcnt=1&fmt=json&country=${chosenLocale.after("-")}&locale=${chosenLocale}`;
	const extJson = (await getJson(url)) as SpotlightJsonExt;
	const intJson = JSON.parse(extJson.batchrsp.items[0].item) as SpotlightJsonInt;
	const finalJson: FinalJson = {
		provider: "spotlight",
		url: intJson.ad.landscapeImage.asset,
		info: {
			desc: {
				title: intJson.ad.title,
				short: intJson.ad.iconHoverText.before("\r\n"),
				long: intJson.ad.description,
			},
			credits: {
				copyright: intJson.ad.copyright,
			},
		},
	};
	if (set.proxy) {
		finalJson.url = proxy(finalJson.url, set.proxyUrl, set.width, set.height);
	}
	return finalJson;
}

function proxy(img: string, proxyUrl: string, width?: number, height?: number): string {
	const finalURL = new URL(proxyUrl);

	// setting provider
	finalURL.searchParams.set("prov", "spotlight");

	switch (img.charAt(8)) {
		// when url is like https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW1l7hh?ver=63b7
		case "i":
			finalURL.searchParams.set("type", "ip");
			finalURL.searchParams.set("id", btoa(img.after("a/")));
			break;

		// when url is like https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RW1l25r
		case "q":
			finalURL.searchParams.set("type", "qp");
			finalURL.searchParams.set("id", btoa(img.after("y/")));
			break;

		// when url is like https://res.public.onecdn.static.microsoft/creativeservice/01916e96-57ee-b813-2ace-01284739093d_desktop-b014_ds_namibnaukluftnpnamibia_adobestock_131713381_3840x2160.jpg
		case "r":
			finalURL.searchParams.set("type", "rp");
			finalURL.searchParams.set("id", btoa(img.after("e/").slice(0, -4)));
			break;
		default:
			throw new Error("Invalid spotlight image url");
	}

	if (height && width) {
		finalURL.searchParams.set("h", height.toString());
		finalURL.searchParams.set("w", width.toString());
	}

	return finalURL.toString();
}
