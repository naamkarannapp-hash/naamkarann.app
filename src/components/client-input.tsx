
"use client";

import { Input } from "@/components/ui/input";
import * as React from "react"

// A client-side only wrapper around the Input component to avoid hydration errors
// caused by browser extensions modifying the DOM.
const ClientInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  (props, ref) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return null;
    }
    
    return <Input {...props} ref={ref} />;
  }
);
ClientInput.displayName = "ClientInput";


export { ClientInput };
