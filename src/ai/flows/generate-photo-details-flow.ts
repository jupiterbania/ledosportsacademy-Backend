
'use server';
/**
 * @fileOverview An AI flow for generating a title and description from a topic.
 *
 * - enhanceText - A function that takes a topic and uses AI to generate a title and description.
 * - EnhanceTextInput - The input type for the function.
 * - EnhanceTextOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'zod';

const EnhanceTextInputSchema = z.object({
  topic: z
    .string()
    .describe(
      "The user-provided topic to generate a title and description from."
    ),
  context: z.enum(['gallery', 'event', 'achievement']).default('gallery'),
});
export type EnhanceTextInput = z.infer<typeof EnhanceTextInputSchema>;

const EnhanceTextOutputSchema = z.object({
  title: z.string().describe('A creative and engaging title based on the topic.'),
  description: z.string().describe('A compelling, one-paragraph description based on the topic.'),
});
export type EnhanceTextOutput = z.infer<typeof EnhanceTextOutputSchema>;


/**
 * Generates a title and description using a generative AI model.
 * @param input The input object containing the topic.
 * @returns A promise that resolves to the generated title and description.
 */
export async function enhanceText(input: EnhanceTextInput): Promise<EnhanceTextOutput> {
  return enhanceTextFlow(input);
}

const buildPrompt = (input: EnhanceTextInput): string => {
  const contextPrompts = {
      gallery: "You are an expert in creative writing for a sports club's photo gallery.",
      event: "You are an expert in creative writing for a sports club's event announcements.",
      achievement: "You are an expert in creative writing for a sports club's achievements.",
  }
  
  return `
    ${contextPrompts[input.context]}
    Your task is to take the user-provided topic and generate an engaging, professional, and exciting title and description.
    Do not analyze or refer to any image. Do not use markdown.
    
    Topic: ${input.topic}
  `;
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
