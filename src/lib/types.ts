
import { z } from "zod";

const onlyAlphabets = /^[a-zA-Z]*$/;
const alphabetMessage = "Only alphabets are allowed.";

const baseNameFormSchema = z.object({
  gender: z.enum(["Boy", "Girl", "Neutral"]).optional(),
  regionalRoots: z.array(z.string()).max(3, "You can select a maximum of 3 roots.").optional(),
  startingLetters: z.string().max(3, "Only up to 3 characters are allowed.").regex(onlyAlphabets, alphabetMessage).optional(),
  blendParents: z.boolean().optional(),
  parent1Name: z.string().regex(onlyAlphabets, alphabetMessage).optional(),
  parent2Name: z.string().regex(onlyAlphabets, alphabetMessage).optional(),
  matchSibling: z.boolean().optional(),
  siblingName: z.string().regex(onlyAlphabets, alphabetMessage).optional(),
  inspirations: z.array(z.string()).max(5, "You can select a maximum of 5 vibes.").optional(),
  astrologyMode: z.boolean().optional(),
  dateOfBirth: z.date().optional(),
  timeOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
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
  if (data.astrologyMode) {
    if (!data.dateOfBirth) {
      ctx.addIssue({ code: 'custom', message: 'Date of birth is required.', path: ['dateOfBirth'] });
    }
    if (!data.timeOfBirth) {
        ctx.addIssue({ code: 'custom', message: 'Time of birth is required.', path: ['timeOfBirth'] });
    }
    if (!data.placeOfBirth || data.placeOfBirth.trim() === '') {
      ctx.addIssue({ code: 'custom', message: 'Place of birth is required.', path: ['placeOfBirth'] });
    }
    if (data.lat === undefined || data.lon === undefined) {
      ctx.addIssue({ code: 'custom', message: 'Please select a valid location from the search.', path: ['placeOfBirth'] });
    }
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
    astrologyMode: true,
    dateOfBirth: true,
    timeOfBirth: true,
    placeOfBirth: true,
    lat: true,
    lon: true,
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
    if (data.astrologyMode) {
        if (!data.dateOfBirth) {
          ctx.addIssue({ code: 'custom', message: 'Date of birth is required.', path: ['dateOfBirth'] });
        }
        if (!data.timeOfBirth) {
            ctx.addIssue({ code: 'custom', message: 'Time of birth is required.', path: ['timeOfBirth'] });
        }
        if (!data.placeOfBirth || data.placeOfBirth.trim() === '') {
          ctx.addIssue({ code: 'custom', message: 'Place of birth is required.', path: ['placeOfBirth'] });
        }
    }
});


export type NameFormValues = z.infer<typeof nameFormSchema>;

export interface NameResult {
  id: string;
  name: string;
  meaning: string;
  pronunciation: string;
  origin: string;
  category: string;
  gender: string;
  gradient: string;
}

export interface LocationSearchResult {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  coordinates: [number, number]; // [lat, lon]
}
