
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/app-state-context";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { NameCard } from "@/components/name-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bookmark, X, ArrowLeft } from "lucide-react";
import type { NameResult } from "@/lib/types";
import { LoadingSpinner } from "@/components/loading-spinner";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { getAndPrioritizeNames } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export default function ResultsPage() {
  const { state, setState } = useAppState();
  const { isLoading, nameResults, savedNames, formValues } = state;
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const hasFetched = React.useRef(false);

  React.useEffect(() => {
    // Only fetch names if we are in the loading state, have no results yet, and haven't already fetched.
    if (isLoading && nameResults.length === 0 && !hasFetched.current) {
      hasFetched.current = true;
      const fetchNames = async () => {
        const result = await getAndPrioritizeNames(formValues);

        if ("error" in result) {
          toast({
            variant: "destructive",
            title: "An error occurred",
            description: result.error,
          });
          setState({ isLoading: false, nameResults: [], error: result.error });
          // Go back to the form if there was an error
          router.back();
        } else {
          setState({ nameResults: result.names, isLoading: false, error: null });
        }
      };

      fetchNames();
    }
  }, [isLoading, nameResults.length, formValues, setState, toast, router]);

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api, nameResults]);


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
    <div className="flex flex-col min-h-screen bg-background text-foreground pattern-background">
      <div className="container mx-auto p-4 md:p-8 flex-grow">
        <header className="relative flex items-center justify-center my-4 h-10">
          <div className="text-center absolute left-1/2 -translate-x-1/2">
              {nameResults.length > 0 && (
                <p className="text-sm text-muted-foreground">{current} of {count}</p>
              )}
          </div>
          <div className="w-10"></div>
        </header>

        <main className="flex-grow flex flex-col justify-center">
          {nameResults.length > 0 ? (
            <section className="mt-8">
                <Carousel className="w-full max-w-md mx-auto" opts={{ loop: true }} setApi={setApi}>
                    <CarouselContent>
                        {nameResults.map((name) => (
                        <CarouselItem key={name.id}>
                            <div className="p-1">
                              <NameCard name={name} onSave={handleSaveName} isSaved={isNameSaved(name.id)} />
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="text-primary -left-2 md:-left-4 bg-background/50 border-primary" />
                    <CarouselNext className="text-primary -right-2 md:-right-4 bg-background/50 border-primary" />
                </Carousel>
                <div className="mt-6 text-center">
                     <p className="text-xs text-muted-foreground">Swipe left or right to see more names</p>
                </div>
                <div className="mt-8 text-center">
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
                          <Bookmark className={cn("h-6 w-6", savedNames.length > 0 && "text-primary fill-primary/20")} />
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
