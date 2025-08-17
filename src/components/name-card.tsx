"use client";

import type { NameResult } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Volume2 } from "lucide-react";
import { Badge } from "./ui/badge";
import React from "react";
import { cn } from "@/lib/utils";

interface NameCardProps {
  name: NameResult;
  onSave: (name: NameResult) => void;
  isSaved: boolean;
}

export function NameCard({ name, onSave, isSaved }: NameCardProps) {
    const [isAnimating, setIsAnimating] = React.useState(false);

    const handleSaveClick = () => {
        setIsAnimating(false); 
        onSave(name);
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
    };
    
    const handleAnimationEnd = () => {
        setIsAnimating(false);
    };

  return (
    <Card
      className="w-full h-[480px] rounded-3xl shadow-2xl flex flex-col justify-between p-6 text-white relative overflow-hidden"
      style={{ background: name.gradient || 'linear-gradient(to top right, #1A52E1, #9C27B0)' }}
    >
       <div className="flex-grow flex flex-col justify-center items-center text-center z-10">
        <div className="relative">
            <h2 className="font-headline text-6xl font-bold tracking-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{name.name}</h2>
            <Button variant="ghost" size="icon" className="absolute -top-1 -right-8 bg-white/20 hover:bg-white/30 rounded-full h-8 w-8">
                <Volume2 className="h-4 w-4 text-white" />
            </Button>
        </div>
        <p className="mt-2 text-lg italic opacity-90" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>{name.meaning}</p>
        
        <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="capitalize bg-white/20 border-none">{name.origin}</Badge>
            {name.category && <Badge variant="secondary" className="capitalize bg-white/20 border-none">{name.category}</Badge>}
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSaveClick}
          onAnimationEnd={handleAnimationEnd}
          className={cn(
            "rounded-full h-16 w-16 bg-white/20 hover:bg-white/30 text-white transform transition-all duration-300 ease-out",
            isAnimating && 'animate-heart-beat'
          )}
        >
          <Heart className={cn("h-8 w-8 transition-colors", isSaved ? "fill-current text-red-500" : "text-white")} />
        </Button>
      </div>

      <style jsx>{`
        @keyframes heart-beat {
          0% { transform: scale(1); }
          25% { transform: scale(1.2); }
          50% { transform: scale(1); }
          75% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-heart-beat {
          animation: heart-beat 0.5s ease-in-out;
        }
      `}</style>
    </Card>
  );
}
