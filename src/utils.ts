// Returns a random int between 0 and nax-1
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
