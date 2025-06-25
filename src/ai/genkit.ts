import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: 'AIzaSyAqzB8Iy4YSdURqL3Sq7osoRq4wv-m_kus',
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
