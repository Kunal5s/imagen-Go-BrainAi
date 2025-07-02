'use server';
/**
 * @fileOverview An AI flow for generating images and videos using Replicate.
 *
 * - generateMedia - A function that handles the media generation process.
 * - MediaGenerationInput - The input type for the generateMedia function.
 * - MediaGenerationOutput - The return type for the generateMedia function.
 */

import Replicate from 'replicate';
import { z } from 'zod';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

const MediaGenerationInputSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required.'),
  model: z.string().min(1, 'Model is required.'),
});
export type MediaGenerationInput = z.infer<typeof MediaGenerationInputSchema>;

const MediaGenerationOutputSchema = z.object({
    type: z.enum(['image', 'video']),
    url: z.string().url(),
});
export type MediaGenerationOutput = z.infer<typeof MediaGenerationOutputSchema>;

// A map to determine if a model is a video model
const videoModels = new Set([
    'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172638',
    'anotherjesse/zeroscope-v2-xl:71996d331e8ede8ef7bd76eba9fae076d31792e4ddf4ad057779b443d6aea62f',
    'lucataco/animate-diff-sdxl:b6182a4d34f0a9e22472b86370258163f4a05f15d3159042b0051e59273c524b',
    'deforum/deforum_api:0621e21b0e004481b213c6baf538a502c30b135b1c5c644c9b914a8f94950b73',
    'cjwbw/modelscope-t2v:8153b527fa6a37fb33418c322b7d43b2f5c229712128711818274a7b458b9f71'
]);


export async function generateMedia(input: MediaGenerationInput): Promise<MediaGenerationOutput> {
    try {
        console.log(`Generating with model: ${input.model}`);
        const output = await replicate.run(input.model as `${string}/${string}:${string}`, {
            input: {
                prompt: input.prompt,
            },
        });
        
        console.log('Received output from Replicate:', output);

        if (!output || (Array.isArray(output) && output.length === 0) || typeof output[0] !== 'string') {
            throw new Error('Invalid output received from Replicate API.');
        }

        const mediaUrl = Array.isArray(output) ? output[0] : String(output);
        const mediaType = videoModels.has(input.model) ? 'video' : 'image';

        return {
            type: mediaType,
            url: mediaUrl,
        };

    } catch(error) {
        console.error("Replicate API Error:", error);
        throw new Error("Failed to generate media. The model may have failed or an API error occurred.");
    }
}
