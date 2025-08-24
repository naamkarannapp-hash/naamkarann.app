
"use client";

import React, from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAppState } from "@/context/app-state-context";
import type { NameFormValues } from "@/lib/types";
import { nameFormSchema } from "@/lib/types";
import { Lightbulb, BookHeart } from "lucide-react";
import { ChipButton } from "@/components/chip-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";


const allCulturalRoots = ["Sanskrit", "Hindi", "Tamil", "Marathi", "Kannada", "Telugu", "Bengali", "Gujarati", "Punjabi", "Malayalam", "Odia", "Urdu"];
const inspirationsList = ["Nature", "Music", "Wisdom", "Heritage", "Literature", "Colors"];
const moreInspirationsList = [
    { name: "Mythology" },
    { name: "Animals" },
    { name: "River" },
    { name: "Mountains" },
    { name: "History" },
    { name: "Flowers" },
];


export default function InspirationsPage() {
  const { state, setState } = useAppState();
  const router = useRouter();
  const { toast } = useToast();
  
  const [showMoreRoots, setShowMoreRoots] = React.useState(false);
  const [customRoot, setCustomRoot] = React.useState("");
  const [showMoreInspirations, setShowMoreInspirations] = React.useState(false);

  const form = useForm<NameFormValues>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: state.formValues,
  });

  const { control, handleSubmit, watch, setValue } = form;

  const selectedRoots = watch('regionalRoots') || [];
  const selectedInspirations = watch('inspirations') || [];

  const handleChipSelection = (value: string) => {
    let newSelection = [...selectedRoots];
    if (newSelection.includes(value)) {
      newSelection = newSelection.filter((i) => i !== value);
    } else {
      if (newSelection.length >= 3) {
        toast({
          description: "You can only select up to 3 roots.",
          variant: "destructive"
        });
        return;
      }
      newSelection.push(value);
    }
    setValue('regionalRoots', newSelection, { shouldDirty: true, shouldValidate: true });
  };
  
  const addCustomRoot = () => {
    if (selectedRoots.length >= 3) {
      toast({
        description: "You can only select up to 3 roots.",
        variant: "destructive"
      });
      return;
    }
    if (customRoot && !selectedRoots.includes(customRoot)) {
       const newRoots = [...selectedRoots, customRoot];
       setValue('regionalRoots', newRoots, { shouldDirty: true, shouldValidate: true });
       setCustomRoot("");
    }
  };
  
  const handleInspirationToggle = (inspiration: string) => {
    let newInspirations = [...selectedInspirations];
    if (newInspirations.includes(inspiration)) {
      newInspirations = newInspirations.filter((i) => i !== inspiration);
    } else {
       if (newInspirations.length >= 5) {
        toast({
          description: "You can only select up to 5 vibes.",
          variant: "destructive"
        });
        return;
      }
      newInspirations.push(inspiration);
    }
    setValue('inspirations', newInspirations, { shouldDirty: true, shouldValidate: true });
  };
  
  async function onSubmit(data: NameFormValues) {
    const finalFormValues = { ...state.formValues, ...data };
    
    setState({ formValues: finalFormValues, isLoading: true, nameResults: [], error: null });
    router.push('/results');
  }
  
  const visibleRoots = showMoreRoots ? allCulturalRoots : allCulturalRoots.slice(0, 6);

  return (
    <Card className="w-full max-w-2xl shadow-none border-none bg-transparent">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Choose Inspirations</CardTitle>
        <CardDescription>Select language roots and vibes to find the perfect name.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
        <form id="inspirations-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center">
                    <BookHeart className="w-5 h-5 mr-2 text-primary"/>
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                           <Label className="font-semibold">Language Roots</Label>
                           <span className="text-sm text-muted-foreground">(Select up to 3)</span>
                        </div>
                        <span className="text-sm text-muted-foreground">(Optional, default is Random)</span>
                    </div>
                </div>
                <div className="pt-2 space-y-3">
                     <FormField
                        control={control}
                        name="regionalRoots"
                        render={() => (
                            <FormItem>
                                <FormControl>
                                    <div>
                                        <div className="grid grid-cols-3 gap-3 mt-3">
                                            {visibleRoots.map((root) => (
                                                <ChipButton 
                                                    key={root}
                                                    label={root}
                                                    isSelected={selectedRoots.includes(root)}
                                                    onSelect={() => handleChipSelection(root)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {!showMoreRoots && allCulturalRoots.length > 6 && (
                        <Button type="button" variant="ghost" className="text-primary" onClick={() => setShowMoreRoots(true)}>+ More roots</Button>
                    )}
                     {showMoreRoots && (
                        <div className="space-y-3 pt-2">
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
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
                 <FormField
                    control={control}
                    name="inspirations"
                    render={() => (
                        <FormItem>
                            <div className="flex items-center mb-4">
                                <Lightbulb className="w-5 h-5 mr-2 text-primary"/>
                                <div className="flex flex-col">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-semibold">Vibes</span>
                                        <span className="text-sm text-muted-foreground">(Select up to 5)</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">(Optional, default is Random)</span>
                                </div>
                            </div>
                             <FormControl>
                                <div>
                                    <div className="grid grid-cols-3 gap-3">
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
                                            <div className="grid grid-cols-3 gap-3">
                                                {moreInspirationsList.map((item) => (
                                                <ChipButton
                                                    key={item.name}
                                                    label={item.name}
                                                    isSelected={selectedInspirations.includes(item.name)}
                                                    onSelect={() => handleInspirationToggle(item.name)}
                                                />
                                                ))}
                                            </div>
                                            <Button type="button" variant="ghost" className="text-primary mt-2" onClick={() => setShowMoreInspirations(false)}>- Less inspirations</Button>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage className="pt-2" />
                        </FormItem>
                    )}
                />
            </div>
        </form>
        </Form>
      </CardContent>
    </Card>
  );
}
