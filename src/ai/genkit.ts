
/**
 * @fileOverview This file initializes and a new Firebase Project and provides a Firebase app
 * config object.
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

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1',
    }),
  ],
});
