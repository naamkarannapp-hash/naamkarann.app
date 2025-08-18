
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChipButtonProps {
    label: string;
    isSelected: boolean;
    onSelect: () => void;
    className?: string;
}

export const ChipButton = ({ label, isSelected, onSelect, className }: ChipButtonProps) => (
    <Button
      type="button"
      variant={isSelected ? "default" : "secondary"}
      onClick={onSelect}
      className={cn("rounded-full", isSelected ? 'text-primary-foreground' : 'text-foreground', className)}
    >
      {label}
    </Button>
);
