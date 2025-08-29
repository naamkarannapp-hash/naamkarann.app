
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
  const [debouncedQuery] = useDebounce(value, 300);
  const [suggestions, setSuggestions] = React.useState<LocationSearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

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
    if(isFocused) {
        fetchSuggestions();
    }
  }, [debouncedQuery, isFocused]);

  const handleSelect = (location: LocationSearchResult) => {
    onLocationSelect(location);
    const locationName = [location.name, location.city, location.state, location.country].filter(Boolean).join(', ');
    onValueChange(locationName);
    setSuggestions([]);
    setIsFocused(false);
  };
  
  const handleBlur = () => {
    // Delay blur to allow click on suggestions
    setTimeout(() => {
        setIsFocused(false);
    }, 200);
  };

  return (
    <div className="relative w-full">
        <div className="relative">
             <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
                type="text"
                placeholder="Search for a location"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                autoComplete="off"
                className="pl-9"
             />
             {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
      
      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
          <ul className="py-1">
            {suggestions.map((location) => (
              <li
                key={location.id}
                className="px-3 py-2 cursor-pointer hover:bg-accent text-sm flex items-center gap-2"
                onClick={() => handleSelect(location)}
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

    