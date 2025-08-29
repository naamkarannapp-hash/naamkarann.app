
"use client";

import * as React from "react";
import { useDebounce } from "use-debounce";
import { searchLocations } from "@/lib/actions";
import type { LocationSearchResult } from "@/lib/types";
import { MapPin, Loader2, Check } from "lucide-react";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from "@/components/ui/popover";
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
  const [isOpen, setIsOpen] = React.useState(false);

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
    if (newValue.length > 2) {
        setIsOpen(true);
    } else {
        setIsOpen(false);
    }
  };

  const handleSelect = (location: LocationSearchResult) => {
    const locationName = [location.name, location.city, location.state, location.country].filter(Boolean).join(", ");
    setQuery(locationName);
    onValueChange(locationName);
    onLocationSelect(location);
    setSuggestions([]);
    setIsOpen(false);
  };
  
  const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
      if(!open) {
        setSuggestions([]);
      }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <div className="relative w-full">
         <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <PopoverTrigger asChild>
                <Input
                  type="text"
                  placeholder="Search for a location"
                  value={query}
                  onChange={handleInputChange}
                  onFocus={() => { if(query.length > 2) setIsOpen(true)}}
                  autoComplete="off"
                  className="pl-9"
                />
             </PopoverTrigger>
            {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
      </div>
     
      {suggestions.length > 0 && (
          <PopoverContent 
             className="w-[var(--radix-popover-trigger-width)] p-0"
             align="start"
             onOpenAutoFocus={(e) => e.preventDefault()} // Prevent focus stealing
           >
            <div className="flex flex-col space-y-1 p-1">
                {suggestions.map((location) => {
                    const locationName = [location.name, location.city, location.state, location.country].filter(Boolean).join(", ");
                    return (
                        <button
                            key={location.id}
                            type="button"
                            onClick={() => handleSelect(location)}
                            className={cn(
                                "flex items-center rounded-md p-2 text-left text-sm hover:bg-accent w-full"
                            )}
                        >
                           <span className="flex-grow">{locationName}</span>
                            {value === locationName && <Check className="h-4 w-4" />}
                        </button>
                    )
                })}
            </div>
          </PopoverContent>
      )}
    </Popover>
  );
}
