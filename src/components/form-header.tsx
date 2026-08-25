"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAppState } from "@/context/app-state-context";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Link from "next/link";

const steps = [
  { path: "/form/personalize", label: "Personalize" },
  { path: "/form/inspirations", label: "Inspirations" },
];

const chipColorClasses = [
    "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
    "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100",
    "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
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
    <header className="w-full max-w-xl mx-auto space-y-3 mb-2">
      {/* Clean Brand logo & Step count badge */}
      <div className="flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-1">
          <h2 className="text-xl font-extrabold tracking-tight text-primary">
            Naamkarann<span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider ml-0.5">app</span>
          </h2>
        </Link>
        <span className="text-xs font-semibold text-muted-foreground bg-white/80 dark:bg-card/80 px-2.5 py-1 rounded-full border border-border/60 shadow-sm">
          Step {currentStepIndex + 1} of {steps.length}
        </span>
      </div>

      {/* Active Selections Tags */}
      {selections.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center justify-center pt-1 min-h-[24px]">
              {selections.map((selection, index) => (
                  <Badge 
                    key={`${selection.type}-${selection.value}-${index}`} 
                    variant="outline" 
                    className={cn(
                        "py-0.5 pl-2.5 pr-2 rounded-full font-medium text-xs border flex items-center gap-1 shadow-sm transition-all",
                        chipColorClasses[index % chipColorClasses.length]
                    )}
                   >
                      <span>{selection.displayValue}</span>
                      {selection.type !== 'gender' && (
                        <button
                          type="button"
                          aria-label={`Remove ${selection.displayValue}`}
                          onClick={() => handleRemove(selection)}
                          className="rounded-full opacity-60 hover:opacity-100 hover:bg-black/10 p-0.5 transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                      )}
                  </Badge>
              ))}
          </div>
      )}
    </header>
  );
}
