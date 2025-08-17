
"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAppState } from "@/context/app-state-context";
import type { NameFormValues } from "@/lib/types";
import { getAndPrioritizeNames } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const allCulturalRoots = ["Hindi", "Sanskrit", "Tamil", "Telugu", "Bengali", "Gujarati", "Marathi", "Punjabi", "Kannada", "Malayalam", "Odia", "Urdu"];
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
  
  const [showMoreRoots, setShowMoreRoots] = useState(false);
  const [customRoot, setCustomRoot] = useState("");
  const [showMoreInspirations, setShowMoreInspirations] = useState(false);

  const { handleSubmit, watch, setValue, control } = useForm<Pick<NameFormValues, 'regionalRoots' | 'inspirations'>>({
    defaultValues: {
      regionalRoots: state.formValues.regionalRoots && state.formValues.regionalRoots.length > 0 ? state.formValues.regionalRoots : ['Surprise Me'],
      inspirations: state.formValues.inspirations || [],
    },
  });

  const selectedRoots = useWatch({ control, name: 'regionalRoots' }) || [];
  const selectedInspirations = useWatch({ control, name: 'inspirations' }) || [];

  const handleChipSelection = (value: string) => {
    let newValues: string[];
    newValues = [value];
    setValue('regionalRoots', newValues, { shouldDirty: true });
  };
  
  const addCustomRoot = () => {
    if (customRoot && !selectedRoots.includes(customRoot)) {
      setValue('regionalRoots', [customRoot], { shouldDirty: true });
      setCustomRoot("");
    }
  };
  
  const handleInspirationToggle = (inspiration: string) => {
    let newInspirations = [...selectedInspirations];
    if (newInspirations.includes(inspiration)) {
      newInspirations = newInspirations.filter((i) => i !== inspiration);
    } else {
      if (newInspirations.length < 5) {
        newInspirations.push(inspiration);
      } else {
        toast({
            variant: "default",
            title: "Up to 5 vibes",
            description: "You can select a maximum of 5 vibes.",
        });
      }
    }
    setValue('inspirations', newInspirations, { shouldDirty: true });
  };
  
  async function onSubmit(data: Pick<NameFormValues, 'regionalRoots' | 'inspirations'>) {
    if(data.regionalRoots?.includes('Surprise Me')) {
      data.regionalRoots = [];
    }
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
        <CardTitle className="font-headline text-2xl">Choose Inspirations</CardTitle>
        <CardDescription>Select language roots and vibes to find the perfect name.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="inspirations-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex flex-col">
                  <Label className="font-semibold">Indian Language Roots</Label>
                  <span className="text-sm text-muted-foreground">(Optional)</span>
                </div>
                <div className="flex flex-wrap gap-3">
                    <ChipButton 
                        label="Surprise Me"
                        isSelected={selectedRoots.includes("Surprise Me")}
                        onSelect={() => handleChipSelection("Surprise Me")}
                    />
                </div>
                {!showMoreRoots ? (
                    <Button type="button" variant="ghost" className="text-primary" onClick={() => setShowMoreRoots(true)}>+ More roots</Button>
                ) : (
                <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-3 gap-3">
                        {allCulturalRoots.map((root) => (
                            <ChipButton 
                                key={root}
                                label={root}
                                isSelected={selectedRoots.includes(root)}
                                onSelect={() => handleChipSelection(root)}
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                    <Input 
                        placeholder="Add your own root" 
                        value={customRoot} 
                        onChange={(e) => setCustomRoot(e.target.value)}
                    />
                    <Button type="button" onClick={addCustomRoot}>Add</Button>
                    </div>
                    <Button type="button" variant="ghost" className="text-primary" onClick={() => setShowMoreRoots(false)}>- Less roots</Button>
                </div>
                )}
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center mb-4">
                    <Lightbulb className="w-5 h-5 mr-2 text-primary"/>
                    <div className="flex flex-col">
                        <span className="font-semibold">Vibes (select up to 5)</span>
                        <span className="text-sm text-muted-foreground">(Optional)</span>
                    </div>
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
