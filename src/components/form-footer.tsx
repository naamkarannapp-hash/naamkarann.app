
"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

const steps = [
  "/form/personalize",
  "/form/cultural",
  "/form/inspirations",
];

export function FormFooter() {
    const pathname = usePathname();
    const router = useRouter();

    const currentStepIndex = steps.findIndex(step => pathname.startsWith(step));

    const getButtonInfo = () => {
        switch (pathname) {
            case "/form/personalize":
                return { text: "Next", formId: "personalize-form" };
            case "/form/cultural":
                return { text: "Next", formId: "cultural-form" };
            case "/form/inspirations":
                return { text: "Show Names", formId: "inspirations-form", icon: <Sparkles className="ml-2 h-5 w-5"/> };
            default:
                if (currentStepIndex !== -1) {
                    const formId = steps[currentStepIndex].split('/').pop() + "-form";
                    return { text: "Next", formId: formId };
                }
                return { text: "Next", formId: "" };
        }
    };

    const handleBack = () => {
      if (currentStepIndex > 0) {
          router.back();
      } else {
          router.push('/');
      }
    };

    const { text, formId, icon } = getButtonInfo();
    const isLastStep = currentStepIndex === steps.length - 1;


    return (
        <footer className="w-full fixed bottom-0 left-0 bg-background py-4 px-4 border-t border-border/20 z-50">
           <div className="w-full max-w-md mx-auto flex items-center justify-between space-x-4">
                 <Button 
                    variant="ghost"
                    onClick={handleBack}
                    className="text-muted-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Back
                </Button>

                <Button 
                    type="submit"
                    form={formId}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-xl shadow-lg flex-grow"
                    style={{ minWidth: '120px' }}
                >
                    {text}
                    {icon}
                </Button>
           </div>
        </footer>
    );
}
