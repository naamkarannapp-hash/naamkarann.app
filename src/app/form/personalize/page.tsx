
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAppState } from "@/context/app-state-context";
import type { NameFormValues, LocationSearchResult } from "@/lib/types";
import { personalizePageSchema } from "@/lib/types";
import React, { useEffect, useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { LocationSearch } from "@/components/location-search";


const genders = ["Boy", "Girl", "Neutral"] as const;

export default function PersonalizePage() {
  const { state, setState } = useAppState();
  const router = useRouter();
  
  const form = useForm<NameFormValues>({
    resolver: zodResolver(personalizePageSchema),
    defaultValues: state.formValues,
  });

  const { control, handleSubmit, watch, setValue, reset } = form;

  const blendParents = watch("blendParents");
  const matchSibling = watch("matchSibling");
  const astrologyMode = watch("astrologyMode");
  
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
          setValue('astrologyMode', false);
      }
  }, [blendParents, setValue]);

  useEffect(() => {
      if (matchSibling) {
          setValue('blendParents', false);
          setValue('astrologyMode', false);
      }
  }, [matchSibling, setValue]);

  useEffect(() => {
    if (astrologyMode) {
      setValue('startingLetters', '');
      setValue('blendParents', false);
      setValue('matchSibling', false);
    } else {
        setValue('dateOfBirth', undefined);
        setValue('timeOfBirth', '');
        setValue('placeOfBirth', '');
        setValue('lat', undefined);
        setValue('lon', undefined);
    }
  }, [astrologyMode, setValue]);

  function handleLocationSelect(location: LocationSearchResult) {
    const locationName = [location.name, location.city, location.state, location.country].filter(Boolean).join(', ');
    setValue('placeOfBirth', locationName, { shouldValidate: true, shouldDirty: true });
    setValue('lat', location.coordinates[0]);
    setValue('lon', location.coordinates[1]);
  }

  function onSubmit(data: NameFormValues) {
    setState({ formValues: data });
    router.push("/form/inspirations");
  }

  return (
    <>
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

            <div className="p-4 border rounded-lg space-y-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <FormField
                      control={control}
                      name="astrologyMode"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel htmlFor="astrology-mode-switch" className="font-semibold mb-0 cursor-pointer flex items-center gap-2">
                            Astrology Mode <span className="text-sm font-normal text-muted-foreground">(Vedic horoscope)</span>
                          </FormLabel>
                          <FormControl>
                            <Switch id="astrology-mode-switch" checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Let us suggest names based on nakshatra, using your baby’s exact birth details.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <AnimatePresence>
                {astrologyMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pt-4">
                       <FormField
                          control={control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Date of Birth</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={control}
                          name="timeOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time of Birth</FormLabel>
                              <FormControl>
                                <ClientInput type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={control}
                          name="placeOfBirth"
                          render={({ field }) => (
                            <FormItem>
                               <FormLabel className="flex items-baseline gap-2">
                                Place of Birth
                                <span className="text-sm font-normal text-muted-foreground">(to calculate star positions)</span>
                              </FormLabel>
                              <FormControl>
                                <LocationSearch
                                  value={field.value || ""}
                                  onValueChange={(value) => field.onChange(value)}
                                  onLocationSelect={handleLocationSelect}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
            {!astrologyMode && (
               <motion.div
                initial={{ opacity: 1, height: "auto" }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6 overflow-hidden"
               >
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
                                          disabled={astrologyMode}
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
                                <Switch id="blend-parents-switch" checked={field.value} onCheckedChange={field.onChange} disabled={astrologyMode} />
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
                                <Switch id="match-sibling-switch" checked={field.value} onCheckedChange={field.onChange} disabled={astrologyMode} />
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
                </motion.div>
              )}
            </AnimatePresence>
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
    </>
  );
}
