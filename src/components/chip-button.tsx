"use client";

import { cn } from "@/lib/utils";

interface ChipButtonProps {
    label: string;
    isSelected: boolean;
    onSelect: () => void;
    className?: string;
}

export const ChipButton = ({ label, isSelected, onSelect, className }: ChipButtonProps) => (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "py-2 px-3 rounded-full border text-xs sm:text-sm font-medium transition-all select-none text-center truncate",
        isSelected 
          ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-[1.02] font-semibold" 
          : "bg-muted/40 hover:bg-muted/80 text-foreground border-border/80 hover:border-primary/30",
        className
      )}
    >
      {label}
    </button>
);
