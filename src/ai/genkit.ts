
'use server';
/**
 * @fileOverview This file initializes and configures the Genkit AI toolkit.
 *
 * It sets up the Google AI plugin, which is necessary for interacting with
 * Google's generative models like Gemini. This centralized setup allows other
 * parts of the application to import and use the configured `ai` object
 * without needing to re-initialize it.
 *
 * The `ai` object is the main entry point for defining and running AI flows.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {genkitEval} from 'genkit/eval';
import {googleCloud} from '@genkit-ai/google-cloud';

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
    googleCloud(),
    genkitEval(),
  ],
  logSinks: ['googlecloud'],
  enableTracingAndMetrics: true,
});
