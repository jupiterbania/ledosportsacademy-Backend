
'use server';
/**
 * @fileOverview An AI flow for enhancing a user-provided title and description.
 *
 * - enhanceText - A function that takes a title and description and uses AI to improve them.
 * - EnhanceTextInput - The input type for the function.
 * - EnhanceTextOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const EnhanceTextInputSchema = z.object({
  title: z
    .string()
    .describe(
      "The user-provided title to be enhanced. Can be an empty string if only description is provided."
    ),
  description: z
    .string()
    .describe(
        "The user-provided description to be enhanced. Can be an empty string if only title is provided."
    ),
  context: z.enum(['gallery', 'event']).optional().default('gallery').describe("The context for which the details are being generated, e.g., 'gallery' or 'event'.")
});
export type EnhanceTextInput = z.infer<typeof EnhanceTextInputSchema>;

const EnhanceTextOutputSchema = z.object({
  title: z.string().describe('A creative and engaging title, improved from the user\'s input.'),
  description: z.string().describe('A compelling, one-paragraph description, improved from the user\'s input.'),
});
export type EnhanceTextOutput = z.infer<typeof EnhanceTextOutputSchema>;


/**
 * Enhances a title and description using a generative AI model.
 * @param input The input object containing the text to be enhanced.
 * @returns A promise that resolves to the enhanced title and description.
 */
export async function enhanceText(input: EnhanceTextInput): Promise<EnhanceTextOutput> {
  return enhanceTextFlow(input);
}


const prompt = ai.definePrompt({
  name: 'enhanceTextPrompt',
  model: 'googleai/gemini-1.5-flash-preview',
  input: {schema: EnhanceTextInputSchema},
  output: {schema: EnhanceTextOutputSchema},
  prompt: `You are an expert in creative writing for a sports club. 
  Your task is to take the user-provided title and/or description and make them more engaging, professional, and exciting.
  You should only use the text provided. Do not analyze or refer to any image.

  Here is the user's draft:
  {{#if title}}
  Title: {{{title}}}
  {{/if}}
  {{#if description}}
  Description: {{{description}}}
  {{/if}}

  {{#ifCond context "==" "gallery"}}
  Rewrite the provided text with a tone that is engaging and appropriate for a photo gallery caption. If a field is empty, generate a suitable value for it based on the provided field.
  {{/ifCond}}

  {{#ifCond context "==" "event"}}
  Rewrite the provided text with a tone that is exciting and inviting, suitable for promoting an upcoming event. If a field is empty, generate a suitable value for it based on the provided field.
  {{/ifCond}}
  
  Do not just repeat the user's text. Enhance it significantly. If a field was empty, create a compelling new version for it.`,
});


const enhanceTextFlow = ai.defineFlow(
  {
    name: 'enhanceTextFlow',
    inputSchema: EnhanceTextInputSchema,
    outputSchema: EnhanceTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The AI model did not return the expected output.");
    }
    return output;
  }
);
