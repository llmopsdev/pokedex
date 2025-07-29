// repl.js actually refers to repl.ts
import { startREPL } from "./repl.js";
import { initState } from "./state.js";
async function main() {
    const state = initState(process.stdin, process.stdout);
    startREPL(state);
}
main();
