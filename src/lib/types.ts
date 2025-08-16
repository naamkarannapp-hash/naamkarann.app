import { z } from "zod";

export const nameFormSchema = z.object({
  gender: z.enum(["Boy", "Girl", "Neutral"]).optional(),
  regionalRoots: z.array(z.string()).optional(),
  startingLetters: z.string().optional(),
  parent1Name: z.string().optional(),
  parent2Name: z.string().optional(),
  siblingName: z.string().optional(),
  inspirations: z.array(z.string()).optional(),
  tradition: z.array(z.string()).optional(),
  blendParents: z.boolean().optional(),
  matchSibling: z.boolean().optional(),
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