import type { MetaFunction } from "@remix-run/node";
import { z } from "zod";
import { useAsyncData } from "~/lib/utils.js";
import { FlightSchema } from "~/lib/departures/flights.js";
import { DeparturesSearchForm } from "~/lib/departures/DeparturesSearchForm.jsx";
import { DeparturesSearchResults } from "~/lib/departures/DeparturesSearchResults.jsx";

export const meta: MetaFunction = () => {
  return [
    { title: "Schiphol" },
    { name: "description", content: "Find your departing flight" },
  ];
};

const DeparturesSearchResultsSchema = z.array(FlightSchema);

const DeparturesDestinationsSchema = z.array(z.string());

export default function Index() {
  const destinations = useAsyncData(() =>
    fetch(`/api/departures/destinations`)
      .then((response) => response.json())
      .then((data) => DeparturesDestinationsSchema.parse(data)),
  );

  const flights = useAsyncData(
    (input: { destination: string; order: "asc" | "desc" }) =>
      fetch(
        `/api/departures/flights?destination=${input.destination}&order=${input.order}`,
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.error != null) {
            throw new Error(data.error);
          }

          return data;
        })
        .then((data) => DeparturesSearchResultsSchema.parse(data)),
  );

  return (
    <main>
      <section className="px-[clamp(theme(spacing.8),5vw,theme(spacing.16))] py-24">
        <DeparturesSearchForm destinations={destinations} flights={flights} />

        <div className="w-full lg:w-1/2 2xl:w-1/3 min-w-84 max-w-full">
          <DeparturesSearchResults flights={flights} />
        </div>
      </section>
    </main>
  );
}
