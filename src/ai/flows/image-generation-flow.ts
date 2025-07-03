'use server';
/**
 * @fileOverview An AI flow for generating images and videos from Replicate.
 *
 * - generateMedia - A function that handles the media generation process.
 * - MediaGenerationInput - The input type for the generateMedia function.
 * - MediaGenerationOutput - The return type for the generateMedia function.
 */

import { z } from 'zod';
import Replicate from 'replicate';

const MediaGenerationInputSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required.'),
  model: z.string().min(1, 'Model is required.'),
  type: z.enum(['image', 'video']),
  artisticStyle: z.string().optional(),
  aspectRatio: z.string().optional(),
  mood: z.string().optional(),
  lighting: z.string().optional(),
  colorPalette: z.string().optional(),
  quality: z.string().optional(),
});
export type MediaGenerationInput = z.infer<typeof MediaGenerationInputSchema>;

const MediaGenerationOutputSchema = z.object({
    type: z.enum(['image', 'video']),
    url: z.string().url(),
});
export type MediaGenerationOutput = z.infer<typeof MediaGenerationOutputSchema>;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export async function generateMedia(input: MediaGenerationInput): Promise<MediaGenerationOutput> {
    try {
        const creativeModifiers = [
            input.artisticStyle,
            input.mood,
            input.lighting,
            input.colorPalette,
            input.aspectRatio,
            input.quality,
        ]
        .filter(Boolean)
        .filter(val => val !== 'Default')
        .join(', ');

        const fullPrompt = creativeModifiers 
            ? `${input.prompt}, in a ${creativeModifiers} style`
            : input.prompt;

        const output = await replicate.run(input.model as `${string}/${string}:${string}`, {
          input: {
            prompt: fullPrompt,
          }
        });
        
        if (!output || !Array.isArray(output) || output.length === 0) {
            throw new Error('No output from Replicate model.');
        }

        return {
            type: input.type,
            url: output[0],
        };

    } catch(error) {
        console.error("Replicate API Error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        throw new Error(`Failed to generate media. ${errorMessage}`);
    }
}
