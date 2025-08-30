
'use server';
import {genkit} from 'genkit';
import {openAI} from 'genkitx-openai';

export const ai = genkit({
  plugins: [openAI({apiKey: process.env.OPENAI_API_KEY})],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
  model: 'openai/gpt-4-turbo',
});
