"use client";

import * as React from "react";
import { useDebounce } from "use-debounce";
import { searchLocations } from "@/lib/actions";
import type { LocationSearchResult } from "@/lib/types";
import { MapPin, Loader2 } from "lucide-react";
import { Input } from "./ui/input";

type LocationSearchProps = {
  value: string;
  onValueChange: (value: string) => void;
  onLocationSelect: (location: LocationSearchResult) => void;
};

export function LocationSearch({ value, onValueChange, onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = React.useState(value);
  const [debouncedQuery] = useDebounce(query, 300);
  const [suggestions, setSuggestions] = React.useState<LocationSearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const dataListId = React.useId();

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length > 2) {
        setIsLoading(true);
        const results = await searchLocations(debouncedQuery);
        setSuggestions(results);
        setIsLoading(false);
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onValueChange(newValue);

    // Find the selected location from suggestions and notify the parent
    const selectedSuggestion = suggestions.find(
      (s) => [s.name, s.city, s.state, s.country].filter(Boolean).join(", ") === newValue
    );
    if (selectedSuggestion) {
      onLocationSelect(selectedSuggestion);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for a location"
          value={query}
          onChange={handleInputChange}
          autoComplete="off"
          className="pl-9"
          list={dataListId}
        />
        {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
      
      <datalist id={dataListId}>
        {suggestions.map((location) => (
          <option 
            key={location.id} 
            value={[location.name, location.city, location.state, location.country].filter(Boolean).join(", ")} 
          />
        ))}
      </datalist>
    </div>
  );
}
