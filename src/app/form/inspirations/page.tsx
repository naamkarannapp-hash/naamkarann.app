"use client";

import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppState } from "@/context/app-state-context";
import type { NameFormValues } from "@/lib/types";
import { getAndPrioritizeNames } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Sparkles } from "lucide-react";

const inspirationsList = ["Nature", "Music", "Wisdom", "Heritage", "Literature", "Colors"];

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

export default function InspirationsPage() {
  const { state, setState } = useAppState();
  const router = useRouter();
  const { toast } = useToast();

  const { control, handleSubmit, watch, setValue } = useForm<Pick<NameFormValues, 'inspirations'>>({
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
    
    router.push('/results'); // Navigate immediately to show loading screen

    const result = await getAndPrioritizeNames(finalFormValues);
    
    if ("error" in result) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: result.error,
      });
      setState({ isLoading: false, nameResults: [], error: result.error });
      router.back(); // Go back if there's an error
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
             <Button type="button" variant="ghost" className="text-primary mt-2">+ More inspirations</Button>
          </div>

          <div className="flex justify-end pt-8">
            <Button type="submit" size="lg" className="w-full md:w-auto bg-primary text-primary-foreground font-bold rounded-xl">
              Show Names <Sparkles className="ml-2 h-5 w-5"/>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}