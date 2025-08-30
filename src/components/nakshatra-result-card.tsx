
"use client";

import * as React from 'react';
import { toPng } from 'html-to-image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { NakshatraResult } from '@/lib/types';
import { Download, Repeat } from 'lucide-react';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

interface NakshatraResultCardProps {
  result: NakshatraResult;
  onReset: () => void;
}

const backgroundGradients = [
    'linear-gradient(to top right, #6a11cb 0%, #2575fc 100%)',
    'linear-gradient(to top right, #ff4e50 0%, #f9d423 100%)',
    'linear-gradient(to top right, #00c6fb 0%, #005bea 100%)',
    'linear-gradient(to top right, #8e2de2 0%, #4a00e0 100%)',
    'linear-gradient(to top right, #02aab0 0%, #00cdac 100%)',
    'linear-gradient(to top right, #f857a6 0%, #ff5858 100%)'
];

export function NakshatraResultCard({ result, onReset }: NakshatraResultCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [gradient, setGradient] = React.useState('');

  React.useEffect(() => {
    // Pick a random gradient on component mount
    setGradient(backgroundGradients[Math.floor(Math.random() * backgroundGradients.length)]);
  }, []);

  const handleDownload = React.useCallback(() => {
    if (cardRef.current === null) {
      return;
    }

    toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'nakshatra-rashi-details.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
      });
  }, [cardRef]);

  return (
    <div className="w-full max-w-md mx-auto">
        <Card
          ref={cardRef}
          className="w-full h-auto rounded-3xl shadow-2xl flex flex-col p-8 text-white relative overflow-hidden"
          style={{ background: gradient || 'linear-gradient(to top right, #1A52E1, #9C27B0)' }}
        >
            <div className="flex-grow flex flex-col justify-center items-center text-center z-10">
                <div className="space-y-6">
                    <div>
                        <p className="text-sm uppercase tracking-widest opacity-80">Nakshatra (Birth Star)</p>
                        <p className="text-4xl font-bold">{result.nakshatra}</p>
                    </div>
                     <div>
                        <p className="text-sm uppercase tracking-widest opacity-80">Rashi (Moon Sign)</p>
                        <p className="text-3xl font-semibold">{result.rashi}</p>
                    </div>
                </div>

                <Separator className="my-8 bg-white/20" />

                <div className="grid grid-cols-2 gap-4 w-full text-center">
                    <div>
                        <p className="text-sm uppercase tracking-widest opacity-80">Pada</p>
                        <p className="text-2xl font-bold">{result.pada}</p>
                    </div>
                     <div>
                        <p className="text-sm uppercase tracking-widest opacity-80">Syllable</p>
                        <p className="text-2xl font-bold">{result.syllable}</p>
                    </div>
                </div>
            </div>
            <CardFooter className="flex-col pt-8 pb-0 px-0 items-center justify-center">
                <Badge className="bg-black/10 text-white/80 border-none">Powered by Naamkarann.com</Badge>
            </CardFooter>
        </Card>

         <div className="mt-6 flex justify-center gap-4">
            <Button onClick={handleDownload} variant="default" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Download
            </Button>
            <Button onClick={onReset} variant="outline" size="lg">
                <Repeat className="mr-2 h-4 w-4" />
                Check Again
            </Button>
        </div>
    </div>
  );
}
