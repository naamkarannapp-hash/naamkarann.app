
"use client";

import * as React from "react";
import { useDebounce } from "use-debounce";
import { searchLocations } from "@/lib/actions";
import type { LocationSearchResult } from "@/lib/types";
import { MapPin, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

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
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const wrapperRef = React.useRef<HTMLDivElement>(null);

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

  const handleSelect = (location: LocationSearchResult) => {
    onLocationSelect(location);
    const locationName = [location.name, location.city, location.state, location.country].filter(Boolean).join(', ');
    onValueChange(locationName);
    setQuery(locationName);
    setShowSuggestions(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onValueChange(newValue); // Keep form state in sync
    setShowSuggestions(true);
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for a location"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          autoComplete="off"
          className="pl-9"
        />
        {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
          <ul className="py-1">
            {suggestions.map((location) => (
              <li
                key={location.id}
                className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm flex items-center gap-2"
                onMouseDown={(e) => {
                  e.preventDefault(); // This is crucial to prevent the input from losing focus
                  handleSelect(location)
                }}
              >
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{[location.name, location.city, location.state, location.country].filter(Boolean).join(", ")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
