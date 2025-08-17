
"use client";

import React from "react";
import { Loader } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative flex items-center justify-center">
        <Loader className="w-48 h-48 text-primary/20 animate-spin-slow" />
        <div className="absolute text-center">
           <p className="font-headline text-2xl font-bold text-primary">Loading...</p>
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
