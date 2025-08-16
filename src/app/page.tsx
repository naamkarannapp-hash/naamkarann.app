
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';

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

const categories = ["Baby", "Startup", "Product", "Social", "Group"];

export default function Home() {
  const [currentName, setCurrentName] = useState("Gitisha");
  const [selectedCategory, setSelectedCategory] = useState("Baby");
  const router = useRouter();
  const isBabySelected = selectedCategory === "Baby";

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const intervalId = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * allNames.length);
        setCurrentName(allNames[randomIndex]);
      }, 300); // Change name every 0.3 seconds

      return () => clearInterval(intervalId); // Cleanup on component unmount
    }
  }, []);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isBabySelected) {
      e.preventDefault();
      return;
    }
    router.push('/form/personalize');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 flex flex-col items-center text-center p-4 pt-8 md:pt-12">
          <h2 className="text-xl font-bold text-primary">Naamkarann</h2>
          <div className="relative my-4 md:my-6">
              <h1 className="font-headline text-5xl md:text-6xl font-bold leading-tight">
                  The perfect name <br /> awaits.
              </h1>
              <div className="absolute top-0 left-0 w-16 h-16 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob -z-10"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 -z-10"></div>
          </div>
          <p className="mt-2 text-base text-foreground/70 max-w-sm">
            Thousands of meaningful names, one swipe at a time.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 my-4 md:my-6">
              {categories.map((category) => (
                  <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "secondary"}
                      onClick={() => setSelectedCategory(category)}
                      className="py-2 px-4 text-sm rounded-full cursor-pointer"
                  >
                      {category}
                  </Badge>
              ))}
          </div>

          <div className="my-2 flex flex-col items-center h-20">
              <p className="font-headline text-4xl text-purple-500 font-bold transition-all duration-500">{currentName}</p>
              <p className="text-sm text-muted-foreground mt-1">Perfect baby names</p>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground my-2 p-3 bg-card rounded-lg border">
              <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
              </div>
              <span>4.8</span>
              <span className="text-muted-foreground/50">•</span>
              <span>2,300+ names chosen</span>
              <span className="text-muted-foreground/50">•</span>
              <span>Linguist-verified</span>
          </div>
      </main>
       <footer className="w-full sticky bottom-0 left-0 bg-background py-4 px-4 flex flex-col items-center space-y-4 border-t border-border/20">
            <div className="w-full max-w-md">
                 <a 
                    href={isBabySelected ? "/form/personalize" : "#"} 
                    onClick={handleCtaClick}
                    className={cn(!isBabySelected && "opacity-50 pointer-events-none")}
                  >
                    <Button 
                        asChild={false}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg rounded-xl shadow-lg"
                    >
                        {isBabySelected 
                            ? "Perfect name in 4 clicks"
                            : "Coming soon"
                        }
                    </Button>
                </a>
            </div>
          <div className="flex space-x-6 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-primary">About</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">Privacy</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">Contact</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary font-bold text-accent">Support</Link>
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
