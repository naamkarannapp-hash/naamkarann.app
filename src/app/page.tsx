
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from 'next/link';

const namesByTradition = {
  "Hindu": [ "Aaranya", "Tejas", "Mandara", "Varnika", "Sarasangi", "Chandrakant", "Gitisha", "Nilay", "Dhruv", "Pushkar" ],
  "Muslim": [ "Zahara", "Noor", "Rayhan", "Muneera", "Samaa", "Asrar", "Qamar", "Naqsh", "Aydin", "Naghma" ],
  "Christian": [ "Eden", "Lucas", "Coralie", "Psalma", "Lucian", "Rosabel", "Verity", "Azure", "Gloria", "Clement" ],
  "Sikh": [ "Amrit", "Gurpreet", "Surinder", "Harnoor", "Ravdeep", "Sukhman", "Basanti", "Kirtan", "Nirmaljit", "Baghpreet" ],
  "Buddhist": [ "Lotusara", "Sujata", "Pema", "Dawa", "Sangita", "Bodhi", "Chandra", "Dhamma", "Saffron", "Anila" ],
  "Jain": [ "Shrut", "Prakrit", "Harita", "Sumitra", "Nirjin", "Chaitra", "Dhavala", "Shanti", "Ratnesh", "Sargam" ],
  "Jewish": [ "Talia", "Shira", "Orli", "Lev", "Keshet", "Ziv", "Dorit", "Erez", "Lior", "Yarden" ]
};

const allNames = Object.values(namesByTradition).flat();
const baseWord = "Naamkarann";

const AnimatedName = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (!hasMounted) return;

        const intervalId = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % (allNames.length + 1));
        }, 3000); 

        return () => clearInterval(intervalId);
    }, [hasMounted]);

    if (!hasMounted) {
      return (
        <p className="font-headline text-4xl text-white font-bold transition-colors duration-500" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            {allNames[0]}
        </p>
      );
    }
    
    const allDisplayNames = [...allNames, baseWord];

    return (
        <div className="relative h-12 w-64 overflow-hidden">
            <div
                className="absolute left-0 w-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateY(-${currentIndex * 3}rem)` }}
            >
                {allDisplayNames.map((name, index) => (
                    <p key={`${name}-${index}`} className="font-headline text-4xl text-white font-bold h-12 flex items-center justify-center" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                        {name}
                    </p>
                ))}
            </div>
        </div>
    );
};


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow flex flex-col items-center text-center text-white indian-gradient">
          <div className="flex-grow flex flex-col items-center justify-center p-4 pt-8 md:pt-12">
            <h2 className="text-4xl font-bold">Naamkarann<sup className="text-sm">&trade;</sup></h2>
            <div className="relative my-4 md:my-6">
                <h1 className="font-headline text-5xl md:text-6xl font-bold leading-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    The perfect baby name <br /> awaits.
                </h1>
                <div className="absolute top-0 left-0 w-16 h-16 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob -z-10"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 -z-10"></div>
            </div>
            <p className="mt-2 text-base text-white/80 max-w-sm">
              Thousands of meaningful baby names, one swipe at a time.
            </p>
            
            <div className="my-8 flex items-center justify-center">
                <AnimatedName />
            </div>

          </div>
           {/* Sticky CTA for Mobile */}
          <div className="sticky bottom-0 w-full md:static bg-gradient-to-t from-background via-background/80 to-transparent pt-4 pb-4 md:bg-none md:p-0">
             <div className="w-full max-w-md mx-auto px-4 md:px-0">
                <Link href="/form/personalize" passHref>
                    <Button
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg rounded-xl shadow-lg"
                    >
                        Start Naming
                    </Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-2">See your next favorite names—no signup needed.</p>
                <div className="flex items-center justify-center space-x-2 text-sm mt-2 p-3 bg-white/10 rounded-lg border border-white/20 text-muted-foreground">
                    <div className="flex items-center text-yellow-400" aria-label="4.8 out of 5 stars">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                    </div>
                    <span>4.8</span>
                    <span className="text-white/40" aria-hidden="true">•</span>
                    <span>2,300+ names chosen</span>
                    <span className="text-white/40" aria-hidden="true">•</span>
                    <span>Linguist-verified</span>
                </div>
            </div>
          </div>
      </main>
      
       <footer className="w-full p-4 text-center text-foreground bg-background flex-shrink-0">
        <div className="flex justify-center space-x-4 text-sm">
          <Link href="/legal/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link href="/legal/terms-of-service" className="hover:underline">Terms of Service</Link>
        </div>
      </footer>

       <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
            animation-delay: 2s;
        }
       `}</style>
    </div>
  );
}
