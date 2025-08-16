"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
  const { state } = useAppState();

  const currentStepIndex = steps.findIndex(step => step.path === pathname);
  
  const canGoBack = currentStepIndex > 0;

  const handleBack = () => {
      if(canGoBack) {
          router.back();
      } else {
          router.push('/');
      }
  }

  const getVisibleSelections = () => {
    const { formValues } = state;
    const selections = [];

    if (formValues.gender) selections.push(formValues.gender);
    if (formValues.parent1Name || formValues.parent2Name) selections.push("Parents Blend");
    if (formValues.siblingName) selections.push(`Sibling: ${formValues.siblingName}`);
    if (formValues.regionalRoots) selections.push(formValues.regionalRoots);
    if (formValues.tradition) selections.push(formValues.tradition);
    if (formValues.startingLetters) selections.push(`Starts with: ${formValues.startingLetters}`);

    return selections;
  };

  const selections = getVisibleSelections();

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <Button onClick={handleBack} variant="ghost" size="icon">
            <ArrowLeft />
        </Button>
        <div className="flex items-center gap-2">
            {steps.map((step, index) => (
            <React.Fragment key={step.path}>
                <div className={`flex items-center gap-2 ${index <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${index <= currentStepIndex ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {index + 1}
                    </div>
                    <span className="hidden md:inline">{step.label}</span>
                </div>
                {index < steps.length - 1 && <div className="h-0.5 w-8 bg-border" />}
            </React.Fragment>
            ))}
        </div>
      </div>
      {selections.length > 0 && (
          <div className="mt-4 p-2 bg-muted rounded-lg flex flex-wrap gap-2 items-center">
              <span className="text-sm font-semibold mr-2">Your Choices:</span>
              {selections.map((selection, index) => (
                  <Badge key={index} variant="secondary">{selection}</Badge>
              ))}
          </div>
      )}
    </header>
  );
}
