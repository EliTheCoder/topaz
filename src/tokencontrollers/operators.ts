import { TokenController } from "../interfaces/tokencontroller.ts";
import { Interpreter } from "../interpreter.ts";
import { Token } from "../lexer.ts";
import Assign from "../operators/assign.ts";

export default class Operators implements TokenController {
	constructor() {}
	public addToken(interpreter: Interpreter, input: Token, index: number) {
		interpreter.opstackPush(new Assign(input, index));
	}
}
