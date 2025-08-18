
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Star, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Login } from '@/components/login';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


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
const alphabet = "abcdefghijklmnopqrstuvwxyz";

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

    if (!hasMounted) {
      return (
        <p className="font-headline text-4xl text-purple-500 font-bold transition-all duration-500">
            {baseWord}
        </p>
      );
    }

    return (
        <p className="font-headline text-4xl text-purple-500 font-bold transition-all duration-500" aria-live="polite">
            {displayedName.map((char, index) => (
                <span key={index} className="inline-block animate-flip-in">
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </p>
    );
};


export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const handleGetStartedClick = () => {
    if (user) {
      router.push("/form/personalize");
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
  };
  
  const getInitials = () => {
    if (!user) return '';
    const name = user.displayName;
    const email = user.email;

    if (name) {
      return name.charAt(0).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  };


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
       <header className="absolute top-0 right-0 p-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? 'User'} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </header>
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
          
          <div className="my-8 flex flex-col items-center h-20">
              <AnimatedName />
              <p className="text-sm text-muted-foreground mt-1">Perfect baby names</p>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground my-2 p-3 bg-card rounded-lg border">
              <div className="flex items-center text-yellow-500" aria-label="4.8 out of 5 stars">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
              </div>
              <span>4.8</span>
              <span className="text-muted-foreground/50" aria-hidden="true">•</span>
              <span>2,300+ names chosen</span>
              <span className="text-muted-foreground/50" aria-hidden="true">•</span>
              <span>Linguist-verified</span>
          </div>

           <div className="w-full max-w-md mt-8">
              <Button
                  onClick={handleGetStartedClick}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg rounded-xl shadow-lg"
              >
                  Get Started
              </Button>
          </div>
          <Login isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} />
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
