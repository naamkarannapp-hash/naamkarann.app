"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/context/app-state-context";
import type { NameFormValues } from "@/lib/types";
import { nameFormSchema } from "@/lib/types";
import { Sparkles, BookHeart, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { ChipButton } from "@/components/chip-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { InspirationReminderToast } from "@/components/inspiration-reminder-toast";
import { motion, AnimatePresence } from "framer-motion";
import * as gtag from '@/lib/gtag';

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
  const [showReminderToast, setShowReminderToast] = useState(false);

  const form = useForm<NameFormValues>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: state.formValues,
  });

  const { control, handleSubmit, watch, setValue, reset } = form;

  const selectedRoots = watch('regionalRoots') || [];
  const selectedInspirations = watch('inspirations') || [];

  useEffect(() => {
    reset(state.formValues);
  }, [state.formValues, reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      setState({ formValues: value as NameFormValues });
    });
    return () => subscription.unsubscribe();
  }, [watch, setState]);

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
    
    gtag.event({
        action: 'select_root',
        category: 'inspirations',
        label: value,
    });
  };
  
  const addCustomRoot = () => {
    if (selectedRoots.length >= 3) {
      toast({
        description: "You can only select up to 3 roots.",
        variant: "destructive"
      });
      return;
    }
    if (customRoot.trim() && !selectedRoots.includes(customRoot.trim())) {
       const newRoots = [...selectedRoots, customRoot.trim()];
       setValue('regionalRoots', newRoots, { shouldDirty: true, shouldValidate: true });
       gtag.event({
           action: 'add_custom_root',
           category: 'inspirations',
           label: customRoot.trim(),
       });
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

    gtag.event({
        action: 'select_inspiration',
        category: 'inspirations',
        label: inspiration,
    });
  };

  const proceedToResults = (data: NameFormValues) => {
    const finalFormValues = { ...state.formValues, ...data };
    setState({ formValues: finalFormValues, isLoading: true, nameResults: [], error: null });
    gtag.event({
        action: 'click',
        category: 'navigation',
        label: 'Show Names',
    });
    router.push('/results');
  };
  
  async function onSubmit(data: NameFormValues) {
    const hasSelections = (data.regionalRoots && data.regionalRoots.length > 0) || (data.inspirations && data.inspirations.length > 0);
    const reminderCount = parseInt(sessionStorage.getItem('reminderToastCount') || '0');

    if (!hasSelections && reminderCount < 1) {
      sessionStorage.setItem('reminderToastCount', (reminderCount + 1).toString());
      setShowReminderToast(true);
    } else {
      proceedToResults(data);
    }
  }

  const handleToastTap = () => {
    setShowReminderToast(false);
    const chipTray = document.getElementById('InspirationChips');
    chipTray?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  
  const visibleRoots = showMoreRoots ? allCulturalRoots : allCulturalRoots.slice(0, 6);

  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/95 dark:bg-card/95 backdrop-blur-md rounded-3xl border border-primary/15 shadow-xl shadow-primary/5 p-6 sm:p-8"
      >
        {/* Header */}
        <div className="mb-6 text-left">
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Choose Inspirations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Select language roots and thematic vibes to guide your baby name suggestions.
          </p>
        </div>

        <Form {...form}>
          <form id="inspirations-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
              
              {/* Language Roots Section */}
              <div id="InspirationChips" className="p-4 sm:p-5 rounded-2xl bg-muted/30 border border-border/60 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-xl bg-primary/10 text-primary">
                        <BookHeart className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground">Language Roots</span>
                        <span className="text-xs text-muted-foreground">Select up to 3 (Optional, default is all)</span>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-muted-foreground bg-white/80 dark:bg-card/80 px-2 py-0.5 rounded-md border border-border/60">
                      {selectedRoots.length}/3
                    </span>
                  </div>
                  
                  <FormField
                      control={control}
                      name="regionalRoots"
                      render={() => (
                          <FormItem>
                              <FormControl>
                                  <div className="space-y-3">
                                      <div className="grid grid-cols-3 gap-2">
                                          {visibleRoots.map((root) => (
                                              <ChipButton 
                                                  key={root}
                                                  label={root}
                                                  isSelected={selectedRoots.includes(root)}
                                                  onSelect={() => handleChipSelection(root)}
                                              />
                                          ))}
                                      </div>

                                      <div className="flex items-center justify-between pt-1">
                                        {!showMoreRoots ? (
                                            <button 
                                              type="button" 
                                              onClick={() => setShowMoreRoots(true)} 
                                              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                                            >
                                              <Plus className="w-3 h-3" /> More roots ({allCulturalRoots.length - 6})
                                            </button>
                                        ) : (
                                            <button 
                                              type="button" 
                                              onClick={() => setShowMoreRoots(false)} 
                                              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                                            >
                                              <ChevronUp className="w-3 h-3" /> Show fewer roots
                                            </button>
                                        )}
                                      </div>

                                      <AnimatePresence>
                                        {showMoreRoots && (
                                            <motion.div
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: "auto" }}
                                              exit={{ opacity: 0, height: 0 }}
                                              transition={{ duration: 0.2 }}
                                              className="pt-2 overflow-hidden"
                                            >
                                              <div className="flex items-center gap-2">
                                                <Input 
                                                    placeholder="Add custom language root (e.g. Konkani)" 
                                                    value={customRoot} 
                                                    onChange={(e) => setCustomRoot(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomRoot(); } }}
                                                    className="h-9 text-xs rounded-xl bg-white dark:bg-card"
                                                />
                                                <Button type="button" size="sm" onClick={addCustomRoot} className="h-9 px-3 text-xs rounded-xl font-bold">
                                                  Add
                                                </Button>
                                              </div>
                                            </motion.div>
                                        )}
                                      </AnimatePresence>
                                  </div>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
              </div>

              {/* Vibes & Themes Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-muted/30 border border-border/60 space-y-3.5">
                   <FormField
                      control={control}
                      name="inspirations"
                      render={() => (
                          <FormItem className="space-y-3.5">
                              <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2.5">
                                      <div className="p-1.5 rounded-xl bg-accent/10 text-accent">
                                        <Sparkles className="w-4 h-4" />
                                      </div>
                                      <div className="flex flex-col">
                                          <span className="font-bold text-sm text-foreground">Vibes & Themes</span>
                                          <span className="text-xs text-muted-foreground">Select up to 5 (Optional)</span>
                                      </div>
                                  </div>

                                  <span className="text-xs font-semibold text-muted-foreground bg-white/80 dark:bg-card/80 px-2 py-0.5 rounded-md border border-border/60">
                                    {selectedInspirations.length}/5
                                  </span>
                              </div>

                              <FormControl>
                                  <div className="space-y-3">
                                      <div className="grid grid-cols-3 gap-2">
                                      {inspirationsList.map((inspiration) => (
                                          <ChipButton
                                            key={inspiration}
                                            label={inspiration}
                                            isSelected={selectedInspirations.includes(inspiration)}
                                            onSelect={() => handleInspirationToggle(inspiration)}
                                          />
                                      ))}
                                      </div>

                                      <AnimatePresence>
                                        {showMoreInspirations && (
                                            <motion.div
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: "auto" }}
                                              exit={{ opacity: 0, height: 0 }}
                                              transition={{ duration: 0.2 }}
                                              className="grid grid-cols-3 gap-2 pt-1 overflow-hidden"
                                            >
                                                {moreInspirationsList.map((item) => (
                                                <ChipButton
                                                    key={item.name}
                                                    label={item.name}
                                                    isSelected={selectedInspirations.includes(item.name)}
                                                    onSelect={() => handleInspirationToggle(item.name)}
                                                />
                                                ))}
                                            </motion.div>
                                        )}
                                      </AnimatePresence>

                                      <div className="flex items-center justify-between pt-1">
                                        {!showMoreInspirations ? (
                                            <button 
                                              type="button" 
                                              onClick={() => setShowMoreInspirations(true)} 
                                              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                                            >
                                              <Plus className="w-3 h-3" /> More themes ({moreInspirationsList.length})
                                            </button>
                                        ) : (
                                            <button 
                                              type="button" 
                                              onClick={() => setShowMoreInspirations(false)} 
                                              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                                            >
                                              <ChevronUp className="w-3 h-3" /> Show fewer themes
                                            </button>
                                        )}
                                      </div>
                                  </div>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
              </div>

              {/* Tip */}
              <p className="text-xs text-center text-muted-foreground pt-1">
                ✨ You can leave choices empty to get a delightful randomized variety!
              </p>
          </form>
        </Form>
      </motion.div>

      <InspirationReminderToast
        show={showReminderToast}
        onDismiss={() => setShowReminderToast(false)}
        onTap={handleToastTap}
      />
    </div>
  );
}
