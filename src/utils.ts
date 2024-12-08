// Returns a random int between 0 and nax-1
import type { Settings } from "./types";

export function randInt(max: number) {
	return ~~(Math.random() * ~~max);
}

// Fetches a specified url, and returns an object (json) if the page returns a json otherwise it returns the text
export async function getData(url: string): Promise<object | string> {
	const res = await fetch(url);
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

export function getCommonProxyQueries(settings: Settings, provider: string): string {
	const params = new URLSearchParams();

	params.append("prov", provider);

	if (settings.height && settings.width) {
		params.append("w", settings.width.toString());
		params.append("h", settings.height.toString());
	}

	return params.toString();
}
