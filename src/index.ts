import { Interpreter, TokenControllerManager } from "./interpreter.ts";
import { lex, OperatorManager } from "./lexer.ts";
import { tokenize } from "./tokenizer.ts";

const text = await Deno.readTextFile("test.topaz");

const tokenControllers = new TokenControllerManager();

const lexedProgram = lex(tokenize(text), new OperatorManager());

console.log(lexedProgram);

const interpreter = new Interpreter(lexedProgram, tokenControllers);

interpreter.interpret();
console.log(interpreter.opstackPop());
