// Types for str.before() and str.after; see utils.ts
interface String {
	before(sep: string): string;
	after(sep: string): string;
	between(before: string, after: string): string;
}
