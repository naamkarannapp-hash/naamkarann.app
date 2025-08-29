
"use client";

import * as React from "react";
import { useDebounce } from "use-debounce";
import { Command as CommandPrimitive } from "cmdk";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { searchLocations } from "@/lib/actions";
import type { LocationSearchResult } from "@/lib/types";
import { MapPin, Loader2 } from "lucide-react";

type LocationSearchProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (location: LocationSearchResult) => void;
};

export function LocationSearch({ open, onOpenChange, onSelect }: LocationSearchProps) {
  const [query, setQuery] = React.useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [suggestions, setSuggestions] = React.useState<LocationSearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

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
    onSelect(location);
    onOpenChange(false);
    setQuery("");
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Type a city, state, or country..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {isLoading && (
            <div className="p-4 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
        )}
        {!isLoading && suggestions.length === 0 && query.length > 2 && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        <CommandGroup>
          {suggestions.map((location) => (
            <CommandItem
              key={location.id}
              value={[location.name, location.city, location.state, location.country].filter(Boolean).join(", ")}
              onSelect={() => handleSelect(location)}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{[location.name, location.city, location.state, location.country].filter(Boolean).join(", ")}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
