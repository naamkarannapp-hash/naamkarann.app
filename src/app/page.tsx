"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Star, Sparkles, Compass, ShieldCheck, Heart } from "lucide-react";
import Link from 'next/link';
import { namesByTradition } from '@/lib/name-data';
import { motion, AnimatePresence } from "framer-motion";
import * as gtag from '@/lib/gtag';

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
        }, 2800); 

        return () => clearInterval(intervalId);
    }, [hasMounted, displayNames]);

    if (!hasMounted) {
        return (
            <span className="font-headline text-3xl sm:text-4xl font-bold text-accent">
                Naamkarann
            </span>
        );
    }
    
    const currentName = displayNames[currentIndex] || baseWord;

    return (
        <div className="relative h-12 w-56 sm:w-64 overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.span
                    key={currentName}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute font-headline text-3xl sm:text-4xl font-bold text-accent tracking-wide"
                >
                    {currentName}
                </motion.span>
            </AnimatePresence>
        </div>
    );
};

export default function Home() {
  const handleStartNamingClick = () => {
    gtag.event({
        action: 'click',
        category: 'navigation',
        label: 'Start Naming - Hero',
    });
  };

  const handleCheckNakshatraClick = () => {
    gtag.event({
        action: 'click',
        category: 'navigation',
        label: 'Check Nakshatra - Hero',
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Ambient background glow effects */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-blue-200/35 via-purple-200/25 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-gradient-to-br from-purple-200/20 via-blue-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <main className="flex-grow flex flex-col items-center justify-center text-center pattern-background px-4 py-8 sm:py-12">
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center">
            
            {/* Logo & Product Hunt Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-3 mb-6"
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary flex items-center gap-1.5">
                Naamkarann<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-0.5">app</span>
              </h2>

              <div className="scale-90 hover:scale-95 transition-transform">
                <a 
                  href="https://www.producthunt.com/products/naamkarann?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-naamkarann" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <img 
                    src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1009980&theme=light&t=1756293005883" 
                    alt="Naamkarann - AI Baby Name Generator | Product Hunt" 
                    style={{ width: '210px', height: '46px' }} 
                    width="210" 
                    height="46" 
                  />
                </a>
              </div>
            </motion.div>

            {/* Hero Main Heading */}
            <div className="relative mb-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                  className="font-headline text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]"
                >
                  The perfect baby name <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">awaits.</span>
                </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-base sm:text-lg text-foreground/75 max-w-md mx-auto leading-relaxed mb-6"
            >
              Thousands of culturally authentic, linguist-verified baby names tailored to your heritage and vibe.
            </motion.p>
            
            {/* Interactive Animated Name Capsule Showcase */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="w-full max-w-md bg-white/90 dark:bg-card/90 backdrop-blur-md rounded-2xl border border-primary/15 shadow-xl shadow-primary/5 p-4 sm:p-5 mb-8 flex flex-col items-center justify-center transition-all hover:border-primary/25 hover:shadow-2xl hover:shadow-primary/10"
            >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                  <span>Explore names like</span>
                </div>
                
                <AnimatedName />
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>One swipe at a time • Instant meanings & origins</span>
                </div>
            </motion.div>

            {/* Call to Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="w-full max-w-md space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/form/personalize" passHref className="w-full">
                  <Button
                    onClick={handleStartNamingClick}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-base rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all group"
                  >
                    <Sparkles className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                    Start Naming
                  </Button>
                </Link>
                
                <Link href="/check-nakshatra-rashi" passHref className="w-full">
                  <Button
                    onClick={handleCheckNakshatraClick}
                    size="lg"
                    variant="outline"
                    className="w-full border-primary/30 bg-background/80 hover:bg-primary/5 text-primary font-bold py-6 text-base rounded-xl shadow-sm hover:shadow transition-all"
                  >
                    <Compass className="mr-2 h-4 w-4" />
                    Check Nakshatra
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-muted-foreground">
                100% free • No signup required
              </p>

              {/* Social Proof Rating Card */}
              <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm px-4 py-2.5 bg-white/75 dark:bg-card/75 backdrop-blur-md rounded-full border border-border/60 shadow-sm text-foreground/80 mt-2">
                <div className="flex items-center text-amber-400 gap-0.5" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-foreground">4.8</span>
                <span className="text-foreground/30">•</span>
                <span><strong>1,000+</strong> names chosen</span>
                <span className="text-foreground/30">•</span>
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </motion.div>

          </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground bg-background border-t border-border/40 flex-shrink-0">
        <div className="flex justify-center space-x-6">
          <Link href="/legal/about-us" className="hover:text-foreground transition-colors">About Us</Link>
          <Link href="/legal/contact-us" className="hover:text-foreground transition-colors">Contact Us</Link>
          <Link href="/legal/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/legal/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
