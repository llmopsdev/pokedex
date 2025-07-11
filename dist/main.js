// repl.js actually refers to repl.ts
import { createInterface } from "readline";
import { startREPL } from "./repl.js";
import { cleanInput } from "./repl.js";
const readInput = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Pokedex> ",
});
function main() {
    startREPL();
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "Pokedex> ",
    });
    rl.prompt();
    rl.on("line", cleanInput);
}
main();
