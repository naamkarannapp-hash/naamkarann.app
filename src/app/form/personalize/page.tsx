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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppState } from "@/context/app-state-context";
import type { NameFormValues } from "@/lib/types";
import { nameFormSchema } from "@/lib/types";
import { ArrowRight, Users, Baby } from "lucide-react";

export default function PersonalizePage() {
  const { state, setState } = useAppState();
  const router = useRouter();

  const form = useForm<Pick<NameFormValues, 'gender' | 'parent1Name' | 'parent2Name' | 'siblingName'>>({
    resolver: zodResolver(nameFormSchema.pick({ gender: true, parent1Name: true, parent2Name: true, siblingName: true })),
    defaultValues: {
      gender: state.formValues.gender,
      parent1Name: state.formValues.parent1Name,
      parent2Name: state.formValues.parent2Name,
      siblingName: state.formValues.siblingName,
    },
  });

  function onSubmit(data: Pick<NameFormValues, 'gender' | 'parent1Name' | 'parent2Name' | 'siblingName'>) {
    setState({ formValues: { ...state.formValues, ...data } });
    router.push("/form/cultural");
  }

  return (
    <Card className="w-full max-w-2xl shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Personalize Your Search</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="font-bold">Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="Male" /></FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="Female" /></FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="Neutral" /></FormControl>
                        <FormLabel className="font-normal">Neutral</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="flex items-center mb-2 font-bold"><Users className="mr-2 h-4 w-4"/>Parent's Name Blend</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <FormField control={form.control} name="parent1Name" render={({ field }) => (
                     <FormItem><FormControl><Input placeholder="Parent 1" {...field} /></FormControl><FormMessage /></FormItem>
                   )}/>
                   <FormField control={form.control} name="parent2Name" render={({ field }) => (
                     <FormItem><FormControl><Input placeholder="Parent 2" {...field} /></FormControl><FormMessage /></FormItem>
                   )}/>
              </div>
            </div>

            <FormField control={form.control} name="siblingName" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center font-bold"><Baby className="mr-2 h-4 w-4"/>Match Sibling's Name</FormLabel>
                <FormControl><Input placeholder="e.g., Priya" {...field} /></FormControl>
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
