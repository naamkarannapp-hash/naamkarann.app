"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { NameFormValues, NameResult } from "@/lib/types";
import { nameFormSchema } from "@/lib/types";
import { getAndPrioritizeNames } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { NameCard } from "@/components/name-card";
import { Loader2, Baby, Users, MapPin, CaseUpperA, Lightbulb, BookOpen, Bookmark, X, Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function NaamkarannClient() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [nameResults, setNameResults] = React.useState<NameResult[]>([]);
  const [savedNames, setSavedNames] = React.useState<NameResult[]>([]);
  const { toast } = useToast();

  const form = useForm<NameFormValues>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      gender: undefined,
      regionalRoots: "",
      startingLetters: "",
      parent1Name: "",
      parent2Name: "",
      siblingName: "",
      inspirations: "",
      tradition: "",
    },
  });

  async function onSubmit(data: NameFormValues) {
    setIsLoading(true);
    setNameResults([]);
    const result = await getAndPrioritizeNames(data);
    setIsLoading(false);

    if ("error" in result) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: result.error,
      });
    } else {
      if (result.names.length === 0) {
        toast({
          title: "No names found",
          description: "Try adjusting your criteria for more results.",
        });
      }
      setNameResults(result.names);
    }
  }
  
  const handleSaveName = (name: NameResult) => {
    setSavedNames(prev => {
      const isSaved = prev.some(saved => saved.id === name.id);
      if (isSaved) {
        return prev.filter(saved => saved.id !== name.id);
      } else {
        return [...prev, name];
      }
    });
  };

  const isNameSaved = (id: string) => savedNames.some(n => n.id === id);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center my-8">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">Naamkarann</h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80">Discover the perfect name for your little star.</p>
      </header>

      <div className="fixed top-4 right-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
                <Button variant="secondary" className="rounded-full shadow-lg">
                    <Bookmark className="mr-2 h-5 w-5"/> 
                    Saved ({savedNames.length})
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Your Saved Names</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                    {savedNames.length > 0 ? (
                        savedNames.map(name => (
                            <Card key={name.id} className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{name.name}</p>
                                    <p className="text-sm text-muted-foreground">{name.meaning}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleSaveName(name)}>
                                    <X className="h-4 w-4"/>
                                </Button>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground mt-8">You haven't saved any names yet.</p>
                    )}
                </div>
            </SheetContent>
          </Sheet>
      </div>

      <main className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-primary/20 border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary"><Star/>Tell us what you're looking for</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Male" /></FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Female" /></FormControl>
                            <FormLabel className="font-normal">Female</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Neutral" /></FormControl>
                            <FormLabel className="font-normal">Neutral</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="regionalRoots" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4"/>Regional Roots</FormLabel>
                        <FormControl><Input placeholder="e.g., Indian, Sanskrit" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="startingLetters" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><CaseUpperA className="mr-2 h-4 w-4"/>Starting Letter(s)</FormLabel>
                        <FormControl><Input placeholder="e.g., A, Ra" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                </div>
                
                <div>
                    <FormLabel className="flex items-center mb-2"><Users className="mr-2 h-4 w-4"/>Parent's Name Blend</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField control={form.control} name="parent1Name" render={({ field }) => (
                           <FormItem><FormControl><Input placeholder="Parent 1" {...field} /></FormControl><FormMessage /></FormItem>
                         )}/>
                         <FormField control={form.control} name="parent2Name" render={({ field }) => (
                           <FormItem><FormControl><Input placeholder="Parent 2" {...field} /></FormControl><FormMessage /></FormItem>
                         )}/>
                    </div>
                </div>

                <FormField control={form.control} name="siblingName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Baby className="mr-2 h-4 w-4"/>Match Sibling's Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Priya" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="tradition" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><BookOpen className="mr-2 h-4 w-4"/>Tradition</FormLabel>
                    <FormControl><Input placeholder="e.g., Hindu, Christian" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="inspirations" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Lightbulb className="mr-2 h-4 w-4"/>Inspirations</FormLabel>
                    <FormControl><Textarea placeholder="Describe any inspirations: a character, a value, a place..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

                <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-6 text-lg">
                  {isLoading ? (<><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Generating...</>) : "Generate Names"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>

      {nameResults.length > 0 && (
        <section className="mt-12">
            <h2 className="text-center font-headline text-4xl font-bold text-primary mb-8">Your Name Suggestions</h2>
            <Carousel className="w-full max-w-md mx-auto" opts={{ loop: true }}>
                <CarouselContent>
                    {nameResults.map((name) => (
                    <CarouselItem key={name.id}>
                        <div className="p-1">
                          <NameCard name={name} onSave={handleSaveName} isSaved={isNameSaved(name.id)} />
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="text-accent" />
                <CarouselNext className="text-accent" />
            </Carousel>
        </section>
      )}
    </div>
  );
}
