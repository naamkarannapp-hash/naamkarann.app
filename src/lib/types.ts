import { z } from "zod";

export const nameFormSchema = z.object({
  gender: z.enum(["Boy", "Girl", "Neutral"]).optional(),
  regionalRoots: z.array(z.string()).optional(),
  startingLetters: z.string().max(3, "Only up to 3 characters are allowed.").optional(),
  parent1Name: z.string().optional(),
  parent2Name: z.string().optional(),
  siblingName: z.string().optional(),
  inspirations: z.array(z.string()).optional(),
  tradition: z.array(z.string()).optional(),
  blendParents: z.boolean().optional(),
  matchSibling: z.boolean().optional(),
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
