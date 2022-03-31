export type TokenizerOptions = {};

export function tokenize(
	input: string,
	options: TokenizerOptions = {}
): string[] {
	const tokenizer = new Tokenizer(options);
	return tokenizer.tokenize(input);
}

export class Tokenizer {
	public constructor(private readonly _options: TokenizerOptions = {}) {}
	public tokenize(input: string): string[] {
		return input.split(/\s+/).filter(Boolean);
	}
}
