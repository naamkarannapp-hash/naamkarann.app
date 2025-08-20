
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
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
    const [displayedName, setDisplayedName] = useState(baseWord.split(''));
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (!hasMounted) return;

        let nameIndex = 0;
        let intervalId: NodeJS.Timeout;

        const animate = () => {
            const targetName = allNames[nameIndex % allNames.length];
            const maxLength = Math.max(baseWord.length, targetName.length);
            let currentChars = baseWord.split('');

            // Transition to target name
            for (let i = 0; i < maxLength; i++) {
                setTimeout(() => {
                    if (i < targetName.length) {
                        currentChars[i] = targetName[i];
                    } else {
                        currentChars[i] = ' '; // Use space for empty char
                    }
                    setDisplayedName([...currentChars.slice(0, targetName.length)]);
                }, i * 100);
            }
            
            // Hold the name for a bit
            setTimeout(() => {
                // Transition back to base word
                for (let i = 0; i < baseWord.length; i++) {
                    setTimeout(() => {
                       currentChars[i] = baseWord[i];
                       if (i >= targetName.length) {
                         currentChars[i] = baseWord[i];
                       }
                       setDisplayedName([...currentChars.slice(0, baseWord.length)]);
                    }, i * 100);
                }
            }, targetName.length * 100 + 2000);

            nameIndex++;
        };
        
        // Initial animation
        setTimeout(animate, 1000);
        // Subsequent animations
        intervalId = setInterval(animate, baseWord.length * 100 + 3000);


        return () => clearInterval(intervalId);
    }, [hasMounted]);

    const isBaseWord = displayedName.join('') === baseWord;

    if (!hasMounted) {
      return (
        <p className="font-headline text-4xl text-primary font-bold transition-colors duration-500">
            {baseWord}
        </p>
      );
    }

    return (
        <p className={cn(
            "font-headline text-4xl font-bold transition-colors duration-500",
            isBaseWord ? 'text-white' : 'text-amber-300'
          )} 
          aria-live="polite"
        >
            {displayedName.map((char, index) => (
                <span key={index} className="inline-block animate-flip-in">
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </p>
    );
};


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground indian-gradient">
      <main className="flex-1 flex flex-col items-center text-center p-4 pt-8 md:pt-12 text-white">
          <h2 className="text-xl font-bold">Naamkarann</h2>
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
        @keyframes flip-in {
            0% {
                transform: rotateX(90deg);
                opacity: 0;
            }
            100% {
                transform: rotateX(0deg);
                opacity: 1;
            }
        }
        .animate-flip-in {
            animation: flip-in 0.5s ease-out;
        }
       `}</style>
    </div>
  );
}
