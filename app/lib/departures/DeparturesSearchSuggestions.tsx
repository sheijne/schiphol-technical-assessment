import { useMemo, type ReactNode } from "react";
import { getLevenshteinDistance } from "~/lib/utils.js";

export interface DeparturesSearchSuggestionsProps {
    query: string;
    destinations: string[];
    loading: ReactNode;
    onSelect?: (value: string) => void;
}

export function DeparturesSearchSuggestions({ query, destinations, onSelect }: DeparturesSearchSuggestionsProps) {
    const suggestions = useMemo(() =>
        destinations.filter(
            (destination) => destination.toLowerCase().includes(query.toLowerCase())
        )
        .sort(
            (a, b) => getLevenshteinDistance(b, query) - getLevenshteinDistance(a, query)
        ),
        [destinations, query]
    );

    return (
        <div
            className="absolute left-0 bottom-0 translate-y-full w-full bg-white/50 backdrop-blur border border-white/25 rounded-b">
            <ul>
                {!suggestions.includes(query) ? (
                    <li>
                        <button
                            onClick={() => onSelect?.(query)}
                            className="flex py-2 px-4 w-full hover:bg-afternoon-blue/50 focus:bg-afternoon-blue/50 focus:outline-none"
                        >
                            {query}
                        </button>
                    </li>
                ) : null}
                {suggestions.map((suggestion) => (
                    <li key={suggestion}>
                        <button
                            onClick={() => onSelect?.(suggestion)}
                            className="flex py-2 px-4 w-full hover:bg-afternoon-blue/50 focus:bg-afternoon-blue/50 focus:outline-none"
                        >
                            {suggestion}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}