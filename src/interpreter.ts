import { Token, TokenType } from "./lexer.ts";
import { Operator } from "./interfaces/operator.ts";
import { TokenController } from "./interfaces/tokencontroller.ts";

export function interpret(
	input: Token[],
	tokenControllers: TokenControllerManager
): void {
	const interpreter = new Interpreter(input, tokenControllers);
	interpreter.interpret();
}

export class TokenControllerManager {
	private tokenControllers: Map<TokenType, TokenController> = new Map();
	public constructor() {}
	public register(type: TokenType, operator: TokenController) {
		if (this.tokenControllers.has(type))
			throw new Error(`Operator already registered.`);
		this.tokenControllers.set(type, operator);
	}
	public get(type: TokenType): TokenController {
		if (!this.tokenControllers.has(type))
			throw new Error(`No token controller found for type ${type}.`);
		return this.tokenControllers.get(type)!;
	}
}

export class Interpreter {
	private variables: Map<string, Token[]> = new Map();
	private index = 0;
	private opstack: Operator[] = [];
	public constructor(
		private readonly input: Token[],
		private tokenControllers: TokenControllerManager
	) {}
	public interpret(): void {}
	public step(): void {
		const token = this.input[this.index];
		this.tokenControllers.get(token.type).addToken(this, token, this.index);
		for (const operator of this.opstack) {
			operator.addToken(token, this.index);
		}

		this.index++;
	}
	public getIndex(): number {
		return this.index;
	}
	public getPreviousToken(): Token {
		return this.input[this.index - 1];
	}
	public getNextToken(): Token {
		return this.input[this.index + 1];
	}
	public getToken(index: number): Token {
		return this.input[index];
	}
	public getTokens(start: number, end: number): Token[] {
		return this.input.slice(start, end);
	}
	public opstackPush(operator: Operator): void {
		this.opstack.push(operator);
	}
	public opstackPop(): Operator | undefined {
		return this.opstack.pop();
	}
	public variableExists(name: string): boolean {
		return this.variables.has(name);
	}
	public variableGet(name: string): Token[] | undefined {
		return this.variables.get(name);
	}
	public variableSet(name: string, value: Token[]): void {
		this.variables.set(name, value);
	}
}
