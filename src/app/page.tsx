"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Star, Sparkles, Compass, ShieldCheck } from "lucide-react";
import Link from 'next/link';
import { curatedNamesDatabase } from '@/lib/curated-names';
import { motion, AnimatePresence } from "framer-motion";
import * as gtag from '@/lib/gtag';

const AUTOPLAY_DURATION = 6000; // 6 seconds per name
const TICK_INTERVAL = 50; // 50ms tick for fluid dial

const LiveNameCardPreview = () => {
    const [names, setNames] = useState(curatedNamesDatabase);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasMounted, setHasMounted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    const progressRef = useRef(0);

    useEffect(() => {
        setHasMounted(true);
        // Randomize initial collection on load for diverse discovery
        const shuffled = [...curatedNamesDatabase].sort(() => 0.5 - Math.random());
        setNames(shuffled);
    }, []);

    // Smooth circular countdown
    useEffect(() => {
        if (!hasMounted || names.length === 0) return;

        const interval = setInterval(() => {
            if (!isPaused) {
                progressRef.current += (TICK_INTERVAL / AUTOPLAY_DURATION) * 100;
                if (progressRef.current >= 100) {
                    progressRef.current = 0;
                    setCurrentIndex(prev => (prev + 1) % names.length);
                }
                setProgress(progressRef.current);
            }
        }, TICK_INTERVAL);

        return () => clearInterval(interval);
    }, [hasMounted, isPaused, names.length]);

    const handleNext = () => {
        progressRef.current = 0;
        setProgress(0);
        setCurrentIndex(prev => (prev + 1) % names.length);
    };

    const item = names[currentIndex] || curatedNamesDatabase[0];

    // Circle perimeter: 2 * Math.PI * 7 ≈ 43.98
    const circlePerimeter = 43.98;
    const strokeOffset = circlePerimeter - (circlePerimeter * progress) / 100;

    if (!hasMounted) {
        return (
            <div className="w-full max-w-sm sm:max-w-md h-[220px] rounded-3xl bg-gradient-to-tr from-[#1A52E1] to-[#9C27B0] p-5 shadow-xl text-white flex flex-col justify-between" />
        );
    }

    const genderEmoji = item.gender === 'boy' ? '👦' : item.gender === 'girl' ? '👧' : '✨';

    return (
        <div className="w-full max-w-sm sm:max-w-md mx-auto mb-8">
            <div 
                className="relative group cursor-pointer select-none"
                onClick={handleNext}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                title="Tap to see next name (Pauses on hover)"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.97 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="w-full h-[220px] sm:h-[230px] rounded-3xl shadow-2xl flex flex-col justify-between p-5 text-white relative overflow-hidden transition-all group-hover:scale-[1.01] group-hover:shadow-primary/30"
                        style={{
                            background: item.gradient || 'linear-gradient(135deg, #1A52E1 0%, #9C27B0 100%)',
                        }}
                    >
                        {/* Top Meta Bar: Radial Timer + Gender in Top Right */}
                        <div className="flex items-center justify-between text-xs text-white/90 z-10">
                            {/* Radial Countdown Indicator */}
                            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium tracking-wide">
                                <svg className="w-3.5 h-3.5 -rotate-90 shrink-0" viewBox="0 0 18 18">
                                    <circle 
                                        cx="9" 
                                        cy="9" 
                                        r="7" 
                                        fill="none" 
                                        stroke="rgba(255,255,255,0.25)" 
                                        strokeWidth="2.5" 
                                    />
                                    <circle 
                                        cx="9" 
                                        cy="9" 
                                        r="7" 
                                        fill="none" 
                                        stroke={isPaused ? "#fde047" : "#ffffff"} 
                                        strokeWidth="2.5" 
                                        strokeDasharray={circlePerimeter}
                                        strokeDashoffset={strokeOffset}
                                        strokeLinecap="round"
                                        className="transition-all duration-75"
                                    />
                                </svg>
                                <span>{isPaused ? "Paused" : "Live Preview"}</span>
                            </div>

                            {/* Gender Pill in Top Right */}
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold capitalize text-white tracking-wide border border-white/20 shadow-sm flex items-center gap-1">
                                <span>{genderEmoji}</span>
                                <span>{item.gender}</span>
                            </span>
                        </div>

                        {/* Name, Pronunciation & Meaning */}
                        <div className="flex flex-col items-center justify-center text-center z-10 my-auto">
                            <h3 
                                className="font-headline text-3xl sm:text-4xl font-extrabold tracking-tight text-white" 
                                style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}
                            >
                                {item.name}
                            </h3>
                            <p 
                                className="text-xs sm:text-sm italic text-white/85 mt-0.5" 
                                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                            >
                                {item.pronunciation}
                            </p>
                            <p 
                                className="text-xs sm:text-sm text-white/95 mt-2 line-clamp-2 max-w-xs mx-auto leading-snug" 
                                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                            >
                                "{item.meaning}"
                            </p>
                        </div>

                        {/* Bottom Tags & Story Dots */}
                        <div className="flex items-center justify-between z-10 pt-2 border-t border-white/15">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[11px] bg-black/25 backdrop-blur-md px-2 py-0.5 rounded-md font-medium text-white/90">
                                    {item.origin}
                                </span>
                                <span className="text-[11px] bg-black/25 backdrop-blur-md px-2 py-0.5 rounded-md font-medium text-white/90">
                                    {item.category}
                                </span>
                            </div>

                            {/* Story-style Progress Dots */}
                            <div className="flex items-center gap-1">
                                {names.slice(0, 6).map((_, i) => {
                                    const isActive = (currentIndex % 6) === i;
                                    return (
                                        <span 
                                            key={i} 
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                isActive ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/40'
                                            }`} 
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
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
            <div className="relative mb-3">
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
            
            {/* Interactive Live Card Preview with Radial Timer & Top-Right Gender */}
            <LiveNameCardPreview />

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
