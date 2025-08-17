"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppState } from "@/context/app-state-context";
import type { NameFormValues } from "@/lib/types";

const culturalRoots = ["Hindi", "Sanskrit", "Tamil", "Telugu", "Bengali", "Gujarati"];
const moreCulturalRoots = ["Marathi", "Punjabi", "Kannada", "Malayalam", "Odia", "Urdu"];
const traditions = ["Hindu", "Christian", "Muslim", "Sikh", "Jain", "Buddhist"];

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
  const [showTraditions, setShowTraditions] = useState(false);
  const [customRoot, setCustomRoot] = useState("");

  const { control, handleSubmit, watch, setValue } = useForm<Pick<NameFormValues, 'regionalRoots' | 'tradition'>>({
    defaultValues: {
      regionalRoots: state.formValues.regionalRoots || [],
      tradition: state.formValues.tradition || [],
    },
  });

  const selectedRoots = watch('regionalRoots') || [];
  const selectedTraditions = watch('tradition') || [];

  const handleChipSelection = (field: 'regionalRoots' | 'tradition', value: string) => {
    const currentValues = watch(field) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    setValue(field, newValues, { shouldDirty: true });
  };
  
  const addCustomRoot = () => {
    if (customRoot && !selectedRoots.includes(customRoot)) {
      setValue('regionalRoots', [...selectedRoots, customRoot], { shouldDirty: true });
      setCustomRoot("");
    }
  };

  function onSubmit(data: Pick<NameFormValues, 'regionalRoots' | 'tradition'>) {
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

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label className="font-semibold">Indian Cultural Roots</Label>
                <Switch 
                  checked={selectedRoots.length > 0 || showMoreRoots}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      setValue('regionalRoots', []);
                      setShowMoreRoots(false);
                    }
                  }}
                 />
              </div>
              {(selectedRoots.length > 0 || showMoreRoots || culturalRoots.some(r => selectedRoots.includes(r))) && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {culturalRoots.map((root) => (
                          <ChipButton 
                              key={root}
                              label={root}
                              isSelected={selectedRoots.includes(root)}
                              onSelect={() => handleChipSelection('regionalRoots', root)}
                          />
                      ))}
                  </div>
                  {!showMoreRoots ? (
                     <Button type="button" variant="ghost" className="text-primary" onClick={() => setShowMoreRoots(true)}>+ More roots</Button>
                  ) : (
                    <div className="space-y-3 pt-2">
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {moreCulturalRoots.map((root) => (
                              <ChipButton 
                                  key={root}
                                  label={root}
                                  isSelected={selectedRoots.includes(root)}
                                  onSelect={() => handleChipSelection('regionalRoots', root)}
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
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label className="font-semibold">Traditional (Optional)</Label>
                 <Switch
                    checked={showTraditions}
                    onCheckedChange={(checked) => {
                        setShowTraditions(checked)
                        if (!checked) setValue('tradition', []);
                    }}
                 />
              </div>
              {showTraditions && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {traditions.map((trad) => (
                        <ChipButton 
                            key={trad}
                            label={trad}
                            isSelected={selectedTraditions.includes(trad)}
                            onSelect={() => handleChipSelection('tradition', trad)}
                        />
                    ))}
                </div>
              )}
            </div>
        </form>
      </CardContent>
    </Card>
  );
}
