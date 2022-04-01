export enum TokenType {
	NUMBER,
	OPERATOR,
	PAREN,
	VARIABLE
}

export enum Opcode {
	ASSIGN,
	END
}

export type Token = {
	type: TokenType;
	value: string | number | Token[] | Opcode;
};

export type LexerOptions = {};

export const operators = new Map<string, Opcode>([
	["=", Opcode.ASSIGN],
	[";", Opcode.END]
]);

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
	// Operators
	(input: string) => {
		if (operators.has(input)) {
			return {
				type: TokenType.OPERATOR,
				value: operators.get(input)!
			};
		}
	}
];

export function lex(input: string[], options: LexerOptions = {}): Token[] {
	const lexer = new Lexer(options);
	return lexer.lex(input);
}

export class Lexer {
	public constructor(private readonly _options: LexerOptions = {}) {}
	public lex(input: (string | Token[])[]): Token[] {
		if (input.includes("(")) {
			const i = input.indexOf("(");
			let j = i;
			while (input[j] !== ")") {
				j++;
			}

			return this.lex(
				input
					.slice(0, i)
					.concat(this.lex(input.slice(i + 1, j)))
					.concat(input.slice(j + 1))
			);
		}
		let output: Token[] = [];
		for (let i of input) {
			if (typeof i === "string") {
				output.push(this.translate(i));
			} else if (i instanceof Array) {
				output.push({
					type: TokenType.PAREN,
					value: i
				});
			}
		}
		return output;
	}
	public translate(input: string): Token {
		for (let i of tokenTypes) {
			const token = i(input);
			if (token) {
				return token;
			}
		}
		throw new Error(`Unknown token: ${input}`);
	}
}
