
"use client";

import type { NameResult } from "@/lib/types";
import { Card, CardFooter } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import React from "react";
import { Separator } from "./ui/separator";
import { NaamkarannLogoN } from "./logo-n";

interface NameCardProps {
  name: NameResult;
}

export const NameCard = React.forwardRef<HTMLDivElement, NameCardProps>(
  ({ name }, ref) => {
    return (
      <Card
        ref={ref}
        className="w-full aspect-[4/5] rounded-3xl shadow-2xl flex flex-col justify-between p-8 text-white relative overflow-hidden"
        style={{ background: name.gradient || 'linear-gradient(to top right, #1A52E1, #9C27B0)' }}
      >
        <NaamkarannLogoN className="absolute top-6 right-6 w-8 h-8 text-white/50" />

        <div className="flex-grow flex flex-col justify-center items-center text-center z-10 -mt-8">
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
        
        <CardFooter className="p-0 z-10 justify-center">
            <Badge className="bg-black/10 text-white/80 border-none">Powered by Naamkarann.in</Badge>
        </CardFooter>
      </Card>
    );
  }
);
NameCard.displayName = "NameCard";
