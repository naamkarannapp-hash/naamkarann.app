/**
 * @fileOverview Generates culturally authentic, personalized baby names directly inside Next.js using OpenRouter.
 * Supports configurable LLM models (defaulting to openai/gpt-4o-mini) and limits to max 10 names per search.
 */

import { z } from 'zod';

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

function normalizeModelName(rawModel?: string): string {
  if (!rawModel || rawModel.trim() === '') {
    return 'openai/gpt-4o-mini';
  }
  const model = rawModel.trim();
  if (model.includes('/')) {
    return model;
  }
  if (model.startsWith('gpt-')) {
    return `openai/${model}`;
  }
  if (model.startsWith('claude-')) {
    return `anthropic/${model}`;
  }
  if (model.startsWith('gemini-')) {
    return `google/${model}`;
  }
  return model;
}

/**
 * OpenRouter AI Name Generation Service (Max 10 names)
 */
async function generateViaOpenRouter(
  input: GenerateNamesInput,
  apiKey: string,
  modelName: string
): Promise<GeneratedNameItem[]> {
  const model = normalizeModelName(modelName);

  const systemPrompt = `You are a world-class culturally authentic linguist and baby naming master specializing in Indian, Vedic, and global cultures.
Your task is to generate up to 10 high-quality, authentic, and unique baby names matching the user's criteria.
Always respond ONLY with valid JSON adhering to this structure:
{
  "names": [
    {
      "name": "string (properly capitalized)",
      "meaning": "string (1-2 evocative sentences)",
      "pronunciation": "string (phonetic guide like AAR-v-ee)",
      "origin": "string (e.g. Sanskrit, Hindi, Tamil, Telugu, Arabic, etc.)",
      "category": "string (e.g. Modern Classic, Celestial, Nature, Spiritual, Vedic, Royal)",
      "gender": "boy" | "girl" | "neutral",
      "gradient": "string (CSS linear-gradient matching the aura)"
    }
  ]
}`;

  const userPrompt = `Generate a maximum of 10 baby names for these preferences:
- Target Gender: ${input.gender}
- Regional / Linguistic Roots: ${input.regionalRoots?.length ? input.regionalRoots.join(', ') : 'Any authentic Indian or global root'}
${input.startingLetters ? `- Required Starting Prefix: "${input.startingLetters}" (must start with this)` : ''}
${input.blendParents ? `- Blend sounds/elements from Parent 1 ("${input.parent1Name}") and Parent 2 ("${input.parent2Name}")` : ''}
${input.matchSibling ? `- Complement sibling name: "${input.siblingName}"` : ''}
${input.inspirations?.length ? `- Inspirations / Vibes to weave into names: ${input.inspirations.join(', ')}` : ''}

Output only the JSON object with the "names" array containing at most 10 names.`;

  const siteUrl = process.env.OPENROUTER_SITE_URL || 'https://naamkarann.app';
  const siteName = process.env.OPENROUTER_SITE_NAME || 'Naamkarann';

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': siteUrl,
      'X-Title': siteName,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data?.choices?.[0]?.message?.content;

  if (!rawContent) {
    throw new Error('Empty response received from OpenRouter API');
  }

  // Remove potential markdown code blocks
  const cleanJson = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const parsed = JSON.parse(cleanJson);

  const rawList: any[] = Array.isArray(parsed) ? parsed : (parsed.names || parsed.output || []);

  if (!Array.isArray(rawList) || rawList.length === 0) {
    throw new Error('OpenRouter response did not contain a valid names list');
  }

  return rawList.slice(0, 10).map((item: any, idx: number) => ({
    name: String(item.name || 'Aarav').trim(),
    meaning: String(item.meaning || 'Peaceful and full of wisdom.').trim(),
    pronunciation: String(item.pronunciation || item.name).trim(),
    origin: String(item.origin || 'Sanskrit').trim(),
    category: String(item.category || 'Modern Classic').trim(),
    gender: (item.gender === 'boy' || item.gender === 'girl' || item.gender === 'neutral') ? item.gender : 'neutral',
    gradient: item.gradient || getRandomGradient(idx),
  }));
}

/**
 * Direct Gemini REST API fallback (Max 10 names)
 */
async function generateViaDirectGemini(input: GenerateNamesInput, apiKey: string): Promise<GeneratedNameItem[]> {
  const promptText = `Generate at most 10 authentic baby names matching:
- Gender: ${input.gender}
- Roots: ${input.regionalRoots?.join(', ') || 'Indian/Global'}
- Starts with: ${input.startingLetters || 'any'}
- Inspirations: ${input.inspirations?.join(', ') || 'any'}
Return JSON array with up to 10 objects (name, meaning, pronunciation, origin, category, gender ("boy"|"girl"|"neutral"), gradient).`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
    }),
  });

  if (!response.ok) throw new Error(`Gemini status ${response.status}`);
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = JSON.parse(text);
  const list = Array.isArray(parsed) ? parsed : (parsed.names || []);
  return list.slice(0, 10).map((item: any, idx: number) => ({
    name: item.name,
    meaning: item.meaning,
    pronunciation: item.pronunciation || item.name,
    origin: item.origin || 'Sanskrit',
    category: item.category || 'Modern Classic',
    gender: (item.gender === 'boy' || item.gender === 'girl' || item.gender === 'neutral') ? item.gender : 'neutral',
    gradient: item.gradient || getRandomGradient(idx),
  }));
}

export async function generateNames(input: GenerateNamesInput): Promise<GeneratedNameItem[]> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const modelName = process.env.OPENROUTER_MODEL || process.env.LLM_MODEL || 'openai/gpt-4o-mini';

  // 1. Primary engine: OpenRouter with configurable LLM model (default: gpt-4o-mini)
  if (openRouterKey) {
    try {
      return await generateViaOpenRouter(input, openRouterKey, modelName);
    } catch (err) {
      console.warn(`OpenRouter generation with ${modelName} failed:`, err);
    }
  }

  // 2. Secondary engine: Gemini API if GEMINI_API_KEY is present
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
  if (geminiKey) {
    try {
      return await generateViaDirectGemini(input, geminiKey);
    } catch (err) {
      console.warn('Gemini API generation failed:', err);
    }
  }

  throw new Error('No AI API key configured or all AI providers failed.');
}
