
'use server';
/**
 * @fileOverview An AI flow for generating a creative title and description for a photo.
 *
 * - generatePhotoDetails - A function that takes a photo URL and uses AI to generate content.
 * - GeneratePhotoDetailsInput - The input type for the function.
 * - GeneratePhotoDetailsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GeneratePhotoDetailsInputSchema = z.object({
  photoUrl: z
    .string()
    .url()
    .describe(
      "The public URL of a photo to generate a title and description for."
    ),
});
export type GeneratePhotoDetailsInput = z.infer<typeof GeneratePhotoDetailsInputSchema>;

const GeneratePhotoDetailsOutputSchema = z.object({
  title: z.string().describe('A creative and engaging title for the photo. Should be concise and descriptive.'),
  description: z.string().describe('A compelling, one-paragraph description for the photo, suitable for a gallery or social media.'),
});
export type GeneratePhotoDetailsOutput = z.infer<typeof GeneratePhotoDetailsOutputSchema>;


/**
 * Generates a title and description for a given photo URL using a generative AI model.
 * @param input The input object containing the photoUrl.
 * @returns A promise that resolves to the generated title and description.
 */
export async function generatePhotoDetails(input: GeneratePhotoDetailsInput): Promise<GeneratePhotoDetailsOutput> {
  return generatePhotoDetailsFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generatePhotoDetailsPrompt',
  model: 'googleai/gemini-1.5-flash-preview',
  input: {schema: GeneratePhotoDetailsInputSchema},
  output: {schema: GeneratePhotoDetailsOutputSchema},
  prompt: `You are an expert in creative writing for photo galleries. 
  Your task is to analyze the provided image and generate a compelling title and a one-paragraph description for it.

  The tone should be engaging and appropriate for a sports club's public gallery.
  
  Generate a creative title and a detailed description for the following image:
  
  Image: {{media url=photoUrl}}`,
});


const generatePhotoDetailsFlow = ai.defineFlow(
  {
    name: 'generatePhotoDetailsFlow',
    inputSchema: GeneratePhotoDetailsInputSchema,
    outputSchema: GeneratePhotoDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The AI model did not return the expected output.");
    }
    return output;
  }
);
