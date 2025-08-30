
'use server';
/**
 * @fileOverview A flow for generating and enhancing text content like titles and descriptions.
 *
 * - generateContent - A function that generates or enhances a title or description.
 * - GenerateContentInput - The input type for the generateContent function.
 * - GenerateContentOutput - The return type for the generateContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateContentInputSchema = z.object({
  contentType: z.enum(['title', 'description']).describe('The type of content to generate or enhance.'),
  context: z.string().describe('The context for the content (e.g., the title if generating a description, or a topic if generating a title).'),
  existingContent: z.string().optional().describe('The existing content to enhance. If not provided, new content will be generated.'),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

const GenerateContentOutputSchema = z.object({
  content: z.string().describe('The generated or enhanced content.'),
});
export type GenerateContentOutput = z.infer<typeof GenerateContentOutputSchema>;


const prompt = ai.definePrompt({
  name: 'generateContentPrompt',
  input: { schema: GenerateContentInputSchema },
  output: { schema: GenerateContentOutputSchema },
  prompt: `
    You are an expert copywriter for a sports academy.
    Your task is to {{#if existingContent}}enhance the existing {{contentType}}{{else}}write a new, brief, and engaging {{contentType}}{{/if}}.
    
    Context: "{{context}}"

    {{#if existingContent}}
    Existing {{contentType}}: "{{{existingContent}}}"
    Enhanced {{contentType}}:
    {{else}}
    New {{contentType}}:
    {{/if}}
  `,
});

const generateContentFlow = ai.defineFlow(
  {
    name: 'generateContentFlow',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function generateContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
  return generateContentFlow(input);
}
