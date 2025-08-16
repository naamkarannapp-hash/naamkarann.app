"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

export function FormFooter() {
    const pathname = usePathname();

    const getButtonInfo = () => {
        switch (pathname) {
            case "/form/personalize":
                return { text: "Next: Cultural", formId: "personalize-form" };
            case "/form/cultural":
                return { text: "Next: Inspirations", formId: "cultural-form" };
            case "/form/inspirations":
                return { text: "Show Names", formId: "inspirations-form", icon: <Sparkles className="ml-2 h-5 w-5"/> };
            default:
                return { text: "Next", formId: "" };
        }
    };

    const { text, formId, icon } = getButtonInfo();

    return (
        <footer className="w-full fixed bottom-0 left-0 bg-background py-4 px-4 flex justify-center border-t border-border/20">
            <Button 
                type="submit"
                form={formId}
                size="lg" 
                className="w-full max-w-md bg-primary text-primary-foreground font-bold rounded-xl shadow-lg"
            >
                {text}
                {icon}
            </Button>
        </footer>
    );
}
