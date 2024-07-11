import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import type { AsyncStore } from "../utils.js";
import type { Flight } from "./flights.js";
import { DeparturesSearchResults } from "./DeparturesSearchResults.jsx";

test("A loading state is shown when fetching new data", async () => {
  const flights: AsyncStore<Flight[]> = {
    state: "loading",
    error: null,
    data: null,
    load: () => Promise.resolve([]),
  };

  const result = render(<DeparturesSearchResults flights={flights} />);

  expect(result).toMatchSnapshot();
});

test("An error is shown to the user when fetching fails", async () => {
  const flights: AsyncStore<Flight[]> = {
    state: "idle",
    error: new Error("Something went wrong"),
    data: null,
    load: () => Promise.resolve([]),
  };

  render(<DeparturesSearchResults flights={flights} />);

  expect(screen.getByText("Something went wrong")).toBeInTheDocument();
});

test("A message is shown to the user when no results are found", async () => {
  const flights: AsyncStore<Flight[]> = {
    state: "idle",
    error: null,
    data: [],
    load: () => Promise.resolve([]),
  };

  render(<DeparturesSearchResults flights={flights} />);

  expect(
    screen.getByText("No flights found, try another destination."),
  ).toBeInTheDocument();
});

test("When results are found they are display to the user", async () => {
  const flight: Flight = {
    flightIdentifier: "D20190401UA969",
    flightNumber: "UA 969",
    airport: "San Francisco",
    date: new Date("2022-02-23"),
    expectedTime: "14:50",
    originalTime: "14:55",
    url: "/en/departures/flight/D20190401UA969/",
    score: 70.55272,
  };

  const flights: AsyncStore<Flight[]> = {
    state: "idle",
    error: null,
    data: [flight],
    load: () => Promise.resolve([]),
  };

  render(<DeparturesSearchResults flights={flights} />);

  // Check if the date header is present
  expect(screen.getByText("Wednesday, February 23")).toBeInTheDocument();

  // Check if the original and expected departure time are displayed
  expect(screen.getByText(flight.expectedTime)).toBeInTheDocument();
  expect(screen.getByText(flight.originalTime)).toBeInTheDocument();

  // Check if the destination name is present
  expect(screen.getByText(flight.airport)).toBeInTheDocument();

  // Check if the flight number is present
  expect(screen.getByText(flight.flightNumber)).toBeInTheDocument();
});
