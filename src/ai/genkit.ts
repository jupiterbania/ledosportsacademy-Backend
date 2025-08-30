
'use server';
import {genkit} from 'genkit';
import {openAI} from 'genkitx-openai';
import {configureGenkit} from 'genkit/config';

configureGenkit({
  plugins: [openAI({apiKey: process.env.OPENAI_API_KEY})],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export const ai = genkit({
  plugins: [openAI({apiKey: process.env.OPENAI_API_KEY})],
  model: 'openai/gpt-4-turbo',
});
