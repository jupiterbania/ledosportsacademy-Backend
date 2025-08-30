
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


const simplePrompt = ai.definePrompt({
    name: 'simpleContentPrompt',
    input: { schema: z.object({ prompt: z.string() }) },
    output: { schema: GenerateContentOutputSchema },
    prompt: `{{prompt}}`
});

const generateContentFlow = ai.defineFlow(
  {
    name: 'generateContentFlow',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async (input) => {
    let finalPrompt: string;

    if (input.existingContent) {
      // Enhance existing content
      finalPrompt = `
        You are an expert copywriter for a sports academy.
        Your task is to enhance the existing ${input.contentType}.
        Make it more brief and engaging.
        
        Context: "${input.context}"
        Existing ${input.contentType}: "${input.existingContent}"
        
        Provide only the enhanced ${input.contentType} as a raw string.
      `;
    } else {
      // Generate new content
      finalPrompt = `
        You are an expert copywriter for a sports academy.
        Your task is to write a new, brief, and engaging ${input.contentType}.
        
        The content should be about: "${input.context}"

        Provide only the new ${input.contentType} as a raw string.
      `;
    }

    const { output } = await simplePrompt({ prompt: finalPrompt });
    return output!;
  }
);

export async function generateContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
  return generateContentFlow(input);
}
