import { Token } from "../lexer.ts";

export interface Operator {
	addToken(input: Token, index: number): void;
	end(index: number): void;
}
