
"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { namesByTradition } from "@/lib/name-data";

export function LoadingSpinner() {
  const [displayNames, setDisplayNames] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Create a randomized list of names on the client
    const traditions = Object.values(namesByTradition);
    const randomized = traditions.map(names => names[Math.floor(Math.random() * names.length)]);
    
    // Shuffle the randomized names
    for (let i = randomized.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [randomized[i], randomized[j]] = [randomized[j], randomized[i]];
    }
    
    setDisplayNames(randomized);
  }, []);

  useEffect(() => {
    if (displayNames.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % displayNames.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [displayNames]);
  
  if (displayNames.length === 0) {
    return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
         <div className="w-48 h-20 flex items-center justify-center overflow-hidden"></div>
         <p className="mt-4 text-lg md:text-xl text-muted-foreground font-semibold">
           Crafting names that you love
         </p>
       </div>
    )
  }

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
            className="font-headline text-4xl text-purple-400/80"
             style={{ textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            {displayNames[index]}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-4 text-lg md:text-xl text-muted-foreground font-semibold">
        Crafting names that you love
      </p>
    </div>
  );
}
