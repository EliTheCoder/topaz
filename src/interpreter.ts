import { Opcode, Token, TokenType } from "./lexer";

export function interpret(input: Token[]): void {
	const interpreter = new Interpreter(input);
	interpreter.interpret();
}

export class Interpreter {
	private _variables: Map<string, Token[]> = new Map();
	private _index: number = 0;
	private _opstack: [Opcode, number][] = [];
	public constructor(private readonly _input: Token[]) {}
	public interpret(): void {}
	public step(): void {
		const token = this._input[this._index];

		this._index++;
	}
	public getIndex(): number {
		return this._index;
	}
	public getPreviousToken(): Token {
		return this._input[this._index - 1];
	}
	public getNextToken(): Token {
		return this._input[this._index + 1];
	}
	public getToken(index: number): Token {
		return this._input[index];
	}
	public getTokens(start: number, end: number): Token[] {
		return this._input.slice(start, end);
	}
	public opstackPush(opcode: Opcode): void {
		this._opstack.push([opcode, this._index]);
	}
	public opstackPop(): [Opcode, number] | undefined {
		return this._opstack.pop();
	}
	public variableExists(name: string): boolean {
		return this._variables.has(name);
	}
	public variableGet(name: string): Token[] | undefined {
		return this._variables.get(name);
	}
	public variableSet(name: string, value: Token[]): void {
		this._variables.set(name, value);
	}
}

const tokenTypes: Map<
	TokenType,
	(input: Token, interpreter: Interpreter) => void
> = new Map([
	[
		TokenType.OPERATOR,
		(input: Token, interpreter: Interpreter) => {
			const opCodes: Map<
				Opcode,
				(input: Token, interpreter: Interpreter) => void
			> = new Map([
				[
					Opcode.ASSIGN,
					(input: Token, interpreter: Interpreter) => {
						interpreter.opstackPush(Opcode.ASSIGN);
					}
				],
				[
					Opcode.END,
					(input: Token, interpreter: Interpreter) => {
						const opstackTop = interpreter.opstackPop();
						if (opstackTop === undefined) {
							throw new Error(
								`Unexpected END operator when opstack is empty.`
							);
						}
						const [opcode, index] = opstackTop;
						if (opcode === Opcode.ASSIGN) {
							const variable = interpreter.getToken(index);
							if (variable.type !== TokenType.VARIABLE)
								throw new Error(
									`Unexpected token type before ASSIGN operator.`
								);

							const value = interpreter.getTokens(
								index + 1,
								interpreter.getIndex()
							);
							interpreter.variableSet(
								variable.value as string,
								value
							);
						}
					}
				]
			]);

			if (!opCodes.has(input.value as Opcode))
				throw new Error(`Unexpected operator.`);

			opCodes.get(input.value as Opcode)!(input, interpreter);
		}
	],
	[TokenType.VARIABLE, (input: Token, interpreter: Interpreter) => {}],
	[TokenType.NUMBER, (input: Token, interpreter: Interpreter) => {}]
]);
