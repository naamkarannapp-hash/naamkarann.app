
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
                xmlns="http://www.w3.org/2000/svg"
                {...props}
            >
                <path
                    d="M16.8521 21V6.25L9.61208 17.65V2.89999H7.15208V21H9.61208L16.8521 9.55V21H16.8521Z"
                    fill="currentColor"
                />
            </svg>
        );
    }
);
NaamkarannLogoN.displayName = "NaamkarannLogoN";
