"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppState } from "@/context/app-state-context";
import type { NameFormValues } from "@/lib/types";
import { cn } from "@/lib/utils";

const culturalRoots = ["Hindi", "Sanskrit", "Tamil", "Telugu", "Bengali", "Gujarati"];
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label className="font-semibold">Indian Cultural Roots</Label>
                <Switch defaultChecked={true} />
              </div>
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
               <Button type="button" variant="ghost" className="text-primary">+ More roots</Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label className="font-semibold">Traditional (Optional)</Label>
                 <Switch defaultChecked={true} />
              </div>
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
            </div>

            <div className="flex justify-end pt-8">
              <Button type="submit" size="lg" className="w-full md:w-auto bg-primary text-primary-foreground font-bold rounded-xl">
                Next: Inspirations
              </Button>
            </div>
        </form>
      </CardContent>
    </Card>
  );
}