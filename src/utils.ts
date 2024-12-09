// Returns a random int between 0 and nax-1
import type { Settings } from "./types";

/**
 * Generates a random integer between 0 (inclusive) and the specified maximum value (exclusive).
 *
 * @param {number} max - The upper bound for the random integer generation, should be a positive number.
 * @return {number} A random integer between 0 and max - 1.
 */
export function randInt(max: number) {
	return ~~(Math.random() * ~~max);
}

/**
 * Fetches data from the specified URL and returns it as a JSON object if the response
 * contains JSON content-type, otherwise returns it as a plain text string.
 *
 * @param {string} url - The URL to fetch the data from.
 * @param {HeadersInit | undefined} head - Optional headers to pass to request
 * @return {Promise<object | string>} A promise that resolves to a JSON object if the response
 *         has JSON content-type, otherwise resolves to a text string.
 * @throws {Error} If the network response is not ok (response status is not 2xx).
 */
export async function getData(url: string, head: HeadersInit | undefined = undefined): Promise<object | string> {
	const req: RequestInit | undefined = head ? { headers: head } : undefined;
	const res = await fetch(url, req);
	if (!res.ok) {
		throw new Error(`Response status: ${res.status} ${res.statusText}`);
	}
	if (res.headers.get("content-type")?.includes("json") ?? false) {
		return res.json();
	}
	return res.text();
}

// Gets string before separator
String.prototype.before = function (this: string, separator: string): string {
	const index = this.indexOf(separator);
	return index !== -1 ? this.substring(0, index) : this;
};

// Gets string after separator
String.prototype.after = function (this: string, separator: string): string {
	const index = this.indexOf(separator);
	return index !== -1 ? this.substring(index + separator.length) : this;
};

// Gets string in between
String.prototype.between = function (this: string, before: string, after: string): string {
	let index = this.indexOf(before);
	if (index === -1) {
		index = -before.length;
	}
	let endIndex = this.indexOf(after, index + before.length);
	if (endIndex === -1) {
		endIndex = this.length;
	}
	return this.substring(index + before.length, endIndex);
};

/**
 * Constructs a query string with common proxy parameters based on the provided settings and provider.
 *
 * @param {Settings} settings - A Settings object containing configuration.
 * @param {string} provider - The provider name to be included in the query string.
 * @return {string} A URL query string with the provider and optionally width and height parameters.
 */
export function getCommonProxyQueries(settings: Settings, provider: string): string {
	const params = new URLSearchParams();

	params.append("prov", provider);

	if (settings.height && settings.width) {
		params.append("w", settings.width.toString());
		params.append("h", settings.height.toString());
	}

	return params.toString();
}
