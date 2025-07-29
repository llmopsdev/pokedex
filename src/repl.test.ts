import { cleanInput } from "./repl";
import { describe, expect, test } from "vitest";
import { Cache } from './pokecache.js';

test.concurrent.each([
  {
    key: "https://pokeapi.co/api/v2/location-area/?name=canalave-city",
    val: "testdata",
    interval: 500, // 1/2 second
  },
  {
    key: "https://pokeapi.co/api/v2/location-area/",
    val: "moretestdata",
    interval: 1000, // 1 second
  },
])("Test Caching $interval ms", async ({ key, val, interval }) => {
  const cache = new Cache(interval);

  cache.add(key, val);
  const cached = cache.get(key);
  expect(cached).toBe(val);

  await new Promise((resolve) => setTimeout(resolve, interval + 100));
  const reaped = cache.get(key);
  expect(reaped).toBe(undefined);

  cache.stopReapLoop();
});

describe.each([
  {
    input: "  hello  world  ",
    expected: ["hello", "world"],
  },
  {
    input: "there is a dog ",
    expected: ["there", "is", "a", "dog"],
  },
  {
    input: "how  can    the sky- ",
    expected: ["how", "can", "the", "sky-"],
  },
  // TODO: more test cases here
])("cleanInput($input)", ({ input, expected }) => {
  test(`Expected: ${expected}`, () => {
    // TODO: call cleanInput with the input here
    const actual = cleanInput(input);
    // The `expect` and `toHaveLength` functions are from vitest
    // they will fail the test if the condition is not met
    expect(actual).toHaveLength(expected.length);
    for (const i in expected) {
      // likewise, the `toBe` function will fail the test if the values are not equal
      expect(actual[i]).toBe(expected[i]);
    }
  });
});

