import { lex } from "./lexer.ts";
import { tokenize } from "./tokenizer.ts";

const text = await Deno.readTextFile("test.topaz");

const tokenizedProgram = tokenize(text);

console.log(tokenizedProgram);

const lexedProgram = lex(tokenizedProgram);

console.log(lexedProgram);
