export type UnlexedToken = {
	value: string;
	line: number;
	column: number;
};

export function tokenize(input: string): UnlexedToken[] {
	const tokenizer = new Tokenizer();
	return tokenizer.tokenize(input);
}

export class Tokenizer {
	public tokenize(input: string): UnlexedToken[] {
		const output: UnlexedToken[] = [];
		const text = input.split("");
		let currentToken = "";
		let currentLine = 1;
		let currentColumn = 1;
		for (let i = 0; i < text.length; i++) {
			const char = text[i];
			if ([" ", "\n", "\t", "\r"].includes(char)) {
				if (currentToken.length > 0) {
					output.push({
						value: currentToken,
						line: currentLine,
						column: currentColumn - currentToken.length
					});
					currentToken = "";
				}
				if (char === "\n") {
					output.push({
						value: "\n",
						line: currentLine,
						column: currentColumn
					});
				}
			} else {
				currentToken += char;
			}
			if (char === "\n") {
				currentLine++;
				currentColumn = 1;
			} else {
				currentColumn++;
			}
		}
		if (currentToken.length > 0) {
			output.push({
				value: currentToken,
				line: currentLine,
				column: currentColumn
			});
		}
		if (output[output.length - 1].value !== "\n") {
			output.push({
				value: "\n",
				line: currentLine,
				column: currentColumn + 1
			});
		}
		return output;
	}
}
