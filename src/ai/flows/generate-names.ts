'use server';

/**
 * @fileOverview Generates culturally authentic, personalized baby names directly inside Next.js.
 * Supports both Genkit flow and direct Google Gemini REST API execution for zero-bundle-overhead on Vercel.
 */

import { z } from 'zod';
import { ai } from '@/ai/genkit';

export const GenerateNamesInputSchema = z.object({
  gender: z.enum(['Boy', 'Girl', 'Neutral']).default('Neutral'),
  regionalRoots: z.array(z.string()).optional().default([]),
  startingLetters: z.string().optional().default(''),
  blendParents: z.boolean().optional().default(false),
  parent1Name: z.string().optional().default(''),
  parent2Name: z.string().optional().default(''),
  matchSibling: z.boolean().optional().default(false),
  siblingName: z.string().optional().default(''),
  inspirations: z.array(z.string()).optional().default([]),
});

export type GenerateNamesInput = z.infer<typeof GenerateNamesInputSchema>;

export const GeneratedNameItemSchema = z.object({
  name: z.string(),
  meaning: z.string(),
  pronunciation: z.string(),
  origin: z.string(),
  category: z.string(),
  gender: z.enum(['boy', 'girl', 'neutral']),
  gradient: z.string(),
});

export type GeneratedNameItem = z.infer<typeof GeneratedNameItemSchema>;

const gradientPalette = [
  'linear-gradient(135deg, #1A52E1 0%, #9C27B0 100%)',
  'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
  'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
  'linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)',
  'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
  'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
  'linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)',
  'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)',
  'linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)',
  'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
  'linear-gradient(135deg, #0052D4 0%, #4364F7 50%, #6FB1FC 100%)',
  'linear-gradient(135deg, #5C258D 0%, #4389A2 100%)',
  'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
];

function getRandomGradient(index: number): string {
  return gradientPalette[index % gradientPalette.length];
}

/**
 * Direct Gemini REST API call for high performance and zero serverless bundling issues on Vercel
 */
async function generateViaDirectGemini(input: GenerateNamesInput, apiKey: string): Promise<GeneratedNameItem[]> {
  const promptText = `You are a world-class culturally authentic linguist and baby naming master.
Generate 14 to 18 authentic baby names matching these criteria:
- Gender: ${input.gender}
- Cultural/Regional Roots: ${input.regionalRoots?.length ? input.regionalRoots.join(', ') : 'Any authentic Indian / Global root'}
${input.startingLetters ? `- Must start with prefix: "${input.startingLetters}"` : ''}
${input.blendParents ? `- Harmoniously blend sounds/syllables from Parent 1 ("${input.parent1Name}") and Parent 2 ("${input.parent2Name}")` : ''}
${input.matchSibling ? `- Complement sibling name: "${input.siblingName}"` : ''}
${input.inspirations?.length ? `- Inspirations/Vibes to incorporate: ${input.inspirations.join(', ')}` : ''}

Respond ONLY with a JSON array of objects with the exact schema:
[
  {
    "name": "string (properly capitalized)",
    "meaning": "string (1-2 sentences)",
    "pronunciation": "string (phonetic guide like AAR-v-ee)",
    "origin": "string (e.g. Sanskrit, Hindi, Tamil, Telugu, etc.)",
    "category": "string (e.g. Modern Classic, Celestial, Nature, Spiritual, Vedic)",
    "gender": "boy" | "girl" | "neutral",
    "gradient": "string (CSS linear-gradient)"
  }
]`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API responded with ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from Gemini API');
  }

  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) {
    throw new Error('Gemini response is not an array');
  }

  return parsed.map((item: any, idx: number) => ({
    name: item.name || 'Aarav',
    meaning: item.meaning || 'Peaceful and radiant.',
    pronunciation: item.pronunciation || item.name,
    origin: item.origin || 'Sanskrit',
    category: item.category || 'Modern Classic',
    gender: (item.gender === 'boy' || item.gender === 'girl' || item.gender === 'neutral') ? item.gender : 'neutral',
    gradient: item.gradient || getRandomGradient(idx),
  }));
}

export async function generateNames(input: GenerateNamesInput): Promise<GeneratedNameItem[]> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

  if (apiKey) {
    try {
      return await generateViaDirectGemini(input, apiKey);
    } catch (err) {
      console.warn('Direct Gemini API call failed, attempting Genkit flow:', err);
    }
  }

  // Fallback to Genkit flow if configured
  try {
    const prompt = ai.definePrompt({
      name: 'generateNamesPrompt',
      input: { schema: GenerateNamesInputSchema },
      output: { schema: z.array(GeneratedNameItemSchema) },
      prompt: `Generate 14-18 authentic baby names matching gender {{gender}}, roots {{regionalRoots}}, starting with {{startingLetters}}, inspirations {{inspirations}}. Return JSON array.`,
    });

    const { output } = await prompt(input);
    if (output && Array.isArray(output) && output.length > 0) {
      return output;
    }
  } catch (genkitErr) {
    console.warn('Genkit prompt flow failed:', genkitErr);
  }

  throw new Error('Unable to generate names via AI service.');
}
