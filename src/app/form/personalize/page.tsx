
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAppState } from "@/context/app-state-context";
import type { NameFormValues } from "@/lib/types";
import { personalizePageSchema } from "@/lib/types";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ClientInput } from "@/components/client-input";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Personalize Your Name Search | Naamkarann',
    description: 'Start by personalizing your baby name search. Select gender, starting letters, or even blend with parent or sibling names.',
};

const genders = ["Boy", "Girl", "Neutral"] as const;

export default function PersonalizePage() {
  const { state, setState } = useAppState();
  const router = useRouter();

  const form = useForm<NameFormValues>({
    resolver: zodResolver(personalizePageSchema),
    defaultValues: state.formValues,
  });

  const { control, handleSubmit, watch, setValue, getValues, reset } = form;

  const blendParents = watch("blendParents");
  const matchSibling = watch("matchSibling");

  useEffect(() => {
    reset(state.formValues);
  }, [state.formValues, reset]);
  
  useEffect(() => {
    const subscription = watch((value) => {
      setState({ formValues: value as NameFormValues });
    });
    return () => subscription.unsubscribe();
  }, [watch, setState]);


  useEffect(() => {
      if (blendParents) {
          setValue('matchSibling', false);
      }
  }, [blendParents, setValue]);

  useEffect(() => {
      if (matchSibling) {
          setValue('blendParents', false);
      }
  }, [matchSibling, setValue]);


  function onSubmit(data: NameFormValues) {
    setState({ formValues: data });
    router.push("/form/inspirations");
  }

  return (
    <Card className="w-full max-w-2xl shadow-none border-none bg-transparent">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Personalise the name</CardTitle>
        <CardDescription>Add personal touches to make it uniquely yours.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id="personalize-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Gender</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-3 gap-2 pt-2">
                        {genders.map((gender) => (
                            <Button
                            key={gender}
                            type="button"
                            variant={field.value === gender ? "default" : "secondary"}
                            onClick={() => field.onChange(gender)}
                            className={cn("rounded-full", {
                                "bg-blue-100 hover:bg-blue-200 text-blue-800": gender === "Boy" && field.value !== "Boy",
                                "bg-pink-100 hover:bg-pink-200 text-pink-800": gender === "Girl" && field.value !== "Girl",
                            })}
                            >
                            {gender}
                            </Button>
                        ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
                control={control}
                name="startingLetters"
                render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-4">
                        <div>
                             <FormLabel htmlFor="startingLetters" className="font-semibold whitespace-nowrap">Starts with</FormLabel>
                             <p className="text-sm text-muted-foreground whitespace-nowrap">(1-3 characters, Optional)</p>
                        </div>
                        <div className="flex flex-col">
                            <FormControl>
                                <ClientInput
                                    id="startingLetters" 
                                    placeholder="e.g., A, Ra" {...field} 
                                    className="mt-0 w-28"
                                    maxLength={3}
                                />
                            </FormControl>
                            <FormMessage />
                        </div>
                    </FormItem>
                )}
            />

            <div className="space-y-4">
               <FormField
                  control={control}
                  name="blendParents"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                         <div className="flex flex-col">
                            <FormLabel htmlFor="blend-parents-switch" className="font-semibold mb-0 cursor-pointer">Blend with Parent's name</FormLabel>
                            <span className="text-sm text-muted-foreground">(Optional)</span>
                         </div>
                        <FormControl>
                          <Switch id="blend-parents-switch" checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                    </FormItem>
                  )}
                />
              {blendParents && (
                  <div className="grid grid-cols-2 gap-4">
                      <FormField
                          name="parent1Name"
                          control={control}
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">First parent's name</FormLabel>
                                <FormControl>
                                  <Input placeholder="First parent" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                          )}
                      />
                      <FormField
                          name="parent2Name"
                          control={control}
                          render={({ field }) =>(
                            <FormItem>
                              <FormLabel className="sr-only">Second parent's name</FormLabel>
                              <FormControl>
                                <Input placeholder="Second parent" {...field} />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                      />
                  </div>
              )}

              <FormField
                  control={control}
                  name="matchSibling"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex flex-col">
                          <FormLabel htmlFor="match-sibling-switch" className="font-semibold mb-0 cursor-pointer">Match Sibling's name</FormLabel>
                           <span className="text-sm text-muted-foreground">(Optional)</span>
                        </div>
                        <FormControl>
                           <Switch id="match-sibling-switch" checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                    </FormItem>
                  )}
                />
              {matchSibling && (
                  <FormField
                      name="siblingName"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Sibling's name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Priya" {...field} />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                  />
              )}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center space-x-2 pt-2"
            >
              <p className="text-xs text-muted-foreground">Most parents blend or match their kids’ names to create family harmony</p>
            </motion.div>

          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
