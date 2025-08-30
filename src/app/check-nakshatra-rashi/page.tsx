
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { LocationSearchResult, NakshatraResult } from "@/lib/types";
import React, { useState } from "react";
import { z } from "zod";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { LocationSearch } from "@/components/location-search";
import { ClientInput } from "@/components/client-input";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { getNakshatraDetails } from "@/lib/actions";
import { LoadingSpinner } from "@/components/loading-spinner";
import { NakshatraResultCard } from "@/components/nakshatra-result-card";
import { AnimatePresence, motion } from "framer-motion";


const nakshatraSchema = z.object({
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  timeOfBirth: z.string().nonempty("Time of birth is required."),
  placeOfBirth: z.string().nonempty("Place of birth is required."),
  lat: z.number({ required_error: "Please select a valid location." }),
  lon: z.number({ required_error: "Please select a valid location." }),
});

type NakshatraFormValues = z.infer<typeof nakshatraSchema>;


export default function CheckNakshatraRashiPage() {
  const { toast } = useToast();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NakshatraResult | null>(null);
  
  const form = useForm<NakshatraFormValues>({
    resolver: zodResolver(nakshatraSchema),
    defaultValues: {
      timeOfBirth: "",
      placeOfBirth: "",
    },
  });

  const { control, handleSubmit, setValue } = form;

  function handleLocationSelect(location: LocationSearchResult) {
    setValue('placeOfBirth', [location.name, location.city, location.state, location.country].filter(Boolean).join(", "));
    setValue('lat', location.coordinates[0], { shouldValidate: true, shouldDirty: true });
    setValue('lon', location.coordinates[1], { shouldValidate: true, shouldDirty: true });
  }

  async function onSubmit(data: NakshatraFormValues) {
    setIsLoading(true);
    setResult(null);

    const apiPayload = {
      ...data,
      dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
    };

    const response = await getNakshatraDetails(apiPayload);

    setIsLoading(false);

    if ("error" in response) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      setResult(response.result);
    }
  }

  const handleReset = () => {
    setResult(null);
    form.reset();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pattern-background">
      <div className="container mx-auto p-4 md:p-8 flex-grow">
          <header className="flex items-center justify-between">
            <Button variant="ghost" asChild>
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Link>
            </Button>
          </header>
          <main className="flex-grow flex items-start justify-center pt-8">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingSpinner />
                </motion.div>
              ) : result ? (
                 <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-md"
                  >
                    <NakshatraResultCard result={result} onReset={handleReset} />
                 </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <Card className="w-full max-w-lg mx-auto shadow-none border-none bg-transparent">
                    <CardHeader>
                      <CardTitle className="font-headline text-3xl text-center">Check Nakshatra &amp; Rashi</CardTitle>
                      <CardDescription className="text-center">Enter birth details to find the birth star and moon sign.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Date of Birth</FormLabel>
                                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
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
                                      onSelect={(date) => {
                                        field.onChange(date);
                                        setIsDatePickerOpen(false);
                                      }}
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
                                  <ClientInput type="time" placeholder="HH:MM (24-hour)" {...field} />
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
                                <FormLabel>Place of Birth</FormLabel>
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
                          <div className="pt-4">
                              <Button type="submit" className="w-full" size="lg">Check Now</Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
      </div>
    </div>
  );
}
