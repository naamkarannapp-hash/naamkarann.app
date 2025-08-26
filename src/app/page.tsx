
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from 'next/link';
import { namesByTradition } from '@/lib/name-data';
import { motion, AnimatePresence } from "framer-motion";

const baseWord = "Naamkarann";

const AnimatedName = () => {
    const [displayNames, setDisplayNames] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        
        const traditions = Object.values(namesByTradition);
        const randomized = traditions.map(names => names[Math.floor(Math.random() * names.length)]);
        
        for (let i = randomized.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [randomized[i], randomized[j]] = [randomized[j], randomized[i]];
        }
        
        setDisplayNames([...randomized, baseWord]);
    }, []);

    useEffect(() => {
        if (!hasMounted || displayNames.length <= 1) return;

        const intervalId = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % displayNames.length);
        }, 3000); 

        return () => clearInterval(intervalId);
    }, [hasMounted, displayNames]);

    if (!hasMounted) {
      return (
        <p className="font-headline text-4xl text-purple-400/80 transition-colors duration-500" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            Naamkarann
        </p>
      );
    }
    
    const currentName = displayNames[currentIndex] || baseWord;

    return (
        <div className="relative h-12 w-64 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.p
                    key={currentName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 font-headline text-4xl text-purple-400/80 h-12 flex items-center justify-center"
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                >
                    {currentName}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow flex flex-col items-center text-center pattern-background">
          <div className="flex-grow flex flex-col items-center justify-center p-4">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-bold pb-8 text-primary"
            >
              Naamkarann
            </motion.h2>
            <div className="my-4 h-px w-24 bg-foreground/20" />
            <div className="relative">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  className="font-headline text-5xl md:text-6xl font-bold leading-tight text-foreground" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                >
                    The perfect baby name awaits.
                </motion.h1>
                <div className="absolute top-0 left-0 w-16 h-16 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob -z-10"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 -z-10"></div>
            </div>
            <p className="mt-2 text-base text-foreground/70 max-w-sm">
              Thousands of meaningful baby names, one swipe at a time.
            </p>
            
            <div className="my-6 pt-16 flex items-center justify-center">
                <AnimatedName />
            </div>

          </div>
           {/* Sticky CTA for Mobile */}
          <div className="sticky bottom-0 w-full md:static bg-gradient-to-t from-background via-background/80 to-transparent pt-4 pb-4 md:bg-none md:p-0">
             <div className="w-full max-w-md mx-auto px-4 md:px-0">
                <Link href="/form/personalize" passHref>
                    <Button
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg rounded-xl shadow-lg transition-shadow hover:shadow-2xl"
                    >
                        Start Naming
                    </Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-2">See your next favorite names—no signup needed.</p>
                <div className="flex items-center justify-center space-x-2 text-sm mt-2 p-3 bg-muted rounded-lg border">
                    <div className="flex items-center text-yellow-400" aria-label="4.8 out of 5 stars">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-foreground/80"><strong className="font-semibold">4.8</strong></span>
                    <span className="text-foreground/40" aria-hidden="true">•</span>
                    <span className="text-foreground/70"><strong className="font-semibold">1000+</strong> names chosen</span>
                    <span className="text-foreground/40" aria-hidden="true">•</span>
                    <span className="text-foreground/70">Linguist-verified</span>
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
