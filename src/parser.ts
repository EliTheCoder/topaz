import { Token, TokenType } from "./lexer.ts";

type ASN = {
	type: TokenType;
	value?: string | number;
	line: number;
	column: number;
	operands?: AST;
};

type AST = ASN[];

export function parse(input: Token[]): AST {
	const parser = new Parser();
	return parser.parse(input);
}

export class Parser {
	expStack: Expression[] = [];
	public parse(input: Token[]): AST {
		const output: AST = [];
		for (const i of input) {
			if (i.type === TokenType.END) {
				if (this.expStack.length > 0) {
					const exp = this.expStack.pop();
				}
			}
			if (!operatorConfigs.has(i.type))
				throw new Error(
					`Invalid token ${i.type} at ${i.line}:${i.column}`
				);
			this.expStack.push(new Expression(i, operatorConfigs.get(i.type)));
		}
		return output;
	}
}

class Expression {
	private operands: AST = [];
	public constructor(
		public token: Token,
		private operandConfig: TokenType[]
	) {}
	public add(node: ASN): ASN | void {
		this.operands.push(node);
	}
	public end(): ASN {
		return {
			type: this.token.type,
			value: this.token.value,
			line: this.token.line,
			column: this.token.column,
			operands: this.operands
		};
	}
	public isFull(): boolean {
		return this.operands.length >= this.operandConfig.length;
	}
}

const operatorConfigs: Map<TokenType, TokenType[]> = new Map([
	[TokenType.ASSIGN, [TokenType.VARIABLE]],
	[TokenType.FUNCTION, [TokenType.VARIABLE]],
	[TokenType.NUMBER, []],
	[TokenType.START, []],
	[TokenType.VARIABLE, []]
]);
