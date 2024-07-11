import { expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import type { AsyncStore } from "../utils.js";
import type { Flight } from "./flights.js";
import { DeparturesSearchForm } from "./DeparturesSearchForm.jsx";

test("A list of destinations should be loaded when the search input is focused", async () => {
  const destinations: AsyncStore<string[]> = {
    state: "idle",
    error: null,
    data: null,
    load: vi.fn(() => Promise.resolve([])),
  };

  const flights: AsyncStore<
    Flight[],
    { destination: string; order: "asc" | "desc" }
  > = {
    state: "idle",
    error: null,
    data: null,
    load: vi.fn(() => Promise.resolve([])),
  };

  render(
    <DeparturesSearchForm destinations={destinations} flights={flights} />,
  );

  const input = screen.getByPlaceholderText("Enter a destination");

  expect(input).toBeInTheDocument();

  input.focus();

  expect(destinations.load).toHaveBeenCalled();
});

test("The current input and possible suggestions should be shown once the user starts typing", async () => {
  const destinations: AsyncStore<string[]> = {
    state: "idle",
    error: null,
    data: ["Paris"],
    load: vi.fn(() => Promise.resolve([])),
  };

  const flights: AsyncStore<
    Flight[],
    { destination: string; order: "asc" | "desc" }
  > = {
    state: "idle",
    error: null,
    data: null,
    load: vi.fn(() => Promise.resolve([])),
  };

  render(
    <DeparturesSearchForm destinations={destinations} flights={flights} />,
  );

  const user = userEvent.setup();
  const input = screen.getByPlaceholderText("Enter a destination");

  input.focus();

  await user.type(input, "P");

  expect(screen.getByText("P")).toBeInTheDocument();
  expect(screen.getByText("Paris")).toBeInTheDocument();

  await user.type(input, "aris");

  expect(screen.getByText("Paris")).toBeInTheDocument();
});

test("When the user clicks a suggestion the form should be submitted", async () => {
  const destinations: AsyncStore<string[]> = {
    state: "idle",
    error: null,
    data: ["Paris"],
    load: vi.fn(() => Promise.resolve([])),
  };

  const flights: AsyncStore<
    Flight[],
    { destination: string; order: "asc" | "desc" }
  > = {
    state: "idle",
    error: null,
    data: null,
    load: vi.fn(() => Promise.resolve([])),
  };

  render(
    <DeparturesSearchForm destinations={destinations} flights={flights} />,
  );

  const user = userEvent.setup();
  const input = screen.getByPlaceholderText("Enter a destination");

  await user.type(input, "Paris");

  const suggestion = screen.getByText("Paris");

  suggestion.click();

  expect(flights.load).toHaveBeenCalledWith({
    destination: "Paris",
    order: "asc",
  });
});
