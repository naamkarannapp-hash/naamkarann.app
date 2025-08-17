
"use client";

import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";

const sampleNames = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh",
  "Ayaan", "Krishna", "Ishaan", "Saanvi", "Aanya", "Aadhya", "Aaradhya",
  "Ananya", "Pari", "Diya", "Myra", "Anika", "Avani", "Rohan", "Aryan"
];

export function LoadingSpinner() {
  const [displayName, setDisplayName] = useState(sampleNames[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % sampleNames.length);
    }, 300); // Slowed down from 150ms
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDisplayName(sampleNames[index]);
  }, [index]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative flex items-center justify-center">
        <Loader className="w-48 h-48 text-primary/20 animate-spin-slow" />
        <div className="absolute text-center">
          <p className="font-headline text-3xl font-bold text-primary transition-opacity duration-300 ease-in-out">
            {displayName}
          </p>
        </div>
      </div>
      <p className="mt-8 text-lg md:text-xl text-foreground/80 font-semibold">
        Crafting the perfect name for you...
      </p>
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
