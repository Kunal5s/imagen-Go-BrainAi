'use server';
/**
 * @fileOverview An AI flow for generating images based on a user's prompt and creative settings.
 *
 * - generateImages - A function that handles the image generation process.
 * - ImageGenerationInput - The input type for the generateImages function.
 * - ImageGenerationOutput - The return type for the generateImages function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ImageGenerationInputSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required.'),
  artisticStyle: z.string(),
  aspectRatio: z.string(),
  mood: z.string(),
  lighting: z.string(),
  colorPalette: z.string(),
  quality: z.string(),
});
export type ImageGenerationInput = z.infer<typeof ImageGenerationInputSchema>;

// The output will be an array of 5 image data URIs (strings)
const ImageGenerationOutputSchema = z.array(z.string());
export type ImageGenerationOutput = z.infer<typeof ImageGenerationOutputSchema>;


export async function generateImages(input: ImageGenerationInput): Promise<ImageGenerationOutput> {
  return generateImagesFlow(input);
}

const generateImagesFlow = ai.defineFlow(
  {
    name: 'generateImagesFlow',
    inputSchema: ImageGenerationInputSchema,
    outputSchema: ImageGenerationOutputSchema,
  },
  async (input) => {
    // Construct a more effective, comma-separated prompt for the image generation model.
    const promptParts = [
      input.prompt,
      input.artisticStyle,
      input.mood,
      input.lighting,
    ];

    if (input.colorPalette && input.colorPalette !== 'default') {
      promptParts.push(input.colorPalette);
    }

    // Add quality keywords based on the selected plan
    switch (input.quality) {
      case 'hd':
        promptParts.push('high quality');
        promptParts.push('detailed');
        break;
      case 'uhd':
        promptParts.push('ultra high quality');
        promptParts.push('4K resolution');
        promptParts.push('photorealistic');
        promptParts.push('hyper-detailed');
        break;
      default:
        // Standard quality needs no extra keywords
        break;
    }

    // The model should understand aspect ratio from text.
    promptParts.push(input.aspectRatio);

    const fullPrompt = promptParts.filter(Boolean).join(', ');
    
    // Generate 5 images in parallel
    const imagePromises = Array(5).fill(null).map(() => 
      ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: fullPrompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
           safetySettings: [
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_NONE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        },
      })
    );

    const results = await Promise.all(imagePromises);
    
    const imageUrls = results.map(result => {
        if (!result.media || !result.media.url) {
            throw new Error('Image generation failed to return a valid image.');
        }
        return result.media.url;
    });

    return imageUrls;
  }
);
