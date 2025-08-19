
"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const exampleNames = ["Aarav", "Saanvi", "Vivaan", "Myra", "Reyansh", "Anika", "Arjun", "Diya"];

export function LoadingSpinner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % exampleNames.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="w-48 h-20 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="font-headline text-4xl font-bold text-primary"
          >
            {exampleNames[index]}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-4 text-lg md:text-xl text-muted-foreground font-semibold">
        Crafting names that you love
      </p>
    </div>
  );
}
