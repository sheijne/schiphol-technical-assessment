import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLProps,
  type ReactNode,
} from "react";
import { AsyncStore, getLevenshteinDistance } from "../utils.js";
import { MagnifyingGlassIcon } from "../ui/MagnifyingGlassIcon.jsx";
import { Flight } from "./flights.js";
import { ChevronDownIcon } from "../ui/ChevronDownIcon.js";

export interface DeparturesSearchFormProps extends HTMLProps<HTMLFormElement> {
  destinations: AsyncStore<string[]>;
  flights: AsyncStore<Flight[], { destination: string; order: "asc" | "desc" }>;
}

export function DeparturesSearchForm({
  destinations,
  flights,
  ...props
}: DeparturesSearchFormProps): ReactNode {
  const form = useRef<HTMLFormElement>(null);
  const searchInputId = useId();

  const [input, setInput] = useState<{
    destination: string;
    order: "asc" | "desc";
  }>({
    destination: "",
    order: "asc",
  });

  const [isActive, setIsActive] = useState(false);

  const showSuggestions = isActive && Boolean(input.destination);

  const suggestions = useMemo(
    () =>
      destinations.data
        ?.filter((destination) =>
          destination.toLowerCase().includes(input.destination.toLowerCase()),
        )
        .sort(
          (a, b) =>
            getLevenshteinDistance(b, input.destination) -
            getLevenshteinDistance(a, input.destination),
        ),
    [destinations, input.destination],
  );

  const closeOnClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        event.target === form.current ||
        form.current?.contains(event.target as Node)
      ) {
        return;
      }

      setIsActive(false);
    },
    [form],
  );

  useEffect(() => {
    document.addEventListener("click", closeOnClickOutside);
    return () => document.removeEventListener("click", closeOnClickOutside);
  }, [closeOnClickOutside]);

  return (
    <form
      ref={form}
      role="search"
      className="flex flex-col items-start justify-start"
      {...props}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsActive(false);
        flights.load(input);
      }}
    >
      <label htmlFor={searchInputId} className="block text-2xl">
        What is your flight destination?
      </label>

      <div className="flex gap-4">
        <div className="relative mt-4 w-96 max-w-full">
          <input
            id={searchInputId}
            type="search"
            name="search.destination"
            spellCheck="false"
            autoComplete="off"
            minLength={3}
            required
            className={`w-full pl-4 pr-12 h-12 outline outline-0 focus-visible:outline-2 outline-offset-0 outline-afternoon-blue ${
              showSuggestions ? "rounded-t" : "rounded"
            }`}
            placeholder="Enter a destination"
            value={input.destination}
            onInput={(e) => {
              setInput({ ...input, destination: e.currentTarget.value });
            }}
            onFocus={() => {
              if (destinations.state !== "loading" && !destinations.data) {
                destinations.load();
              }

              setIsActive(true);
            }}
          />

          <button
            type="submit"
            title="Search for departing flights"
            className={`absolute top-0 right-0 p-2 outline-none hover:bg-afternoon-blue focus:bg-afternoon-blue ${
              showSuggestions ? "rounded-tr" : "rounded-r"
            }`}
          >
            <MagnifyingGlassIcon />
          </button>

          {showSuggestions ? (
            <div className="absolute left-0 bottom-0 py-2 translate-y-full w-full bg-white/75 backdrop-blur-lg border-grey-storm rounded-b">
              {destinations.state === "loading" ? (
                <div className="py-2 px-4">Loading destinations...</div>
              ) : (
                <ul>
                  {!suggestions?.includes(input.destination) ? (
                    <li>
                      <button
                        type="submit"
                        className="flex py-3 px-4 w-full hover:bg-afternoon-blue/50 focus:bg-afternoon-blue/50 focus:outline-none"
                      >
                        {input.destination}
                      </button>
                    </li>
                  ) : null}
                  {suggestions?.map((suggestion) => (
                    <li key={suggestion}>
                      <button
                        type="submit"
                        className="flex py-3 px-4 w-full hover:bg-afternoon-blue/50 focus:bg-afternoon-blue/50 focus:outline-none"
                        onClick={() =>
                          setInput({ ...input, destination: suggestion })
                        }
                      >
                        {suggestion}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>

        <div className="relative mt-4">
          <select
            name="search.order"
            value={input.order}
            className="h-12 rounded bg-white pl-4 pr-12 border-none appearance-none"
            onChange={(event) => {
              const order = event.currentTarget.value;

              if (order === "asc" || order === "desc") {
                setInput({ ...input, order });
                flights.load({ ...input, order });
              }
            }}
          >
            <option value="asc">Earliest flights first</option>
            <option value="desc">Latest flights first</option>
          </select>

          <ChevronDownIcon className="absolute top-2 right-2 pointer-events-none" />
        </div>
      </div>
    </form>
  );
}
