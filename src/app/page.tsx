import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <header className="flex-grow flex flex-col items-center justify-center">
        <h1 className="font-headline text-6xl md:text-8xl font-bold text-primary">Naamkarann</h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-2xl">
          Welcome to Naamkarann, where finding the perfect name for your little star is just a few clicks away. Let's begin this wonderful journey together.
        </p>
        <Link href="/form/personalize" passHref>
          <Button className="mt-8 bg-accent hover:bg-accent/90 text-white font-bold py-8 px-10 text-xl rounded-full shadow-lg transition-transform hover:scale-105">
            Start the Journey <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </Link>
      </header>
       <footer className="w-full py-6">
          <p className="text-sm text-foreground/60">Crafted with love for new beginnings.</p>
       </footer>
    </div>
  );
}
