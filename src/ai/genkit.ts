
'use server';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {configureGenkit} from 'genkit/config';

configureGenkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  model: 'googleai/gemini-2.0-flash',
});
