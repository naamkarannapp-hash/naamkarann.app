"use client";

import * as React from "react";
import { useAppState } from "@/context/app-state-context";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { NameCard } from "@/components/name-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bookmark, X, ArrowLeft, SlidersHorizontal } from "lucide-react";
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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 md:p-8 flex-grow pb-32">
        <header className="relative flex items-center justify-between my-4">
          <Link href="/form/inspirations" passHref>
              <Button variant="outline" size="icon" className="rounded-full">
                  <ArrowLeft className="h-4 w-4"/>
              </Button>
          </Link>
          <div className="text-center">
              <p className="text-sm text-muted-foreground">1 of {nameResults.length}</p>
          </div>
          <Button variant="outline" className="rounded-full">
              <SlidersHorizontal className="mr-2 h-4 w-4"/>
              Filter
          </Button>
        </header>

        <main>
          {nameResults.length > 0 ? (
            <section className="mt-8">
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
                    <CarouselPrevious className="text-primary -left-4" />
                    <CarouselNext className="text-primary -right-4" />
                </Carousel>
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">Not feeling these names?</p>
                    <Link href="/form/personalize" passHref>
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Start Over
                        </Button>
                    </Link>
                </div>
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
        <div className="fixed bottom-4 right-4 z-50">
              <Sheet>
                  <SheetTrigger asChild>
                      <Button variant="secondary" className="rounded-full shadow-lg h-14 w-14 p-0">
                          <Bookmark className="h-6 w-6"/> 
                      </Button>
                  </SheetTrigger>
                  <SheetContent>
                      <SheetHeader>
                          <SheetTitle>Your Saved Names ({savedNames.length})</SheetTitle>
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
      </div>
    </div>
  );
}
