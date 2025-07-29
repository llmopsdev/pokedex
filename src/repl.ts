import { State } from "./state.js";

export function cleanInput(input: string) : string[]{
  return input.toLowerCase().trim().split(" ").filter((word)=> word !== "");
}
export async function startREPL(state: State){
  state.rl.prompt();
  state.rl.on("line", async (line) => {
    const inputArray = cleanInput(line);
    if (inputArray.length === 0) {
      state.rl.prompt();
      return;
    }
    if (inputArray[0] in state.commands){
        try{
        await state.commands[inputArray[0]].callback(state, ...inputArray.slice(1));
      } catch(err){
        if (err instanceof Error){
          console.error("Error:", err.message);
        } else {
          console.error("Error:", String(err));
        }
      }
    }
    else{
      console.log("Invalid command\n");
    }
    state.rl.prompt();
  });
};
