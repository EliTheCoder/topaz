import { Operator } from "./interfaces/operator.ts";

export enum TokenType {
	NUMBER,
	OPERATOR,
	PAREN,
	VARIABLE,
	END
}

export enum Opcode {
	ASSIGN,
	FUNCTION
}

export type Token = {
	type: TokenType;
	value?: string | number | Token[] | Opcode;
};

export const operators = new Map<string, Opcode>([
	["=", Opcode.ASSIGN],
	["$", Opcode.FUNCTION]
]);

export class OperatorManager {
	private operators: Map<(input: string) => boolean, Operator> = new Map();
	public constructor() {}
	public register(matcher: (input: string) => boolean, operator: Operator) {
		if (this.operators.has(matcher))
			throw new Error(`Operator already registered.`);
		this.operators.set(matcher, operator);
	}
}

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
	},
	// End
	(input: string) => {
		if (input === ";") {
			return {
				type: TokenType.END
			};
		}
	}
];

export function lex(input: string[], operators: OperatorManager): Token[] {
	const lexer = new Lexer(operators);
	return lexer.lex(input);
}

export class Lexer {
	public constructor(private readonly operators: OperatorManager) {}
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
		const output: Token[] = [];
		for (const i of input) {
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
		for (const i of tokenTypes) {
			const token = i(input);
			if (token) {
				return token;
			}
		}
		throw new Error(`Unknown token: ${input}`);
	}
}
