import { useMemo, type ReactNode } from "react";
import type { AsyncStore } from "../utils.js";
import type { Flight } from "./flights.js";

export function DeparturesSearchResultsSkeleton(): ReactNode {
  return (
    <div>
      <div className="mt-6">
        <div className="h-7 w-48 max-w-full bg-white rounded" />
        <div className="flex flex-col gap-2 mt-2">
          <div className="h-20 bg-white rounded" />
          <div className="h-20 bg-white rounded" />
        </div>
      </div>
      <div className="mt-6">
        <div className="h-7 w-48 max-w-full bg-white rounded" />
        <div className="flex flex-col gap-2 mt-2">
          <div className="h-20 bg-white rounded" />
        </div>
      </div>
    </div>
  );
}

export function DeparturesSearchResultError({
  error,
}: {
  error: Error;
}): ReactNode {
  return (
    <div className="mt-6 p-4 bg-dark-red text-white rounded">
      {error.message}
    </div>
  );
}

export function DeparturesSearchResultEmpty(): ReactNode {
  return (
    <div className="mt-6 p-4 bg-white text-grey-overcast rounded">
      No flights found, try another destination.
    </div>
  );
}

export interface DeparturesSearchResultsProps {
  flights: AsyncStore<Flight[], { destination: string; order: "asc" | "desc" }>;
}

export function DeparturesSearchResults({
  flights,
}: DeparturesSearchResultsProps): ReactNode {
  const flightsByDate = useMemo(
    () =>
      flights.data?.reduce<Record<string, { date: Date; flights: Flight[] }>>(
        (flightsByDate, flight) => {
          const isoDate = flight.date.toISOString().split("T")[0];
          flightsByDate[isoDate] ??= { date: new Date(isoDate), flights: [] };
          flightsByDate[isoDate].flights.push(flight);
          return flightsByDate;
        },
        {},
      ),
    [flights],
  );

  if (flights.state === "loading") {
    return <DeparturesSearchResultsSkeleton />;
  }

  if (flights.error != null) {
    return <DeparturesSearchResultError error={flights.error} />;
  }

  if (flightsByDate == null) {
    return null;
  }

  if (Object.keys(flightsByDate).length <= 0) {
    return <DeparturesSearchResultEmpty />;
  }

  return (
    <ul>
      {Object.entries(flightsByDate).map(([key, { date, flights }]) => (
        <li key={key} className="mt-6">
          <h2 className="text-lg font-bold">
            {date.toLocaleString(navigator.language, {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h2>

          <ul className="flex flex-col gap-2 mt-2">
            {flights.map((flight) => (
              <li
                key={flight.flightIdentifier}
                className="flex p-4 gap-8 bg-white shadow rounded h-20"
              >
                <div className="flex flex-col">
                  {flight.expectedTime !== flight.originalTime ? (
                    <time
                      dateTime={flight.expectedTime}
                      className="font-semibold"
                    >
                      {flight.expectedTime}
                    </time>
                  ) : (
                    <>
                      <time
                        dateTime={flight.originalTime}
                        className="line-through"
                      >
                        {flight.originalTime}
                      </time>
                      <time
                        dateTime={flight.expectedTime}
                        className="text-dark-red font-semibold"
                      >
                        {flight.expectedTime}
                      </time>
                    </>
                  )}
                </div>
                <div>
                  <div>{flight.airport}</div>
                  <div className="text-grey-overcast">
                    {flight.flightNumber}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
