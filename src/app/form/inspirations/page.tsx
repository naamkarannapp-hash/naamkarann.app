"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAppState } from "@/context/app-state-context";
import type { NameFormValues } from "@/lib/types";
import { nameFormSchema } from "@/lib/types";
import { Lightbulb, Sparkles } from "lucide-react";
import { getAndPrioritizeNames } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export default function InspirationsPage() {
  const { state, setState } = useAppState();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<Pick<NameFormValues, 'inspirations'>>({
    resolver: zodResolver(nameFormSchema.pick({ inspirations: true })),
    defaultValues: {
      inspirations: state.formValues.inspirations,
    },
  });

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
    <Card className="w-full max-w-2xl shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Inspirations</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField control={form.control} name="inspirations" render={({ field }) => (
                <FormItem>
                <FormLabel className="flex items-center font-bold"><Lightbulb className="mr-2 h-4 w-4"/>Inspirations</FormLabel>
                <FormControl><Textarea rows={6} placeholder="Describe any inspirations: a character, a value, a place, a favorite book..." {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}/>

            <div className="flex justify-end">
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-white font-bold py-3 px-6 text-lg">
                Generate Names <Sparkles className="ml-2 h-5 w-5"/>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
