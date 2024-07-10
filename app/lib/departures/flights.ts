import { z } from "zod";

export const FlightSchema = z.object({
  flightIdentifier: z.string(),
  flightNumber: z.string(),
  airport: z.string(),
  date: z.string().pipe(z.coerce.date()),
  expectedTime: z.string(),
  originalTime: z.string(),
  url: z.string(),
  score: z.string().pipe(z.coerce.number()),
});

export type Flight = z.infer<typeof FlightSchema>;
