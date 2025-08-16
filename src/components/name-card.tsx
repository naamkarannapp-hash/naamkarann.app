"use client";

import type { NameResult } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Badge } from "./ui/badge";
import React from "react";

interface NameCardProps {
  name: NameResult;
  onSave: (name: NameResult) => void;
  isSaved: boolean;
}

export function NameCard({ name, onSave, isSaved }: NameCardProps) {
    const [isAnimating, setIsAnimating] = React.useState(false);

    const handleSaveClick = () => {
        setIsAnimating(true);
        onSave(name);
        setTimeout(() => setIsAnimating(false), 600); // Animation duration
    };

  return (
    <Card
      className="w-full h-[450px] rounded-3xl shadow-2xl flex flex-col justify-between p-6 text-white relative overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105"
      style={{ background: name.gradient || 'linear-gradient(to top right, #1A52E1, #9C27B0)' }}
    >
       <div className="flex-grow flex flex-col justify-center items-center text-center z-10">
        <h2 className="font-headline text-6xl font-bold tracking-tight">{name.name}</h2>
        <p className="mt-2 text-lg italic opacity-90">{name.meaning}</p>
      </div>
      
      <div className="flex-shrink-0 z-10">
        <div className="flex justify-between items-center text-sm opacity-80 capitalize">
            <span>Origin: {name.origin}</span>
            <span>Gender: {name.gender}</span>
        </div>
        {name.category && <Badge variant="secondary" className="mt-2 capitalize">{name.category}</Badge>}
      </div>

      <div className="absolute bottom-6 right-6 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSaveClick}
          className={`rounded-full h-14 w-14 bg-white/20 hover:bg-white/30 text-white transform transition-all duration-500 ease-out ${isAnimating ? 'animate-heart-beat' : ''}`}
        >
          <Heart className={`h-7 w-7 transition-colors ${isSaved ? "fill-current text-red-500" : "text-white"}`} />
        </Button>
      </div>

      <style jsx>{`
        @keyframes heart-beat {
          0% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(1); }
          75% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .animate-heart-beat {
          animation: heart-beat 0.6s ease-in-out;
        }
      `}</style>
    </Card>
  );
}
