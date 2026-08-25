"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Compass, Heart, Users } from "lucide-react";
import * as gtag from '@/lib/gtag';

const genders = [
  { value: "Boy", label: "Boy", icon: "👦", color: "hover:border-blue-300 active:border-blue-400" },
  { value: "Girl", label: "Girl", icon: "👧", color: "hover:border-pink-300 active:border-pink-400" },
  { value: "Neutral", label: "Neutral", icon: "✨", color: "hover:border-purple-300 active:border-purple-400" },
] as const;

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
  const currentGender = watch("gender");
  
  useEffect(() => {
    reset(state.formValues);
  }, [state.formValues, reset]);
  
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      setState({ formValues: value as NameFormValues });
      
      if (type === 'change') {
          if (name === 'gender') {
            gtag.event({
                action: 'select_gender',
                category: 'personalize',
                label: value.gender || 'Unknown',
            });
          } else if (name === 'blendParents') {
            gtag.event({
                action: 'toggle_blend_parents',
                category: 'personalize',
                label: value.blendParents ? 'on' : 'off',
            });
          } else if (name === 'matchSibling') {
            gtag.event({
                action: 'toggle_match_sibling',
                category: 'personalize',
                label: value.matchSibling ? 'on' : 'off',
            });
          }
      }
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
  
  const handleAstrologyClick = () => {
    gtag.event({
        action: 'click',
        category: 'personalize',
        label: 'Astrology Link',
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/95 dark:bg-card/95 backdrop-blur-md rounded-3xl border border-primary/15 shadow-xl shadow-primary/5 p-6 sm:p-8"
      >
        {/* Title Header */}
        <div className="mb-6 text-left">
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Personalise the name
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose preferences to find unique names that resonate with your family.
          </p>
        </div>

        <Form {...form}>
          <form id="personalize-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
            
            {/* Gender Selection Section */}
            <FormField
              control={control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-bold text-foreground">Gender</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-3 gap-2.5">
                        {genders.map((g) => {
                          const isSelected = field.value === g.value;
                          return (
                            <button
                              key={g.value}
                              type="button"
                              onClick={() => field.onChange(g.value)}
                              className={cn(
                                "flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 px-3 rounded-2xl border-2 font-semibold text-sm transition-all select-none",
                                isSelected 
                                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-[1.02]" 
                                  : "bg-white/70 dark:bg-card/70 border-border/80 text-foreground hover:bg-muted/50 hover:border-primary/30"
                              )}
                            >
                              <span className="text-lg">{g.icon}</span>
                              <span>{g.label}</span>
                            </button>
                          );
                        })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Astrology Link Callout */}
            <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-blue-950 dark:text-blue-200">
                <Compass className="w-4 h-4 text-primary shrink-0 animate-spin-slow" />
                <span>Looking for Vedic astrology names?</span>
              </div>
              <Link 
                href="/check-nakshatra-rashi" 
                onClick={handleAstrologyClick} 
                className="text-primary font-bold hover:underline shrink-0 flex items-center gap-0.5"
              >
                Check Nakshatra & Rashi ➔
              </Link>
            </div>

            {/* Starting Letters Field */}
            <FormField
              control={control}
              name="startingLetters"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-muted/30 border border-border/60">
                  <div>
                    <FormLabel htmlFor="startingLetters" className="font-bold text-sm text-foreground">
                      Starts with
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">(1-3 characters, Optional)</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <FormControl>
                      <ClientInput
                        id="startingLetters" 
                        placeholder="e.g. A, Ra" {...field} 
                        className="w-28 text-center font-semibold rounded-xl bg-white dark:bg-card border-border/80 focus:border-primary uppercase"
                        maxLength={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Family Name Harmonization Options */}
            <div className="space-y-3 pt-1">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Family Harmonization
              </span>

              {/* Blend Parent Names */}
              <FormField
                control={control}
                name="blendParents"
                render={({ field }) => (
                  <FormItem className={cn(
                    "p-4 rounded-2xl border transition-all",
                    field.value 
                      ? "bg-primary/5 border-primary/40 shadow-sm" 
                      : "bg-muted/30 border-border/60"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                          <Heart className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <FormLabel htmlFor="blend-parents-switch" className="font-bold text-sm text-foreground cursor-pointer">
                            Blend with Parents' names
                          </FormLabel>
                          <span className="text-xs text-muted-foreground">Creates a fusion of both parents</span>
                        </div>
                      </div>
                      <FormControl>
                        <Switch id="blend-parents-switch" checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </div>

                    <AnimatePresence>
                      {blendParents && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="grid grid-cols-2 gap-3 pt-3 overflow-hidden"
                        >
                          <FormField
                            name="parent1Name"
                            control={control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-semibold text-muted-foreground">Parent 1</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Rahul" {...field} className="rounded-xl bg-white dark:bg-card" />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="parent2Name"
                            control={control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-semibold text-muted-foreground">Parent 2</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Priya" {...field} className="rounded-xl bg-white dark:bg-card" />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />

              {/* Match Sibling Name */}
              <FormField
                control={control}
                name="matchSibling"
                render={({ field }) => (
                  <FormItem className={cn(
                    "p-4 rounded-2xl border transition-all",
                    field.value 
                      ? "bg-primary/5 border-primary/40 shadow-sm" 
                      : "bg-muted/30 border-border/60"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <FormLabel htmlFor="match-sibling-switch" className="font-bold text-sm text-foreground cursor-pointer">
                            Match Sibling's name
                          </FormLabel>
                          <span className="text-xs text-muted-foreground">Matches style and phonetic harmony</span>
                        </div>
                      </div>
                      <FormControl>
                        <Switch id="match-sibling-switch" checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </div>

                    <AnimatePresence>
                      {matchSibling && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pt-3 overflow-hidden"
                        >
                          <FormField
                            name="siblingName"
                            control={control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-semibold text-muted-foreground">Sibling's Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Ananya" {...field} className="rounded-xl bg-white dark:bg-card" />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />
            </div>

            {/* Tip */}
            <p className="text-xs text-center text-muted-foreground pt-1">
              ✨ 85% of parents choose starting letters or family blending for meaningful names.
            </p>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
