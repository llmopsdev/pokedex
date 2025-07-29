import { Cache } from "./pokecache.js";

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  cache: Cache = new Cache(1000);

  constructor() {}

  async fetchLocations(pageURL?: string | null): Promise<ShallowLocations> {
    let url = "https://pokeapi.co/api/v2/location-area/"
    if(pageURL){
      url = pageURL;
    }
    const cachedResult = this.cache.get(url); 
    if (cachedResult != undefined){
      return cachedResult as ShallowLocations;
    }
    const response = await fetch(url);
    if (!response.ok){
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json() as ShallowLocations;
    this.cache.add(url, json);
    return json;
  }

  async fetchLocation(locationName: string): Promise<Location> {
    let url = "https://pokeapi.co/api/v2/location-area/?name="
    if(locationName){
      url += locationName;
    }
    const cachedResult = this.cache.get(url);
    if(cachedResult != undefined){
      return cachedResult as Location;
    }
    const response = await fetch(url);
    if (!response.ok){
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    this.cache.add(url, json);
    return json;
  }

  async exploreLocation(locationName: string): Promise<LocationArea> {
    const url = `${PokeAPI.baseURL}/location-area/${locationName}`;
    const cachedResult = this.cache.get(url);
    if(cachedResult != undefined){
      return cachedResult as LocationArea;
    }
    const response = await fetch(url);
    if (!response.ok){
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json() as LocationArea;
    this.cache.add(url, json);
    return json;
  }
  
  async pokemonInfo(pokemon: string): Promise<Pokemon>{
    const url = `${PokeAPI.baseURL}/pokemon/${pokemon}`
    const response = await fetch(url);
    if(!response.ok){
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json() as Pokemon;
    return json
  }
}

export type ShallowLocations = {
  count: number,
  next: string,
  previous: string | null,
  results: Location[]
};

export type Location = {
  name: string,
  url: string
};

export type NamedAPIResource = {
  name: string;
  url: string;
};

export type EncounterDetail = {
  chance: number;
  condition_values: NamedAPIResource[];
  max_level: number;
  method: NamedAPIResource;
  min_level: number;
};

export type VersionEncounterDetail = {
  encounter_details: EncounterDetail[];
  max_chance: number;
  version: NamedAPIResource;
};

export type PokemonEncounter = {
  pokemon: NamedAPIResource;
  version_details: VersionEncounterDetail[];
};

export type EncounterVersionDetail = {
  rate: number;
  version: NamedAPIResource;
};

export type EncounterMethodRate = {
  encounter_method: NamedAPIResource;
  version_details: EncounterVersionDetail[];
};

export type LocationAreaName = {
  language: NamedAPIResource;
  name: string;
};

export type LocationArea = {
  encounter_method_rates: EncounterMethodRate[];
  game_index: number;
  id: number;
  location: NamedAPIResource;
  name: string;
  names: LocationAreaName[];
  pokemon_encounters: PokemonEncounter[];
};

export type Pokemon = {
  base_experience: number;
  height: number;
  weight: number;
  stats: Stats[];
  types: Type[];
};

export type Stats = {
  base_stat: number;
  effort: number;
  state: {
    name: string;
  }
}
export type Type = {
  type: {
    name: string;
  }
}
