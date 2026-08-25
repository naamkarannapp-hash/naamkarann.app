"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";

export function FormFooter() {
    const pathname = usePathname();
    const router = useRouter();

    const isPersonalize = pathname.startsWith("/form/personalize");
    const isInspirations = pathname.startsWith("/form/inspirations");

    const getButtonInfo = () => {
        if (isPersonalize) {
            return { 
                text: "Next: Inspirations", 
                formId: "personalize-form", 
                icon: <ArrowRight className="ml-2 h-4 w-4" /> 
            };
        }
        if (isInspirations) {
            return { 
                text: "Discover Names", 
                formId: "inspirations-form", 
                icon: <Sparkles className="ml-2 h-4 w-4" /> 
            };
        }
        return { text: "Next", formId: "", icon: <ArrowRight className="ml-2 h-4 w-4" /> };
    };

    // Reliable explicit routing for Back navigation across screens
    const handleBack = () => {
        if (isInspirations) {
            router.push("/form/personalize");
        } else {
            router.push("/");
        }
    };

    const { text, formId, icon } = getButtonInfo();

    return (
        <footer className="w-full fixed bottom-0 left-0 bg-white/90 dark:bg-card/90 backdrop-blur-md py-3 px-4 border-t border-border/60 z-50 shadow-md">
           <div className="w-full max-w-xl mx-auto flex items-center justify-between gap-3">
                 {/* Standard neutral ghost Back button preserving original styling */}
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
