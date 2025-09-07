
"use client";

import * as React from 'react';
import { toPng } from 'html-to-image';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { NakshatraResult } from '@/lib/types';
import { Download, Repeat } from 'lucide-react';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { format } from 'date-fns';
import * as gtag from '@/lib/gtag';

interface NakshatraResultCardProps {
  result: NakshatraResult;
  onReset: () => void;
  dateOfBirth?: Date;
}

const backgroundGradients = [
    'linear-gradient(to top right, #6a11cb 0%, #2575fc 100%)',
    'linear-gradient(to top right, #ff4e50 0%, #f9d423 100%)',
    'linear-gradient(to top right, #00c6fb 0%, #005bea 100%)',
    'linear-gradient(to top right, #8e2de2 0%, #4a00e0 100%)',
    'linear-gradient(to top right, #02aab0 0%, #00cdac 100%)',
    'linear-gradient(to top right, #f857a6 0%, #ff5858 100%)'
];

const zodiacSymbols: { [key: string]: string } = {
    Aries: '♈',
    Taurus: '♉',
    Gemini: '♊',
    Cancer: '♋',
    Leo: '♌',
    Virgo: '♍',
    Libra: '♎',
    Scorpio: '♏',
    Sagittarius: '♐',
    Capricorn: '♑',
    Aquarius: '♒',
    Pisces: '♓',
};

function formatRashi(rashi: string) {
    if (rashi.includes('/')) {
        const parts = rashi.split('/');
        const sanskritName = parts[0];
        const englishName = parts[1];
        const symbol = zodiacSymbols[englishName] || '';
        return `${sanskritName} (${englishName}) ${symbol}`;
    }
    return rashi;
}

export function NakshatraResultCard({ result, onReset, dateOfBirth }: NakshatraResultCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [gradient, setGradient] = React.useState('');

  React.useEffect(() => {
    setGradient(backgroundGradients[Math.floor(Math.random() * backgroundGradients.length)]);
  }, []);

  const handleDownload = React.useCallback(() => {
    if (cardRef.current === null) {
      return;
    }
    
    gtag.event({
        action: 'click',
        category: 'nakshatra',
        label: 'Download Card',
    });

    toPng(cardRef.current, { cacheBust: true, pixelRatio: 4 })
      .then((dataUrl) => {
        const now = new Date();
        const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
        const link = document.createElement('a');
        link.download = `nakshatra-rashi-details_${timestamp}.png`;
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
            {dateOfBirth && (
                <p className="text-xs text-white/70 text-center mb-6 z-10">
                    Calculated for: {format(dateOfBirth, "PPP")}
                </p>
            )}
            <CardContent className="flex-grow flex flex-col justify-center items-center text-center z-10 space-y-6 p-0">
                <div>
                    <p className="text-sm uppercase tracking-widest opacity-80">Nakshatra (Birth Star)</p>
                    <p className="text-4xl font-bold">{result.nakshatra}</p>
                    <p className="text-xs text-white/70 max-w-xs mt-1">One of 27 Vedic lunar constellations which determines the starting sound for a name.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 w-full text-center">
                    <div>
                        <p className="text-sm uppercase tracking-widest opacity-80">Pada</p>
                        <p className="text-2xl font-bold">{result.pada}</p>
                        <p className="text-xs text-white/70">A quarter section within the Nakshatra.</p>
                    </div>
                     <div>
                        <p className="text-sm uppercase tracking-widest opacity-80">Syllable</p>
                        <Badge variant="secondary" className="text-2xl font-bold px-4 py-1 h-auto bg-white/20 text-white border-none">{result.syllable}</Badge>
                        <p className="text-xs text-white/70 mt-1">The sound your baby's name should start with.</p>
                    </div>
                </div>

                <Separator className="my-6 bg-white/20" />

                <div>
                    <p className="text-sm uppercase tracking-widest opacity-80">Rashi (Moon Sign)</p>
                    <p className="text-3xl font-semibold">{formatRashi(result.rashi)}</p>
                    <p className="text-xs text-white/70 max-w-xs mt-1">The zodiac sign where the Moon was at the time of birth, influencing personality and compatibility.</p>
                </div>
            </CardContent>

            <CardFooter className="flex-col pt-8 pb-0 px-0 items-center justify-center space-y-3 z-10">
                 <Badge className="bg-black/10 text-white/80 border-none">Powered by Naamkarann.in</Badge>
                 <p className="text-[10px] text-white/60 text-center max-w-sm">
                    Note: Information generated by Naamkarann.in is AI generated. For ceremonial use, please consult an astrologer.
                </p>
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
