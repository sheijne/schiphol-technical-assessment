import { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";
import { z } from "zod";

export const DeparturesFlightsInputSchema = z.object({
  destination: z.string(),
  order: z
    .union([z.literal("asc"), z.literal("desc")])
    .optional()
    .default("asc"),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const {
    success: isInputValid,
    data: input,
    error,
  } = DeparturesFlightsInputSchema.safeParse(
    Object.fromEntries(url.searchParams.entries()),
  );

  if (!isInputValid) {
    console.error(error);
    return json({ error: "Provide a valid destination" }, { status: 400 });
  }

  try {
    const flights = await import("~/data/flights.json").then(
      (m) => m.default.flights,
    );

    return json(
      flights
        .filter((flight) =>
          flight.airport
            .toLowerCase()
            .includes(input.destination.toLowerCase()),
        )
        .sort((a, b) => {
          const aDate = new Date(a.date);
          const bDate = new Date(b.date);

          if (a.date === b.date) {
            const [aHours, aMinutes] = a.expectedTime.split(":").map(Number);
            const [bHours, bMinutes] = b.expectedTime.split(":").map(Number);

            aDate.setHours(aHours, aMinutes);
            bDate.setHours(bHours, bMinutes);
          }

          if (input.order === "asc") {
            return aDate.getTime() - bDate.getTime();
          }

          return bDate.getTime() - aDate.getTime();
        }).slice(0, 5),
    );
  } catch (e) {
    console.error(e);

    return json(
      {
        error:
          "Flight data is not available at this time, please try again later",
      },
      { status: 500 },
    );
  }
}
