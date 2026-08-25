"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/app-state-context";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { NameCard } from "@/components/name-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Download, Copy, Check, SlidersHorizontal, RefreshCw } from "lucide-react";
import Link from 'next/link';
import { getAndPrioritizeNames } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/loading-spinner";
import { toPng } from 'html-to-image';
import * as gtag from '@/lib/gtag';

export default function ResultsPage() {
  const { state, setState } = useAppState();
  const { isLoading, nameResults, formValues, error } = state;
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
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
      setCopied(false);
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
    
    gtag.event({
      action: 'download_card',
      category: 'engagement',
      label: currentName,
    });

    toPng(cardRef, { cacheBust: true, pixelRatio: 3 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `naamkarann_${currentName.toLowerCase()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Download error:', err);
        toast({
            title: "Error",
            description: "Could not download the image. Please try again.",
            variant: "destructive"
        });
      });
  }, [api, nameResults, toast]);

  const handleCopy = React.useCallback(() => {
    const cardIndex = api?.selectedScrollSnap();
    if (cardIndex === undefined) return;
    const currentItem = nameResults[cardIndex];
    if (!currentItem) return;

    const copyText = `${currentItem.name} (${currentItem.origin}) — "${currentItem.meaning}" — via Naamkarann.app`;
    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      toast({
        title: `Copied "${currentItem.name}"!`,
        description: "Name details copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    });
  }, [api, nameResults, toast]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pattern-background relative overflow-hidden">
      {/* Ambient glowing radial backgrounds */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-200/35 via-purple-200/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      
      <div className="container mx-auto px-4 py-6 md:py-8 flex-grow pb-32 flex flex-col justify-between max-w-xl">
        
        {/* Top Header Bar */}
        <header className="flex items-center justify-between mb-4">
          <Link href="/" className="group flex items-center gap-1">
            <h2 className="text-xl font-extrabold tracking-tight text-primary">
              Naamkarann<span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider ml-0.5">app</span>
            </h2>
          </Link>

          <Link href="/form/inspirations">
            <Button variant="ghost" size="sm" className="text-xs font-semibold text-muted-foreground hover:text-foreground rounded-xl h-8 px-2.5">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1" /> Edit Filters
            </Button>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center my-auto">
            {error ? (
                <div className="text-center my-16 flex flex-col items-center bg-white/90 dark:bg-card/90 backdrop-blur-md p-8 rounded-3xl border border-destructive/20 shadow-xl max-w-md">
                    <Users className="w-12 h-12 mb-3 text-destructive opacity-70" />
                    <h3 className="text-lg font-bold text-foreground">Service High Traffic</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{error}</p>
                    <Link href="/form/personalize" className="mt-4">
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Try Again
                      </Button>
                    </Link>
                </div>
            ) : nameResults.length > 0 ? (
              <div className="w-full flex flex-col items-center space-y-4">
                
                {/* Progress Pill Bar */}
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-white/80 dark:bg-card/80 backdrop-blur-md px-3 py-1 rounded-full border border-border/60 shadow-sm">
                  <span>Name {current} of {count}</span>
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${(current / count) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Carousel Container */}
                <div className="w-full relative px-2">
                  <Carousel className="w-full max-w-sm sm:max-w-md mx-auto" opts={{ loop: true }} setApi={setApi}>
                      <CarouselContent className="-ml-2">
                          {nameResults.map((name, index) => (
                            <CarouselItem key={name.id} className="pl-2 basis-full">
                              <NameCard 
                                  ref={el => { cardRefs.current[index] = el; }}
                                  name={name} 
                              />
                            </CarouselItem>
                          ))}
                      </CarouselContent>

                      {/* Smooth Frosted Navigation Arrows */}
                      <CarouselPrevious className="hidden sm:flex -left-4 bg-white/90 dark:bg-card/90 hover:bg-white text-foreground border border-border/80 shadow-lg w-10 h-10 transition-transform active:scale-95" />
                      <CarouselNext className="hidden sm:flex -right-4 bg-white/90 dark:bg-card/90 hover:bg-white text-foreground border border-border/80 shadow-lg w-10 h-10 transition-transform active:scale-95" />
                  </Carousel>
                </div>

                {/* Micro Action Buttons */}
                <div className="flex flex-col items-center gap-2.5 pt-2">
                     <div className="flex items-center gap-2">
                       <Button 
                          onClick={handleDownload} 
                          variant="outline" 
                          size="sm"
                          className="bg-white/80 dark:bg-card/80 hover:bg-white text-xs font-semibold rounded-xl border border-border/80 shadow-sm h-9 px-3.5"
                       >
                            <Download className="mr-1.5 h-3.5 w-3.5 text-primary" />
                            Download Card
                       </Button>

                       <Button 
                          onClick={handleCopy} 
                          variant="outline" 
                          size="sm"
                          className="bg-white/80 dark:bg-card/80 hover:bg-white text-xs font-semibold rounded-xl border border-border/80 shadow-sm h-9 px-3.5"
                       >
                            {copied ? (
                              <>
                                <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                                Copy Name
                              </>
                            )}
                       </Button>
                     </div>

                     <p className="text-[11px] text-muted-foreground">Swipe or tap arrows to browse all {nameResults.length} curated names</p>
                </div>
              </div>
            ) : (
                <div className="text-center my-16 bg-white/90 dark:bg-card/90 p-8 rounded-3xl border shadow-xl max-w-md">
                    <h2 className="font-headline text-2xl font-bold text-destructive">No Names Found</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Try broadening starting letters or cultural vibes!</p>
                    <Link href="/form/personalize" className="mt-4 inline-block">
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Tweak Filters
                      </Button>
                    </Link>
                </div>
            )}
        </main>
      </div>

      {/* Frosted Glass Bottom Navigation Bar */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-card/90 backdrop-blur-md border-t border-border/60 py-3 px-4 z-40 shadow-lg">
           <div className="w-full max-w-xl mx-auto flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Want different suggestions?</span>
              <Link href="/form/personalize" passHref>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-semibold px-3 h-9 rounded-xl text-xs">
                      <ArrowLeft className="mr-1.5 h-3.5 w-3.5"/>
                      Start Over
                  </Button>
              </Link>
           </div>
      </footer>
    </div>
  );
}
