'use server';
/**
 * @fileOverview A flow for generating and enhancing descriptions.
 *
 * - generateDescription - A function that generates or enhances a description based on a title.
 * - GenerateDescriptionInput - The input type for the generateDescription function.
 * - GenerateDescriptionOutput - The return type for the generateDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the item.'),
  description: z.string().optional().describe('The existing description to enhance. If not provided, a new one will be generated.'),
});
export type GenerateDescriptionInput = z.infer<typeof GenerateDescriptionInputSchema>;

const GenerateDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated or enhanced description.'),
});
export type GenerateDescriptionOutput = z.infer<typeof GenerateDescriptionOutputSchema>;


const prompt = ai.definePrompt({
  name: 'generateDescriptionPrompt',
  input: { schema: GenerateDescriptionInputSchema },
  output: { schema: GenerateDescriptionOutputSchema },
  prompt: `
    You are an expert copywriter for a sports academy. 
    Your task is to {{#if description}}enhance the following description{{else}}write a new, brief, and engaging description{{/if}} for an item with the title: "{{title}}".
    The description should be suitable for a public website. Keep it concise and impactful.

    {{#if description}}
    Existing Description:
    "{{{description}}}"
    
    Enhanced Description:
    {{/if}}
  `,
});

const generateDescriptionFlow = ai.defineFlow(
  {
    name: 'generateDescriptionFlow',
    inputSchema: GenerateDescriptionInputSchema,
    outputSchema: GenerateDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function generateDescription(input: GenerateDescriptionInput): Promise<GenerateDescriptionOutput> {
  return generateDescriptionFlow(input);
}
