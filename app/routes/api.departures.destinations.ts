import { json } from "@remix-run/react";

export async function loader() {
  try {
    const flights = await import("~/data/flights.json").then(
      (m) => m.default.flights,
    );

    return json(Array.from(new Set(flights.map((flight) => flight.airport))));
  } catch (e) {
    console.error(e);

    return json(
      {
        error:
          "Flight data is not avaialble at this time, please try again later",
      },
      { status: 500 },
    );
  }
}
