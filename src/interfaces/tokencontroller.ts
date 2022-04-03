import { Interpreter } from "../interpreter.ts";
import { Token } from "../lexer.ts";

export interface TokenController {
	addToken(interpreter: Interpreter, input: Token, index: number): void;
}
