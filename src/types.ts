// Provider type is based on the provide functions
export type Provider = (arg0: Settings) => Promise<StalewallResponse>;
// ProviderMap is a map with name of provider and the related provide function
export type ProviderMap = Map<string, Provider>;
// ProviderList is just an array of provide functions
export type ProviderList = Array<Provider>;

// Settings used in the api, some are parameters, some are environment variables
export interface Settings {
	proxy: boolean;
	proxyUrl: string;
	quality: number;
	providers: ProviderList;
	height?: number;
	width?: number;
	keys?: Map<string, string>;
}

// Environment variables for Cloudflare Workers
export type EnvVars = {
	PROXY_URL: string;
	APOD_API_KEY: string;
};

// JSON that gets returned by the api
export interface StalewallResponse {
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
