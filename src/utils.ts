// int from 0 to n-1
export function randInt(n: number) {
	return Math.floor(Math.random() * Math.floor(n));
}

// returns a json from url
export async function getJson(url: string): Promise<object> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}

	return (await response.json()) as object;
}

export async function getText(url: string): Promise<string> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}

	return response.text();
}

// given num and max and min as boundaries, returns num if num>min && num<max
// otherwise it returns max if num>max or min if num<min
export function numberBounds(num: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, num));
}

// gets string before or after separator
String.prototype.before = function (this: string, sep: string): string {
	return this.substring(0, this.indexOf(sep));
};

String.prototype.after = function (this: string, sep: string): string {
	return this.substring(this.indexOf(sep) + sep.length);
};
