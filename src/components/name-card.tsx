"use client";

import type { NameResult } from "@/lib/types";
import { Badge } from "./ui/badge";
import React from "react";
import { Sparkles } from "lucide-react";

interface NameCardProps {
  name: NameResult;
}

export const NameCard = React.forwardRef<HTMLDivElement, NameCardProps>(
  ({ name }, ref) => {
    const genderEmoji = name.gender === 'boy' ? '👦' : name.gender === 'girl' ? '👧' : null;

    return (
      <div
        ref={ref}
        className="w-full max-w-sm sm:max-w-md mx-auto aspect-[4/5] rounded-3xl shadow-2xl flex flex-col justify-between p-6 sm:p-8 text-white relative overflow-hidden select-none"
        style={{ background: name.gradient || 'linear-gradient(135deg, #1A52E1 0%, #9C27B0 100%)' }}
      >
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between z-10 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="bg-black/25 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide">
              {name.origin}
            </span>
            {name.category && (
              <span className="bg-black/25 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide">
                {name.category}
              </span>
            )}
          </div>

          {genderEmoji && (
            <span className="bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-medium capitalize flex items-center gap-1">
              <span>{genderEmoji}</span>
              <span>{name.gender}</span>
            </span>
          )}
        </div>

        {/* Center Content: Name, Pronunciation, Meaning */}
        <div className="flex flex-col justify-center items-center text-center z-10 my-auto space-y-3 px-2">
          <h2 
            className="font-headline text-5xl sm:text-6xl font-black tracking-tight text-white" 
            style={{ textShadow: '0 3px 10px rgba(0,0,0,0.3)' }}
          >
            {name.name}
          </h2>
          
          {name.pronunciation && (
            <p 
              className="text-sm sm:text-base italic text-white/90 font-medium" 
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.25)' }}
            >
              {name.pronunciation}
            </p>
          )}

          <div className="w-16 h-0.5 bg-white/25 mx-auto my-1 rounded-full" />
          
          <p 
            className="text-sm sm:text-base text-white/95 leading-relaxed max-w-xs mx-auto font-normal" 
            style={{ textShadow: '0 1px 5px rgba(0,0,0,0.35)' }}
          >
            "{name.meaning}"
          </p>
        </div>
        
        {/* Footer Branding Badge */}
        <div className="flex items-center justify-center z-10 pt-2 border-t border-white/15">
          <span className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md text-white/85 text-[11px] font-medium px-3 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-yellow-300" /> Naamkarann.app
          </span>
        </div>
      </div>
    );
  }
);
NameCard.displayName = "NameCard";
