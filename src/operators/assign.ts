import { Token, TokenType } from "../lexer.ts";
import { Operator } from "../interfaces/operator.ts";

export default class Assign implements Operator {
	private data: Token[] = [];
	private name = "";
	constructor(private source: Token, private index: number) {}
	public addToken(input: Token, index: number): void {
		if (index > this.index + 1) {
			this.data.push(input);
		} else {
			if (input.type !== TokenType.VARIABLE) {
				throw new Error(
					`Expected variable name after '${this.source.value}' at index ${index}.`
				);
			}
			this.name = input.value as string;
		}
	}
	public end(index: number): void {
		if (this.name === "") {
			throw new Error(
				`Variable name was never provided for '${this.source.value}' at index ${index}.`
			);
		}
	}
}
