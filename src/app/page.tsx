"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow flex flex-col items-center text-center p-4 pt-16">
        <h2 className="text-xl font-bold text-primary">Naamkarann</h2>
        <div className="relative my-8">
            <h1 className="font-headline text-5xl md:text-6xl font-bold leading-tight">
                The perfect name <br /> awaits.
            </h1>
            <div className="absolute top-0 left-0 w-16 h-16 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob -z-10"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 -z-10"></div>
        </div>
        <p className="mt-2 text-base text-foreground/70 max-w-sm">
          Thousands of meaningful names, one swipe at a time.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 my-8">
            <Badge className="py-2 px-4 text-sm rounded-full bg-primary text-primary-foreground">Baby</Badge>
            <Badge variant="secondary" className="py-2 px-4 text-sm rounded-full">Startup</Badge>
            <Badge variant="secondary" className="py-2 px-4 text-sm rounded-full">Product</Badge>
            <Badge variant="secondary" className="py-2 px-4 text-sm rounded-full">Social</Badge>
            <Badge variant="secondary" className="py-2 px-4 text-sm rounded-full">Group</Badge>
        </div>

        <div className="my-8 flex flex-col items-center">
            <p className="font-headline text-4xl text-purple-500 font-bold">Gitisha</p>
            <p className="text-sm text-muted-foreground mt-1">Perfect baby names</p>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground my-8 p-3 bg-card rounded-lg border">
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
       <footer className="w-full py-6 px-4 flex flex-col items-center space-y-6">
          <Link href="/form/personalize" passHref className="w-full max-w-md">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 px-8 text-lg rounded-xl shadow-lg">
                Start naming <span className="mx-2 font-light text-primary-foreground/50">••••</span> 4 quick questions
            </Button>
          </Link>
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
