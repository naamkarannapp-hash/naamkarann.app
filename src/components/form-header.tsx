"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { useAppState } from "@/context/app-state-context";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const steps = [
  { path: "/form/personalize", label: "Personalize" },
  { path: "/form/cultural", label: "Cultural" },
  { path: "/form/inspirations", label: "Inspirations" },
];

export function FormHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, setState } = useAppState();

  const currentStepIndex = steps.findIndex(step => pathname.startsWith(step.path));
  
  const handleBack = () => {
      if(currentStepIndex > 0) {
          router.back();
      } else {
          router.push('/');
      }
  }
  
  const handleSkip = () => {
    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) {
        router.push(nextStep.path);
    } else {
        router.push('/results');
    }
  }

  const getVisibleSelections = () => {
    const { formValues } = state;
    const selections = [];

    if (formValues.gender) selections.push({key: 'gender', value: formValues.gender});
    if (formValues.startingLetters) selections.push({key: 'startingLetters', value: `Starts with: ${formValues.startingLetters}`});
    if (formValues.regionalRoots && formValues.regionalRoots.length > 0) {
        selections.push(...formValues.regionalRoots.map(r => ({key: `root_${r}`, value: r})));
    }
    // Add other fields as needed

    return selections;
  };
  
  const removeSelection = (key: string, value: string) => {
    const { formValues } = state;
    let newFormValues = { ...formValues };

    if (key === 'gender') {
        newFormValues.gender = undefined;
    } else if (key === 'startingLetters') {
        newFormValues.startingLetters = "";
    } else if (key.startsWith('root_')) {
        const rootToRemove = value;
        newFormValues.regionalRoots = formValues.regionalRoots?.filter(r => r !== rootToRemove);
    }
    
    setState({ formValues: newFormValues });
  }

  const selections = getVisibleSelections();

  return (
    <header className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={handleBack} variant="ghost" size="icon">
            <ArrowLeft />
        </Button>
        <div className="text-sm font-semibold">
            Step {currentStepIndex + 1}/{steps.length}
        </div>
        <Button onClick={handleSkip} variant="ghost" className="text-primary font-bold">Skip</Button>
      </div>
      {selections.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
              {selections.map(({key, value}) => (
                  <Badge key={key} variant="secondary" className="py-1 px-3 rounded-full bg-blue-100 text-blue-700 font-semibold">
                      {value}
                      <button onClick={() => removeSelection(key, value)} className="ml-2 rounded-full hover:bg-blue-200 p-0.5">
                          <X className="w-3 h-3"/>
                      </button>
                  </Badge>
              ))}
          </div>
      )}
    </header>
  );
}