"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";

const steps = [
  "/form/personalize",
  "/form/inspirations",
];

export function FormFooter() {
    const pathname = usePathname();
    const router = useRouter();

    const currentStepIndex = steps.findIndex(step => pathname.startsWith(step));

    const getButtonInfo = () => {
        switch (pathname) {
            case "/form/personalize":
                return { 
                  text: "Next: Inspirations", 
                  formId: "personalize-form", 
                  icon: <ArrowRight className="ml-2 h-4 w-4" /> 
                };
            case "/form/inspirations":
                return { 
                  text: "Discover Names", 
                  formId: "inspirations-form", 
                  icon: <Sparkles className="ml-2 h-4 w-4" /> 
                };
            default:
                if (currentStepIndex !== -1) {
                    const formId = steps[currentStepIndex].split('/').pop() + "-form";
                    return { text: "Next", formId: formId, icon: <ArrowRight className="ml-2 h-4 w-4" /> };
                }
                return { text: "Next", formId: "", icon: <ArrowRight className="ml-2 h-4 w-4" /> };
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

    return (
        <footer className="w-full fixed bottom-0 left-0 bg-white/90 dark:bg-card/90 backdrop-blur-md py-3 px-4 border-t border-border/60 z-50 shadow-md">
           <div className="w-full max-w-xl mx-auto flex items-center justify-between gap-3">
                 <Button 
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="text-muted-foreground hover:text-foreground font-semibold px-3 h-10 rounded-xl"
                >
                    <ArrowLeft className="mr-1.5 h-4 w-4"/>
                    Back
                </Button>

                <Button 
                    type="submit"
                    form={formId}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-10 px-6 rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 flex-grow max-w-[200px] transition-all text-sm"
                >
                    <span>{text}</span>
                    {icon}
                </Button>
           </div>
        </footer>
    );
}
