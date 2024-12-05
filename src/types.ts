// part of final json, contains the info about the wallpaper (credits and description)
export interface InfoJson {
	desc?: {
		title?: string;
		short?: string;
		long?: string;
	};
	credits: {
		copyright: string;
		urls?: {
			copyright?: string;
			image?: string;
		};
	};
}

// final json format
export interface FinalJson {
	provider: string;
	url: string;
	info: InfoJson;
}

// settings json format
export interface Settings {
	proxy: boolean;
	proxyUrl: string;
	quality: number;
	height?: number;
	width?: number;
}

export type ProviderList = Array<(arg0: Settings) => Promise<FinalJson>>;

export type EnvType = {
	PROXY_URL: string;
};
