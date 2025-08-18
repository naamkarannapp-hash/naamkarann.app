
import { z } from "zod";

const baseNameFormSchema = z.object({
  gender: z.enum(["Boy", "Girl", "Neutral"]).optional(),
  regionalRoots: z.array(z.string()).optional(),
  startingLetters: z.string().max(3, "Only up to 3 characters are allowed.").optional(),
  blendParents: z.boolean().optional(),
  parent1Name: z.string().optional(),
  parent2Name: z.string().optional(),
  matchSibling: z.boolean().optional(),
  siblingName: z.string().optional(),
  inspirations: z.array(z.string()).max(5, "You can select a maximum of 5 vibes.").optional(),
});

export const nameFormSchema = baseNameFormSchema.superRefine((data, ctx) => {
  if (data.blendParents && (!data.parent1Name || data.parent1Name.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "First parent's name is required.",
      path: ["parent1Name"],
    });
  }
  if (data.matchSibling && (!data.siblingName || data.siblingName.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Sibling's name is required.",
      path: ["siblingName"],
    });
  }
});

export const personalizePageSchema = baseNameFormSchema.pick({
    gender: true,
    startingLetters: true,
    blendParents: true,
    parent1Name: true,
    parent2Name: true,
    matchSibling: true,
    siblingName: true,
}).superRefine((data, ctx) => {
    if (data.blendParents && (!data.parent1Name || data.parent1Name.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "First parent's name is required.",
        path: ["parent1Name"],
      });
    }
    if (data.matchSibling && (!data.siblingName || data.siblingName.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sibling's name is required.",
        path: ["siblingName"],
      });
    }
});


export type NameFormValues = z.infer<typeof nameFormSchema>;

export interface NameResult {
  id: string;
  name: string;
  meaning: string;
  origin: string;
  category: string;
  gender: string;
  gradient: string;
}

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    searchCount?: number;
}
