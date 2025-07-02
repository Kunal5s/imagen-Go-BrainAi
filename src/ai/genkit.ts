'use server';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-ai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY,
    }),
  ],
  logLevel: 'warn', // Use 'debug' for more verbose logging
  enableTracing: true,
});
