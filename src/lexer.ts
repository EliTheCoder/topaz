import { UnlexedToken } from "./tokenizer.ts";

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
	line: number;
	column: number;
	value?: string | number;
};

type UnmarkedToken = {
	type: TokenType;
	value?: string | number;
};

export const tokenTypes: ((input: string) => UnmarkedToken | undefined)[] = [
	// Numbers
	(input: string) => {
		const match = input.match(/^(\d+)$/);
		if (match) {
			return {
				type: TokenType.NUMBER,
				value: Number(match[0])
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
		const match = input.match(/^[=]$/);
		if (match) {
			return {
				type: TokenType.ASSIGN
			};
		}
	},
	// End
	(input: string) => {
		const match = input.match(/^[;)]$/);
		if (match) {
			return {
				type: TokenType.END,
				value: match[0]
			};
		}
	},
	// Start
	(input: string) => {
		const match = input.match(/^[(]$/);
		if (match) {
			return {
				type: TokenType.START
			};
		}
	},
	// Functions
	(input: string) => {
		const match = input.match(/^[$]$/);
		if (match) {
			return {
				type: TokenType.FUNCTION
			};
		}
	},
	// End Line
	(input: string) => {
		const match = input.match(/^[\n]$/);
		if (match) {
			return {
				type: TokenType.ENDL
			};
		}
	}
];

export function lex(input: UnlexedToken[]): Token[] {
	const lexer = new Lexer();
	return lexer.lex(input);
}

export class Lexer {
	private commentedLine = 0;
	public lex(input: UnlexedToken[]): Token[] {
		const output: Token[] = [];
		for (const i of input) {
			if (i.value === "//") this.commentedLine = i.line;
			if (i.line === this.commentedLine && !i.value.match(/^[\n]$/))
				continue;
			output.push(this.translate(i));
		}
		return output;
	}
	public translate(input: UnlexedToken): Token {
		for (const i of tokenTypes) {
			const token = i(input.value);
			if (token) {
				return {
					type: token.type,
					line: input.line,
					column: input.column,
					value: token.value
				};
			}
		}
		throw new Error(
			`Unknown token: ${input} at ${input.line}:${input.column}`
		);
	}
}
