
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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


const genders = ["Boy", "Girl", "Neutral"] as const;

export default function PersonalizePage() {
  const { state, setState } = useAppState();
  const router = useRouter();

  const form = useForm<Pick<NameFormValues, 'gender' | 'startingLetters' | 'blendParents' | 'parent1Name' | 'parent2Name' | 'matchSibling' | 'siblingName'>>({
    resolver: zodResolver(personalizePageSchema),
    defaultValues: {
      gender: state.formValues.gender || 'Neutral',
      startingLetters: state.formValues.startingLetters || "",
      blendParents: state.formValues.blendParents || false,
      parent1Name: state.formValues.parent1Name || "",
      parent2Name: state.formValues.parent2Name || "",
      matchSibling: state.formValues.matchSibling || false,
      siblingName: state.formValues.siblingName || "",
    },
  });

  const { control, handleSubmit, watch, setValue } = form;

  const blendParents = watch("blendParents");
  const matchSibling = watch("matchSibling");

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


  function onSubmit(data: Pick<NameFormValues, 'gender' | 'startingLetters' | 'blendParents' | 'parent1Name' | 'parent2Name' | 'matchSibling' | 'siblingName'>) {
    setState({ formValues: data });
    router.push("/form/cultural");
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
                            className="rounded-full"
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
                    <FormItem className="flex items-center gap-4">
                        <FormLabel htmlFor="startingLetters" className="font-semibold whitespace-nowrap">Starts with (1-3 characters, Optional)</FormLabel>
                        <FormControl>
                            <Input 
                                id="startingLetters" 
                                placeholder="e.g., A, Ra" {...field} 
                                className="mt-0"
                                maxLength={3}
                                onChange={(e) => {
                                  field.onChange(e.target.value.slice(0, 3));
                                }}
                            />
                        </FormControl>
                         <FormMessage />
                    </FormItem>
                )}
            />

            <div className="space-y-4">
               <FormField
                  control={control}
                  name="blendParents"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                        <FormLabel htmlFor="blend-parents-switch" className="font-semibold mb-0">Blend with Parent's name (Optional)</FormLabel>
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
                        <FormLabel htmlFor="match-sibling-switch" className="font-semibold mb-0">Match Sibling's name (Optional)</FormLabel>
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
                          <FormControl>
                            <Input placeholder="e.g., Priya" {...field} />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                  />
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
