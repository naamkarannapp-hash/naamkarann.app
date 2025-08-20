
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
        <p className="font-headline text-4xl text-amber-300 font-bold transition-colors duration-500">
            {allNames[0]}
        </p>
      );
    }

    const isBaseWord = currentIndex === allNames.length;
    const nameToShow = isBaseWord ? baseWord : allNames[currentIndex];

    return (
        <div className="relative h-12 w-64 overflow-hidden">
            <div
                className="absolute left-0 top-0 w-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateY(-${currentIndex * 3}rem)` }}
            >
                {allNames.map((name) => (
                    <p key={name} className="font-headline text-4xl text-amber-300 font-bold h-12 flex items-center justify-center">
                        {name}
                    </p>
                ))}
                 <p key={baseWord} className="font-headline text-4xl text-white font-bold h-12 flex items-center justify-center">
                    {baseWord}
                </p>
            </div>
        </div>
    );
};


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground indian-gradient">
      <main className="flex-1 flex flex-col items-center text-center p-4 pt-8 md:pt-12 text-white">
          <h2 className="text-4xl font-bold">Naamkarann<sup className="text-sm">&trade;</sup></h2>
          <div className="relative my-4 md:my-6">
              <h1 className="font-headline text-5xl md:text-6xl font-bold leading-tight">
                  The perfect name <br /> awaits.
              </h1>
              <div className="absolute top-0 left-0 w-16 h-16 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob -z-10"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 -z-10"></div>
          </div>
          <p className="mt-2 text-base text-white/80 max-w-sm">
            Thousands of meaningful names, one swipe at a time.
          </p>
          
          <div className="my-8 flex flex-col items-center h-20">
              <AnimatedName />
              <p className="text-sm text-white/70 mt-1">Perfect baby names</p>
          </div>

          <div className="flex flex-col items-center w-full mt-16">
            <div className="flex items-center space-x-2 text-sm text-white/80 my-2 p-3 bg-white/10 rounded-lg border border-white/20">
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

            <div className="w-full max-w-md mt-8">
              <Link href="/form/personalize" passHref>
                <Button
                    className="w-full bg-white hover:bg-white/90 text-primary font-bold py-6 text-lg rounded-xl shadow-lg"
                >
                    Get Started
                </Button>
              </Link>
            </div>
          </div>
      </main>
      
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
