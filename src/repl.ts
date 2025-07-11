import { createInterface } from "readline";

export function cleanInput(input: string) : string[]{
  return input.toLowerCase().trim().split(" ").filter((word)=> word !== "");
}
export function startREPL(){
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Pokedex> ",
  });
  rl.prompt();
  rl.on("line", async (line) => {
    const inputArray = cleanInput(line);
    if (inputArray.length === 0) {
      rl.prompt();
      return;
    }
    else {
      console.log(`Your command was: ${inputArray[0]}`);
      rl.prompt();
    }
  });
};
