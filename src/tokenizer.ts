export function tokenize(input: string): string[] {
	const tokenizer = new Tokenizer();
	return tokenizer.tokenize(input);
}

export class Tokenizer {
	public constructor() {}
	public tokenize(input: string): string[] {
		return input.split(/\s+/).filter(Boolean);
	}
}
