import { createInterface, type Interface } from "readline";
import { PokeAPI, Pokemon } from "./pokeapi.js";

export type State = {
  commands: Record<string, CLICommand>;
  rl: Interface;
  pokeAPI: PokeAPI;
  nextLocationsURL: string;
  prevLocationsURL: string | null;
  caughtPokemon: Record<string, Pokemon>;

}
export type CLICommand = {
  name: string;
  description: string;
  callback : (state: State, ...args: string[]) => Promise<void>;
};

export function initState(input: NodeJS.ReadableStream, output: NodeJS.WritableStream): State{
  const rl = createInterface({input, output});
  return {
    commands: {
      exit: {
        name: "exit",
        description: "Exits the pokedex",
        callback: commandExit,
      },
      help: {
        name: "help",
        description: "Displays a help message",
        callback: commandHelp,
      },
      map: {
        name: "map",
        description: "Displays the next 20 location areas",
        callback: commandMap,
      },
      mapb: {
        name: "mapb",
        description: "Displays the previous 20 location areas",
        callback: commandMapb,
      },
      explore: {
        name: "explore",
        description: "Lists all the Pokemon in the given area",
        callback: commandExplore,
      },
      catch: {
        name: "catch",
        description: "Attempts to catch a Pokemon using a Pokeball",
        callback: commandCatch,
      },
      inspect: {
        name: "inspect",
        description: "Inspects the Pokedex for the specified Pokemon",
        callback: commandInspect,
      },
      pokedex: {
        name: "pokedex",
        description: "Lists all the Pokemon you have caught",
        callback: commandPokedex,
      },
    },
    rl: rl,
    pokeAPI: new PokeAPI,
    nextLocationsURL: "",
    prevLocationsURL: "",
    caughtPokemon: {},
  };
}

export async function commandExit(state: State){
  console.log("Closing the Pokedex... Goodbye!");
  state.rl.close();
  process.exit(0);
}

export async function commandHelp(state: State){
  console.log("Welcome to the Pokedex!\nUsage:\n\n");
  Object.keys(state.commands).forEach(key => {
    console.log(`${state.commands[key]["name"]} : ${state.commands[key]["description"]}`);
  });
}

export async function commandMap(state: State){
  let url = null;
  if(state.nextLocationsURL){
    url = state.nextLocationsURL;
  }
  const res = await state.pokeAPI.fetchLocations(url);
  state.nextLocationsURL = res.next;
  state.prevLocationsURL = res.previous;
  for(let location of res.results){
    console.log(location.name);
  }
}

export async function commandMapb(state: State){
  if (!state.prevLocationsURL){
    console.log("You're on the first page");
    return;
  }
  const res = await state.pokeAPI.fetchLocations(state.prevLocationsURL);
  state.nextLocationsURL = res.next;
  state.prevLocationsURL = res.previous;
  for(let location of res.results){
    console.log(location.name);
  }
}

export async function commandExplore(state: State, ...args: string[]){
  if (args[0]){
    const res = await state.pokeAPI.exploreLocation(args[0]);
    console.log(`Exploring ${args[0]}...`);
    console.log("Found Pokemon:");
    for (const encounter of res.pokemon_encounters) {
        console.log(" - " + encounter.pokemon.name);
    }
  } else {
    console.log("Please provide a location area to explore. Usage: explore <area-name>");
  }
}

export async function commandCatch(state: State, ...args: string[]){
  if (args[0]){
    const res = await state.pokeAPI.pokemonInfo(args[0]);
    console.log(`Throwing a Pokeball at ${args[0]}...`);
    const catchRate = Math.random() * 100 / res.base_experience;
    if (catchRate < 0.5){
      console.log(`${args[0]} escaped!`);
      return;
    }
    console.log(`${args[0]} was caught!`);
    state.caughtPokemon[args[0]] = res;
  }
}

export async function commandInspect(state: State, ...args: string[]){
  if (args[0]){
    if(!state.caughtPokemon[args[0]]){
      console.log("you have not caught that pokemon");
      return;
    }
    const pokemon = state.caughtPokemon[args[0]];
    console.log(`Name: ${args[0]}`);
    console.log(`Height: ${pokemon.height}`);
    console.log(`Weight: ${pokemon.weight}`);
  }
}

export async function commandPokedex(state: State){
  console.log("Your Pokedex");
  Object.keys(state.caughtPokemon).forEach(key => {
    console.log(` - ${key}`);
  });
}
