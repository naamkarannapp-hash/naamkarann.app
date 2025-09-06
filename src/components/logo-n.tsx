
import { cn } from "@/lib/utils";
import * as React from "react";

export const NaamkarannLogoN = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
    ({ className, ...props }, ref) => {
        return (
            <svg
                ref={ref}
                className={cn(className)}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
                {...props}
            >
                <path d="M7 13l5 5 5-5" />
            </svg>
        );
    }
);
NaamkarannLogoN.displayName = "NaamkarannLogoN";
