'use server';

/**
 * @fileOverview Prioritizes name suggestions based on user-provided inspirations.
 *
 * - prioritizeNames - A function that prioritizes a list of names based on the inspiration text.
 * - PrioritizeNamesInput - The input type for the prioritizeNames function.
 * - PrioritizeNamesOutput - The return type for the prioritizeNames function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeNamesInputSchema = z.object({
  names: z.array(z.string()).describe('An array of name suggestions.'),
  inspiration: z.string().describe('User provided inspiration text.'),
});
export type PrioritizeNamesInput = z.infer<typeof PrioritizeNamesInputSchema>;

const PrioritizeNamesOutputSchema = z.array(z.string()).describe('An array of prioritized name suggestions.');
export type PrioritizeNamesOutput = z.infer<typeof PrioritizeNamesOutputSchema>;

export async function prioritizeNames(input: PrioritizeNamesInput): Promise<PrioritizeNamesOutput> {
  return prioritizeNamesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeNamesPrompt',
  input: {schema: PrioritizeNamesInputSchema},
  output: {schema: PrioritizeNamesOutputSchema},
  prompt: `You are an AI that prioritizes a list of names based on the inspiration text provided by the user.

  Given the following list of names:
  {{#each names}}
    - {{this}}
  {{/each}}

  And the following inspiration text:
  {{inspiration}}

  Return the list of names, prioritized such that the names that are most relevant to the inspiration text are listed first. Respond with only the array of names. Do not include any additional text or explanation.
  `,
});

const prioritizeNamesFlow = ai.defineFlow(
  {
    name: 'prioritizeNamesFlow',
    inputSchema: PrioritizeNamesInputSchema,
    outputSchema: PrioritizeNamesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
