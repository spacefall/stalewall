// part of final json, contains the info about the wallpaper (credits and description)

export interface FinalJson {
	provider: string;
	url: string;
	info: {
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
	};
}

// settings json format
export interface Settings {
	proxy: boolean;
	proxyUrl: string;
	quality: number;
	providers: ProviderList;
	height?: number;
	width?: number;
	keys?: Map<string, string>;
}

export type Provider = (arg0: Settings) => Promise<FinalJson>;
export type ProviderMap = Map<string, Provider>;
export type ProviderList = Array<Provider>;

export type EnvType = {
	PROXY_URL: string;
};
