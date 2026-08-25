"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { curatedNamesDatabase } from "@/lib/curated-names";
import { Sparkles, Wand2 } from "lucide-react";

const loadingSteps = [
  "Analyzing cultural roots & heritage...",
  "Exploring poetic meanings & origins...",
  "Harmonizing phonetic syllables & vibe...",
  "Curating your personalized top 10 names...",
];

export function LoadingSpinner() {
  const [names, setNames] = useState<string[]>([]);
  const [nameIndex, setNameIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const list = curatedNamesDatabase.map(n => n.name).sort(() => 0.5 - Math.random());
    setNames(list);
  }, []);

  // Cycle rotating names
  useEffect(() => {
    if (names.length === 0) return;
    const interval = setInterval(() => {
      setNameIndex((prev) => (prev + 1) % names.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [names]);

  // Cycle progress steps
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const currentName = names[nameIndex] || "Aarav";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground pattern-background px-4 relative overflow-hidden">
      {/* Ambient background glowing halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-blue-200/35 via-purple-200/25 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white/95 dark:bg-card/95 backdrop-blur-md rounded-3xl border border-primary/15 shadow-2xl p-8 sm:p-10 text-center flex flex-col items-center space-y-6"
      >
        {/* Animated AI Glowing Orb */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 animate-pulse">
            <Wand2 className="w-8 h-8 text-white animate-bounce" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-spin-slow" />
          </div>
        </div>

        {/* Rotating Name Showcase Pill */}
        <div className="w-full space-y-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Crafting names like
          </span>
          <div className="h-14 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentName}
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.9 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="font-headline text-3xl sm:text-4xl font-extrabold text-primary tracking-wide"
                style={{ textShadow: "0 2px 8px rgba(26,82,225,0.15)" }}
              >
                {currentName}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Live Step Progression */}
        <div className="w-full space-y-3 pt-2">
          <div className="h-6 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={stepIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-xs sm:text-sm text-foreground/80 font-medium"
              >
                {loadingSteps[stepIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Shimmering Indeterminate Progress Bar */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full w-1/3"
              animate={{
                x: ["-100%", "300%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
