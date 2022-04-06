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
	currentToken = "";
	currentLine = 1;
	currentColumn = 1;
	public tokenize(input: string): UnlexedToken[] {
		const output: UnlexedToken[] = [];
		const text = input.split("");
		for (let i = 0; i < text.length; i++) {
			const char = text[i];
			if ([" ", "\n", "\t", "\r"].includes(char)) {
				if (this.currentToken.length > 0) {
					output.push({
						value: this.currentToken,
						line: this.currentLine,
						column: this.currentColumn - this.currentToken.length
					});
					this.currentToken = "";
				}
				if (char === "\n") {
					output.push({
						value: "\n",
						line: this.currentLine,
						column: this.currentColumn
					});
				}
			} else {
				this.currentToken += char;
			}
			if (char === "\n") {
				this.currentLine++;
				this.currentColumn = 1;
			} else {
				this.currentColumn++;
			}
		}
		if (this.currentToken.length > 0) {
			output.push({
				value: this.currentToken,
				line: this.currentLine,
				column: this.currentColumn
			});
		}
		if (output[output.length - 1].value !== "\n") {
			output.push({
				value: "\n",
				line: this.currentLine,
				column: this.currentColumn + 1
			});
		}
		return output;
	}
}
