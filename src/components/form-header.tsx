
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAppState } from "@/context/app-state-context";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./ui/button";

const steps = [
  { path: "/form/personalize", label: "Personalize" },
  { path: "/form/inspirations", label: "Inspirations" },
];

const chipColorClasses = [
    "bg-blue-100 text-blue-700 hover:bg-blue-200",
    "bg-pink-100 text-pink-700 hover:bg-pink-200",
    "bg-green-100 text-green-700 hover:bg-green-200",
    "bg-purple-100 text-purple-700 hover:bg-purple-200",
    "bg-orange-100 text-orange-700 hover:bg-orange-200",
    "bg-teal-100 text-teal-700 hover:bg-teal-200",
];

interface Selection {
  type: 'gender' | 'startingLetters' | 'blendParents' | 'matchSibling' | 'regionalRoot' | 'inspiration';
  value: string;
  displayValue: string;
}

export function FormHeader() {
  const pathname = usePathname();
  const { state, setState } = useAppState();

  const currentStepIndex = steps.findIndex(step => pathname.startsWith(step.path));
  
  const handleRemove = (selection: Selection) => {
    const { formValues } = state;
    switch (selection.type) {
      case 'startingLetters':
        setState({ formValues: { ...formValues, startingLetters: "" }});
        break;
      case 'blendParents':
        setState({ formValues: { ...formValues, blendParents: false, parent1Name: "", parent2Name: "" }});
        break;
      case 'matchSibling':
        setState({ formValues: { ...formValues, matchSibling: false, siblingName: "" }});
        break;
      case 'regionalRoot':
        const newRoots = formValues.regionalRoots?.filter(r => r !== selection.value);
        setState({ formValues: { ...formValues, regionalRoots: newRoots }});
        break;
      case 'inspiration':
        const newInspirations = formValues.inspirations?.filter(i => i !== selection.value);
        setState({ formValues: { ...formValues, inspirations: newInspirations }});
        break;
      default:
        break;
    }
  };


  const getVisibleSelections = (): Selection[] => {
    const { formValues } = state;
    const selections: Selection[] = [];

    if (formValues.gender) {
        selections.push({ type: 'gender', value: formValues.gender, displayValue: formValues.gender });
    }
    if (formValues.startingLetters) {
        selections.push({ type: 'startingLetters', value: formValues.startingLetters, displayValue: `Starts with: ${formValues.startingLetters}` });
    }
    if (formValues.blendParents && formValues.parent1Name) {
        let text = `Blend: ${formValues.parent1Name}`;
        if(formValues.parent2Name) text += ` & ${formValues.parent2Name}`;
        selections.push({ type: 'blendParents', value: 'blend', displayValue: text });
    }
    if(formValues.matchSibling && formValues.siblingName) {
        selections.push({ type: 'matchSibling', value: 'match', displayValue: `Match: ${formValues.siblingName}` });
    }
    if (formValues.regionalRoots) {
        selections.push(...formValues.regionalRoots.map(r => ({ type: 'regionalRoot' as const, value: r, displayValue: r })));
    }
    if (formValues.inspirations) {
        selections.push(...formValues.inspirations.map(i => ({ type: 'inspiration' as const, value: i, displayValue: i })));
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
          <div className="flex flex-wrap gap-2 items-center justify-center min-h-[28px]">
              {selections.map((selection, index) => (
                  <Badge 
                    key={`${selection.type}-${selection.value}-${index}`} 
                    variant="secondary" 
                    className={cn(
                        "py-1 pl-3 pr-2 rounded-full font-semibold border-none flex items-center gap-1 group",
                        chipColorClasses[index % chipColorClasses.length]
                    )}
                   >
                      <span>{selection.displayValue}</span>
                      {selection.type !== 'gender' && (
                        <button
                          type="button"
                          aria-label={`Remove ${selection.displayValue}`}
                          onClick={() => handleRemove(selection)}
                          className="rounded-full opacity-50 group-hover:opacity-100 hover:bg-black/10"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                  </Badge>
              ))}
          </div>
      )}
    </header>
  );
}
