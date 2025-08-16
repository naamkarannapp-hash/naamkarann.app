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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/context/app-state-context";
import type { NameFormValues } from "@/lib/types";
import { nameFormSchema } from "@/lib/types";
import { ArrowRight, MapPin, CaseUpper, BookOpen } from "lucide-react";

export default function CulturalPage() {
  const { state, setState } = useAppState();
  const router = useRouter();

  const form = useForm<Pick<NameFormValues, 'regionalRoots' | 'startingLetters' | 'tradition'>>({
    resolver: zodResolver(nameFormSchema.pick({ regionalRoots: true, startingLetters: true, tradition: true })),
    defaultValues: {
      regionalRoots: state.formValues.regionalRoots,
      startingLetters: state.formValues.startingLetters,
      tradition: state.formValues.tradition,
    },
  });

  function onSubmit(data: Pick<NameFormValues, 'regionalRoots' | 'startingLetters' | 'tradition'>) {
    setState({ formValues: { ...state.formValues, ...data } });
    router.push("/form/inspirations");
  }

  return (
    <Card className="w-full max-w-2xl shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Cultural Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="regionalRoots" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center font-bold"><MapPin className="mr-2 h-4 w-4"/>Regional Roots</FormLabel>
                    <FormControl><Input placeholder="e.g., Indian, Sanskrit" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="startingLetters" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center font-bold"><CaseUpper className="mr-2 h-4 w-4"/>Starting Letter(s)</FormLabel>
                    <FormControl><Input placeholder="e.g., A, Ra" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
            </div>
            
            <FormField control={form.control} name="tradition" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center font-bold"><BookOpen className="mr-2 h-4 w-4"/>Tradition</FormLabel>
                <FormControl><Input placeholder="e.g., Hindu, Christian" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>

            <div className="flex justify-end">
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-white font-bold py-3 px-6 text-lg">
                Next <ArrowRight className="ml-2 h-5 w-5"/>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
