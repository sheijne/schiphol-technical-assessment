import { useState } from "react";

/**
 * This functions calcaultes the Levenshtein distance between two strings. Can be used to sort strings by similarity.
 * @example getLevenshteinDistance('kitten', 'sitting') // 3
 * @example getLevenshteinDistance('kitten', 'kitty') - getLevenshteinDistance('smitten', 'kitty') // -2
 * @see https://www.30secondsofcode.org/js/s/levenshtein-distance/
 */
export function getLevenshteinDistance(a: string, b: string): number {
  if (!a.length) {
    return b.length;
  }

  if (!b.length) {
    return a.length;
  }

  const index: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    index[i] = [i];

    for (let j = 1; j <= a.length; j++) {
      if (i === 0) {
        index[i][j] = j;
      } else {
        index[i][j] = Math.min(
          index[i - 1][j] + 1,
          index[i][j - 1] + 1,
          index[i - 1][j - 1] + (a[j - 1] === b[i - 1] ? 0 : 1),
        );
      }
    }
  }

  return index[b.length][a.length];
}

/**
 * Simple store to handle async data fetching.
 */
export interface AsyncStore<T, P = undefined> {
  state: "idle" | "loading";
  error: null | Error;
  data: null | T;
  load: (...input: P extends undefined ? [] : [P]) => Promise<T>;
}

export function useAsyncData<T, P = undefined>(
  fetcher: (...input: P extends undefined ? [] : [P]) => Promise<T>,
): AsyncStore<T, P> {
  const [state, setState] = useState<AsyncStore<T>["state"]>("idle");
  const [error, setError] = useState<AsyncStore<T>["error"]>(null);
  const [data, setData] = useState<AsyncStore<T>["data"]>(null);

  return {
    state,
    data,
    error,
    load: async (...input: P extends undefined ? [] : [P]) => {
      try {
        setState("loading");
        setError(null);
        const result = await fetcher(...input);
        setData(result);
        return result;
      } catch (e) {
        setError(
          e instanceof Error
            ? e
            : new Error("Something went wrong. Please try again later."),
        );
        throw e;
      } finally {
        setState("idle");
      }
    },
  };
}
