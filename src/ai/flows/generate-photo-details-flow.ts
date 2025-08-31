
'use server';
/**
 * @fileOverview An AI flow for enhancing a user-provided title and description.
 *
 * - enhanceText - A function that takes a title and description and uses AI to improve them.
 * - EnhanceTextInput - The input type for the function.
 * - EnhanceTextOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'zod';

const EnhanceTextInputSchema = z.object({
  topic: z
    .string()
    .optional()
    .describe('A topic or keywords provided by the user to generate a title and description from scratch.'),
  title: z
    .string()
    .optional()
    .describe(
      "The user-provided title to be enhanced. Can be an empty string if only description is provided."
    ),
  description: z
    .string()
    .optional()
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

const buildPrompt = (input: EnhanceTextInput): string => {
  const basePrompt = `You are an expert in creative writing for a sports club.
Your task is to take the user-provided input and generate an engaging, professional, and exciting title and description.
You should only use the text provided. Do not analyze or refer to any image.`;

  const topicPrompt = input.topic 
    ? `The user has provided the following topic. Generate a brand new, compelling title and description based on it.\nTopic: ${input.topic}`
    : `The user has provided the following draft. Enhance the provided text. If a field is empty, generate a suitable value for it based on the field that is provided. Do not just repeat the user's text; improve it significantly.
${input.title ? `Title: ${input.title}` : ''}
${input.description ? `Description: ${input.description}` : ''}`;
  
  const contextPrompt = input.context === 'event'
    ? 'Generate the response with a tone that is exciting and inviting, suitable for promoting an upcoming event.'
    : 'Generate the response with a tone that is engaging and appropriate for a photo gallery caption.';

  return `${basePrompt}\n\n${topicPrompt}\n\n${contextPrompt}`;
}


const enhanceTextFlow = ai.defineFlow(
  {
    name: 'enhanceTextFlow',
    inputSchema: EnhanceTextInputSchema,
    outputSchema: EnhanceTextOutputSchema,
  },
  async input => {
    const promptText = buildPrompt(input);

    const { output } = await ai.generate({
      model: googleAI.model('gemini-pro'),
      prompt: promptText,
      output: {
        format: 'json',
        schema: EnhanceTextOutputSchema,
      },
    });

    if (!output) {
        throw new Error("The AI model did not return the expected output.");
    }
    
    return output;
  }
);


