"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppState } from "@/context/app-state-context";
import type { NameFormValues } from "@/lib/types";
import { getAndPrioritizeNames } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const inspirationsList = ["Nature", "Music", "Wisdom", "Heritage", "Literature", "Colors"];
const moreInspirationsList = [
    { name: "Mythology", gradient: "from-amber-200 to-yellow-300" },
    { name: "Animals", gradient: "from-lime-200 to-green-300" },
    { name: "River", gradient: "from-cyan-200 to-blue-300" },
    { name: "Mountains", gradient: "from-slate-300 to-gray-400" },
    { name: "History", gradient: "from-orange-200 to-amber-300" },
    { name: "Flowers", gradient: "from-pink-200 to-rose-300" },
];

const ChipButton = ({ label, isSelected, onSelect, className }: { label: string; isSelected: boolean; onSelect: () => void, className?: string }) => (
    <Button
      type="button"
      variant={isSelected ? "default" : "secondary"}
      onClick={onSelect}
      className={cn("rounded-full", isSelected ? 'text-primary-foreground' : 'text-foreground', className)}
    >
      {label}
    </Button>
);

export default function InspirationsPage() {
  const { state, setState } = useAppState();
  const router = useRouter();
  const { toast } = useToast();
  const [showMoreInspirations, setShowMoreInspirations] = useState(false);

  const { handleSubmit, watch, setValue } = useForm<Pick<NameFormValues, 'inspirations'>>({
    defaultValues: {
      inspirations: state.formValues.inspirations || [],
    },
  });

  const selectedInspirations = watch('inspirations') || [];

  const handleInspirationToggle = (inspiration: string) => {
    const newInspirations = selectedInspirations.includes(inspiration)
      ? selectedInspirations.filter((i) => i !== inspiration)
      : [...selectedInspirations, inspiration];
    setValue('inspirations', newInspirations, { shouldDirty: true });
  };
  
  async function onSubmit(data: Pick<NameFormValues, 'inspirations'>) {
    const finalFormValues = { ...state.formValues, ...data };
    setState({ formValues: finalFormValues, isLoading: true });
    
    router.push('/results');

    const result = await getAndPrioritizeNames(finalFormValues);
    
    if ("error" in result) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: result.error,
      });
      setState({ isLoading: false, nameResults: [], error: result.error });
      router.back();
    } else {
      setState({ nameResults: result.names, isLoading: false, error: null });
    }
  }

  return (
    <Card className="w-full max-w-2xl shadow-none border-none bg-transparent">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Pick up to 3 inspirations</CardTitle>
        <CardDescription>We'll prioritise names with these vibes.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="inspirations-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="flex items-center mb-4">
                <Lightbulb className="w-5 h-5 mr-2 text-primary"/>
                <span className="font-semibold">Trending vibes</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {inspirationsList.map((inspiration) => (
                <ChipButton
                  key={inspiration}
                  label={inspiration}
                  isSelected={selectedInspirations.includes(inspiration)}
                  onSelect={() => handleInspirationToggle(inspiration)}
                />
              ))}
            </div>
             {!showMoreInspirations ? (
                 <Button type="button" variant="ghost" className="text-primary mt-2" onClick={() => setShowMoreInspirations(true)}>+ More inspirations</Button>
             ) : (
                <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {moreInspirationsList.map((item) => (
                           <ChipButton
                                key={item.name}
                                label={item.name}
                                isSelected={selectedInspirations.includes(item.name)}
                                onSelect={() => handleInspirationToggle(item.name)}
                                className={cn(!selectedInspirations.includes(item.name) && `bg-gradient-to-br ${item.gradient} border-none`)}
                           />
                        ))}
                    </div>
                </div>
             )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
