import { describe, expect, test, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { getLevenshteinDistance, useAsyncData } from "./utils.js";

describe("getLevenstheinDistance", () => {
  test("returns a score based on how closely to strings match", () => {
    expect(getLevenshteinDistance("kitten", "kitten")).toBe(0);
    expect(getLevenshteinDistance("kitten", "sitting")).toBe(3);
  });

  test("it can be used to sort arrays", () => {
    const originalArray = ["kitten", "sitting", "kitty", "smitten"];
    const expectedResult = ["kitty", "kitten", "sitting", "smitten"];

    const sortedArray = originalArray.sort(
      (a, b) =>
        getLevenshteinDistance(a, "kitty") - getLevenshteinDistance(b, "kitty"),
    );

    expect(sortedArray).toEqual(expectedResult);
  });
});

describe("useAsyncData", () => {
  test("The async data store should have sensible default state", () => {
    const { result: store } = renderHook(() =>
      useAsyncData(() => Promise.resolve()),
    );

    expect(store.current.state).toBe("idle");
    expect(store.current.data).toBe(null);
    expect(store.current.error).toBe(null);
  });

  test("The provided fetcher is triggered when the load function is called", async () => {
    const fetcher = vi.fn((query: string) => Promise.resolve(query));
    const { result: store } = renderHook(() => useAsyncData(fetcher));

    await store.current.load("hello");

    expect(fetcher).toHaveBeenCalledWith("hello");
  });

  test("The state is set to 'loading' while the fetcher is resolving", async () => {
    const { result: store } = renderHook(() =>
      useAsyncData(
        // Without this delay the returned promise resolves faster than the async actions of vitest
        () => new Promise<void>((resolve) => setTimeout(() => resolve(), 50)),
      ),
    );

    expect(store.current.state).toBe("idle");

    const promise = store.current.load();

    await waitFor(() => expect(store.current.state).toBe("loading"));

    await promise;

    expect(store.current.state).toBe("idle");
  });

  test("The store data is set to the return value of the fetcher once it resolves", async () => {
    const fetcher = vi.fn((query: string) => Promise.resolve(query));
    const { result: store } = renderHook(() => useAsyncData(fetcher));

    const promise = store.current.load("hello");

    expect(fetcher).toHaveBeenCalledWith("hello");

    expect(await promise).toBe("hello");

    await waitFor(() => expect(store.current.data).toBe("hello"));
  });

  test("The store error is set if the fetcher raises an error", async () => {
    const error = new Error("Something went wrong");
    const fetcher = vi.fn(() => Promise.reject(error));
    const { result: store } = renderHook(() => useAsyncData(fetcher));

    expect(store.current.load()).rejects.toBe(error);

    await waitFor(() => expect(store.current.error).toBe(error));
  });
});
