
'use server';
/**
 * @fileOverview An AI flow for generating images from Pollinations.
 *
 * - generateMedia - A function that handles the media generation process.
 * - MediaGenerationInput - The input type for the generateMedia function.
 * - MediaGenerationOutput - The return type for the generateMedia function.
 */

import { z } from 'zod';

const MediaGenerationInputSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required.'),
  width: z.number().optional(),
  height: z.number().optional(),
});
export type MediaGenerationInput = z.infer<typeof MediaGenerationInputSchema>;

const MediaGenerationOutputSchema = z.object({
    type: z.enum(['image', 'video']),
    url: z.string().url(),
});
export type MediaGenerationOutput = z.infer<typeof MediaGenerationOutputSchema>;


export async function generateMedia(input: MediaGenerationInput): Promise<MediaGenerationOutput> {
    try {
        let url = `https://image.pollinations.ai/prompt/${encodeURIComponent(input.prompt)}`;
        
        const params = new URLSearchParams();
        if (input.width) params.append('width', input.width.toString());
        if (input.height) params.append('height', input.height.toString());
        params.append('nologo', 'true');
        
        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
        
        // Pollinations returns the image directly, so we just return the constructed URL
        // The client side will use this URL as the src of an Image tag.
        return {
            type: 'image',
            url: url,
        };

    } catch(error) {
        console.error("API Error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        throw new Error(`Failed to generate media. ${errorMessage}`);
    }
}
