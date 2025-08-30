
'use server';
import {genkit, configureGenkit} from 'genkit';
import {openAI} from 'genkitx-openai';

configureGenkit({
  plugins: [openAI({apiKey: process.env.OPENAI_API_KEY})],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export const ai = genkit({
  plugins: [openAI({apiKey: process.env.OPENAI_API_KEY})],
  model: 'openai/gpt-4-turbo',
});
