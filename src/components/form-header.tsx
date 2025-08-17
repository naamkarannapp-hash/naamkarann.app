
"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAppState } from "@/context/app-state-context";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const steps = [
  { path: "/form/personalize", label: "Personalize" },
  { path: "/form/inspirations", label: "Inspirations" },
];

const chipColorClasses = [
    "bg-blue-100 text-blue-700",
    "bg-pink-100 text-pink-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-orange-100 text-orange-700",
    "bg-teal-100 text-teal-700",
];

export function FormHeader() {
  const pathname = usePathname();
  const { state } = useAppState();

  const currentStepIndex = steps.findIndex(step => pathname.startsWith(step.path));

  const getVisibleSelections = () => {
    const { formValues } = state;
    const selections = [];

    if (formValues.gender) selections.push(formValues.gender);
    if (formValues.startingLetters) selections.push(`Starts with: ${formValues.startingLetters}`);
    if (formValues.blendParents && formValues.parent1Name) {
        let text = `Blend: ${formValues.parent1Name}`;
        if(formValues.parent2Name) text += ` & ${formValues.parent2Name}`;
        selections.push(text);
    }
    if(formValues.matchSibling && formValues.siblingName) selections.push(`Match: ${formValues.siblingName}`);
    if (formValues.regionalRoots && formValues.regionalRoots.length > 0 && !(formValues.regionalRoots.length === 1 && formValues.regionalRoots[0] === 'Surprise Me')) {
        selections.push(...formValues.regionalRoots);
    }
     if (formValues.inspirations && formValues.inspirations.length > 0) {
        selections.push(...formValues.inspirations);
    }

    return selections;
  };

  const selections = getVisibleSelections();

  return (
    <header className="space-y-6">
      <div className="flex items-center justify-center relative">
        <div className="text-sm font-semibold text-center">
            Step {currentStepIndex + 1}/{steps.length}
        </div>
      </div>
      {selections.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center justify-center">
              {selections.map((value, index) => (
                  <Badge 
                    key={`${value}-${index}`} 
                    variant="secondary" 
                    className={cn(
                        "py-1 px-3 rounded-full font-semibold border-none",
                        chipColorClasses[index % chipColorClasses.length]
                    )}
                   >
                      {value}
                  </Badge>
              ))}
          </div>
      )}
    </header>
  );
}
