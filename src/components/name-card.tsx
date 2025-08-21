
"use client";

import type { NameResult } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import React from "react";
import { Separator } from "./ui/separator";

interface NameCardProps {
  name: NameResult;
}

export function NameCard({ name }: NameCardProps) {
  return (
    <Card
      className="w-full h-[480px] rounded-3xl shadow-2xl flex flex-col justify-between p-6 text-white relative overflow-hidden"
      style={{ background: name.gradient || 'linear-gradient(to top right, #1A52E1, #9C27B0)' }}
    >
       <div className="flex-grow flex flex-col justify-center items-center text-center z-10">
        <div className="relative">
            <h2 className="font-headline text-6xl font-bold tracking-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{name.name}</h2>
        </div>
        
        <div className="mt-4 w-1/2">
            <p className="text-base italic opacity-80" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>{name.pronunciation}</p>
            <Separator className="my-2 bg-white/20" />
        </div>
        
        <p className="mt-4 text-lg opacity-90 max-w-xs" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>{name.meaning}</p>
        
        <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="capitalize bg-black/10 hover:bg-black/10 text-white/80 border-none font-normal">{name.origin}</Badge>
            {name.category && <Badge variant="secondary" className="capitalize bg-black/10 hover:bg-black/10 text-white/80 border-none font-normal">{name.category}</Badge>}
        </div>
      </div>
      
    </Card>
  );
}
