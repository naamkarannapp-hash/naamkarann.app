"use client";

import * as React from "react";
import { useAppState } from "@/context/app-state-context";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { NameCard } from "@/components/name-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bookmark, X, ArrowLeft } from "lucide-react";
import type { NameResult } from "@/lib/types";
import { LoadingSpinner } from "@/components/loading-spinner";
import Link from 'next/link';

export default function ResultsPage() {
  const { state, setState } = useAppState();
  const { isLoading, nameResults, savedNames } = state;

  const handleSaveName = (name: NameResult) => {
    setState(prevState => {
      const isSaved = prevState.savedNames.some(saved => saved.id === name.id);
      if (isSaved) {
        return { savedNames: prevState.savedNames.filter(saved => saved.id !== name.id) };
      } else {
        return { savedNames: [...prevState.savedNames, name] };
      }
    });
  };

  const isNameSaved = (id: string) => savedNames.some(n => n.id === id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
       <header className="relative flex items-center justify-center my-8">
         <Link href="/form/inspirations" passHref>
            <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2">
                <ArrowLeft className="h-4 w-4"/>
            </Button>
         </Link>
        <h1 className="font-headline text-5xl font-bold text-primary">Your Names</h1>
         <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="secondary" className="rounded-full shadow-lg">
                        <Bookmark className="mr-2 h-5 w-5"/> 
                        Saved ({savedNames.length})
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Your Saved Names</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-4">
                        {savedNames.length > 0 ? (
                            savedNames.map(name => (
                                <Card key={name.id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{name.name}</p>
                                        <p className="text-sm text-muted-foreground">{name.meaning}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleSaveName(name)}>
                                        <X className="h-4 w-4"/>
                                    </Button>
                                </Card>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground mt-8">You haven't saved any names yet.</p>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </header>

      <main>
        {nameResults.length > 0 ? (
          <section className="mt-12">
              <h2 className="text-center font-headline text-3xl md:text-4xl font-bold text-primary mb-8">Swipe to Discover</h2>
              <Carousel className="w-full max-w-md mx-auto" opts={{ loop: true }}>
                  <CarouselContent>
                      {nameResults.map((name) => (
                      <CarouselItem key={name.id}>
                          <div className="p-1">
                            <NameCard name={name} onSave={handleSaveName} isSaved={isNameSaved(name.id)} />
                          </div>
                      </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious className="text-accent" />
                  <CarouselNext className="text-accent" />
              </Carousel>
          </section>
        ) : (
            <div className="text-center my-20">
                <h2 className="font-headline text-3xl font-bold text-destructive">No Names Found</h2>
                <p className="mt-4 text-lg text-foreground/80">We couldn't find any names matching your criteria.</p>
                <Link href="/form/personalize" passHref>
                    <Button className="mt-8">
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Start Over
                    </Button>
                </Link>
            </div>
        )}
      </main>
    </div>
  );
}
