export enum TokenType {
	NUMBER = "NUMBER",
	VARIABLE = "VARIABLE",
	START = "START",
	END = "END",
	ASSIGN = "ASSIGN",
	FUNCTION = "FUNCTION",
	ENDL = "ENDL"
}

export type Token = {
	type: TokenType;
	value?: string | number;
};

export const tokenTypes: ((input: string) => Token | undefined)[] = [
	// Numbers
	(input: string) => {
		const match = input.match(/^(\d+)/);
		if (match) {
			return {
				type: TokenType.NUMBER,
				value: Number(match[1])
			};
		}
	},
	// Variables
	(input: string) => {
		const match = input.match(/^[a-zA-Z]+$/);
		if (match) {
			return {
				type: TokenType.VARIABLE,
				value: match[0]
			};
		}
	},
	// Assign
	(input: string) => {
		const match = input.match(/^=$/);
		if (match) {
			return {
				type: TokenType.ASSIGN
			};
		}
	},
	// End
	(input: string) => {
		const match = input.match(/[;)]/);
		if (match) {
			return {
				type: TokenType.END,
				value: match[0]
			};
		}
	}
];

export function lex(input: string[]): Token[] {
	const lexer = new Lexer();
	return lexer.lex(input);
}

export class Lexer {
	public constructor() {}
	public lex(input: string[]): Token[] {
		const output: Token[] = [];
		for (const i of input) {
			output.push(this.translate(i));
		}
		return output;
	}
	public translate(input: string): Token {
		for (const i of tokenTypes) {
			const token = i(input);
			if (token) {
				return token;
			}
		}
		throw new Error(`Unknown token: ${input}`);
	}
}
