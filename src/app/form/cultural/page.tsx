
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAppState } from "@/context/app-state-context";
import type { NameFormValues } from "@/lib/types";

const allCulturalRoots = ["Hindi", "Sanskrit", "Tamil", "Telugu", "Bengali", "Gujarati", "Marathi", "Punjabi", "Kannada", "Malayalam", "Odia", "Urdu"];

const ChipButton = ({ label, isSelected, onSelect }: { label: string; isSelected: boolean; onSelect: () => void }) => (
    <Button
      type="button"
      variant={isSelected ? "default" : "secondary"}
      onClick={onSelect}
      className="rounded-full"
    >
      {label}
    </Button>
);

export default function CulturalPage() {
  const { state, setState } = useAppState();
  const router = useRouter();
  
  const [showMoreRoots, setShowMoreRoots] = useState(false);
  const [customRoot, setCustomRoot] = useState("");

  const { handleSubmit, watch, setValue } = useForm<Pick<NameFormValues, 'regionalRoots'>>({
    defaultValues: {
      regionalRoots: state.formValues.regionalRoots && state.formValues.regionalRoots.length > 0 ? state.formValues.regionalRoots : ['Surprise Me'],
    },
  });

  const selectedRoots = watch('regionalRoots') || [];

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

  function onSubmit(data: Pick<NameFormValues, 'regionalRoots'>) {
    if(data.regionalRoots?.includes('Surprise Me')) {
      data.regionalRoots = [];
    }
    setState({ formValues: data });
    router.push("/form/inspirations");
  }

  return (
    <Card className="w-full max-w-2xl shadow-none border-none bg-transparent">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Cultural Preferences</CardTitle>
        <CardDescription>Select cultural roots and traditional preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="cultural-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

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
        </form>
      </CardContent>
    </Card>
  );
}
