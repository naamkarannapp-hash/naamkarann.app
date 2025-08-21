
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/app-state-context";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
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
import { Progress } from "@/components/ui/progress";

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
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
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

      <main className="flex-grow flex flex-col justify-center container mx-auto px-4 md:px-8 pb-32">
          {nameResults.length > 0 ? (
            <>
              <div className="w-full max-w-md mx-auto space-y-2 mb-4">
                  <p className="text-center text-xs text-muted-foreground">{current} of {count}</p>
                  <Progress value={(current / count) * 100} className="h-1" />
              </div>
              <Carousel className="w-full max-w-md mx-auto" opts={{ loop: true }} setApi={setApi}>
                  <CarouselContent>
                      {nameResults.map((name) => (
                      <CarouselItem key={name.id}>
                          <div className="p-1">
                            <NameCard name={name} />
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
            </>
          ) : (
              <div className="text-center my-20">
                  <h2 className="font-headline text-3xl font-bold text-destructive">No Names Found</h2>
                  <p className="mt-4 text-lg text-foreground/80 max-w-sm mx-auto">We couldn't find any names matching your criteria. Not finding your vibe? Try tweaking preferences!</p>
              </div>
          )}
      </main>

      {nameResults.length > 0 ? (
           <footer className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-sm border-t border-border/20 p-4 z-40">
                <div className="w-full max-w-md mx-auto text-center">
                    <p className="text-muted-foreground text-sm mb-2">Not feeling these names?</p>
                    <Link href="/form/personalize" passHref>
                        <Button variant="outline" className="font-bold">
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Start Over
                        </Button>
                    </Link>
                </div>
           </footer>
       ) : (
            <footer className="fixed bottom-0 left-0 w-full bg-background border-t border-border/20 p-4 z-40">
                 <div className="w-full max-w-md mx-auto text-center">
                    <Link href="/form/personalize" passHref>
                        <Button className="font-bold">
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Start Over
                        </Button>
                    </Link>
                </div>
            </footer>
       )}
    </div>
  );
}
