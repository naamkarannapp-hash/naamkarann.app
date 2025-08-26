
"use client";

import { motion, AnimatePresence } from "framer-motion";
import React,
{ useEffect } from "react";
import { cn } from "@/lib/utils";

interface InspirationReminderToastProps {
  show: boolean;
  onDismiss: () => void;
  onTap: () => void;
}

export function InspirationReminderToast({ show, onDismiss, onTap }: InspirationReminderToastProps) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onDismiss();
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [show, onDismiss]);


  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 bg-black/30"
                onClick={onTap} 
            />
             <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                onClick={onTap}
                role="status"
                aria-live="polite"
                className={cn(
                    "relative z-50 w-auto max-w-[90%] rounded-lg mb-[calc(24px+env(safe-area-inset-bottom))] px-4 py-3",
                    "bg-popover text-popover-foreground shadow-lg"
                )}
             >
                <p className="text-sm text-center">Looking for rarer gems? Add a language root or vibe first.</p>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
