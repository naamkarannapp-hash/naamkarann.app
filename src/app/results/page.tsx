
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/app-state-context";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { NameCard } from "@/components/name-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Download } from "lucide-react";
import Link from 'next/link';
import { getAndPrioritizeNames } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/loading-spinner";
import { toPng } from 'html-to-image';

export default function ResultsPage() {
  const { state, setState } = useAppState();
  const { isLoading, nameResults, formValues, error } = state;
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const hasFetched = React.useRef(false);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    if (isLoading && nameResults.length === 0 && !hasFetched.current) {
      hasFetched.current = true;
      const fetchNames = async () => {
        const result = await getAndPrioritizeNames(formValues);

        if ("error" in result) {
          setState({ isLoading: false, nameResults: [], error: "Sorry, Naamkarann is experiencing a lot of traffic right now. Thank you for your patience—please try again in a few minutes." });
        } else {
          setState({ nameResults: result.names, isLoading: false, error: null });
        }
      };
      fetchNames();
    }
  }, [isLoading, nameResults.length, formValues, setState, toast, router]);
  
  React.useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, nameResults.length);
  }, [nameResults]);

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

  const handleDownload = React.useCallback(() => {
    const cardIndex = api?.selectedScrollSnap();
    if (cardIndex === undefined) return;
    
    const cardRef = cardRefs.current[cardIndex];
    const currentName = nameResults[cardIndex]?.name;

    if (cardRef === null || !currentName) {
      return;
    }

    toPng(cardRef, { cacheBust: true, pixelRatio: 4 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `naamkarann_${currentName.toLowerCase()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
        toast({
            title: "Error",
            description: "Could not download the image. Please try again.",
            variant: "destructive"
        })
      });
  }, [api, nameResults, toast]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pattern-background">
      <main className="flex-grow flex flex-col justify-center container mx-auto px-4 md:px-8 pb-32">
          {error ? (
              <div className="text-center my-20 flex flex-col items-center">
                  <Users className="w-16 h-16 mb-4 text-primary opacity-50" />
                  <p className="mt-4 text-lg text-foreground/80 max-w-sm mx-auto">{error}</p>
              </div>
          ) : nameResults.length > 0 ? (
            <>
              <div className="w-full max-w-md mx-auto space-y-2 mb-4">
                  <p className="text-center text-xs text-muted-foreground">{current} of {count}</p>
                  <Progress value={(current / count) * 100} className="h-1" />
              </div>
              <Carousel className="w-full max-w-md mx-auto" opts={{ loop: true }} setApi={setApi}>
                  <CarouselContent>
                      {nameResults.map((name, index) => (
                      <CarouselItem key={name.id} className="pl-2 basis-full">
                        <NameCard 
                            ref={el => cardRefs.current[index] = el}
                            name={name} 
                        />
                      </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious className="text-primary -left-2 md:-left-4 bg-background/50 border-primary" />
                  <CarouselNext className="text-primary -right-2 md:-right-4 bg-background/50 border-primary" />
              </Carousel>
              <div className="mt-6 text-center flex flex-col items-center gap-4">
                   <p className="text-xs text-muted-foreground">Swipe to browse names</p>
                   <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Card
                   </Button>
              </div>
            </>
          ) : (
              <div className="text-center my-20">
                  <h2 className="font-headline text-3xl font-bold text-destructive">No Names Found</h2>
                  <p className="mt-4 text-lg text-foreground/80 max-w-sm mx-auto">Not finding your vibe? Try tweaking preferences!</p>
              </div>
          )}
      </main>

      {nameResults.length > 0 && !error ? (
           <footer className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-sm border-t border-border/20 p-4 z-40">
                <div className="w-full max-w-md mx-auto text-center">
                    <p className="text-muted-foreground text-sm mb-2">Want different names?</p>
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
