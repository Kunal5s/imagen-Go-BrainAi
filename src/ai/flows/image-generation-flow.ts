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
  model: z.string(),
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

const getDimensionsForRatio = (ratio: string): { width: number, height: number } => {
    // Using a common base size for consistency
    switch (ratio) {
        case 'square': return { width: 1024, height: 1024 };
        case 'portrait': return { width: 576, height: 1024 };
        case 'landscape': return { width: 1024, height: 576 };
        case 'widescreen': return { width: 1280, height: 549 };
        case 'ultrawide': return { width: 1280, height: 360 };
        case 'photo-portrait': return { width: 819, height: 1024 };
        case 'photo-landscape': return { width: 1024, height: 683 };
        case 'cinema-scope': return { width: 1280, height: 535 };
        case 'mobile-vertical': return { width: 819, height: 1024 };
        case 'desktop-wallpaper': return { width: 1024, height: 640 };
        case 'a4-paper': return { width: 724, height: 1024 };
        case 'instagram-story': return { width: 576, height: 1024 };
        case 'facebook-post': return { width: 1024, height: 536 };
        case 'twitter-post': return { width: 1024, height: 576 };
        case 'pinterest-pin': return { width: 683, height: 1024 };
        default: return { width: 1024, height: 1024 };
    }
};

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
    
    // The model should understand aspect ratio from text.
    promptParts.push(input.aspectRatio);

    if (input.model === 'pollinations') {
        const fullPrompt = promptParts.filter(Boolean).join(', ');
        const encodedPrompt = encodeURIComponent(fullPrompt);
        const { width, height } = getDimensionsForRatio(input.aspectRatio);

        // Generate 5 images in parallel from Pollinations
        const imageUrls = Array(5).fill(null).map(() => {
            const seed = Math.floor(Math.random() * 1000000); // Add random seed for variation
            return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
        });
        return imageUrls;
    }


    // Default to Google Imagen model
    if (input.model === 'google-imagen') {
        switch (input.quality) {
          case 'hd':
            promptParts.push('high quality');
            promptParts.push('detailed');
            promptParts.push('2K resolution');
            break;
          case 'uhd':
            promptParts.push('ultra high quality');
            promptParts.push('4K resolution');
            promptParts.push('photorealistic');
            promptParts.push('hyper-detailed');
            break;
          default:
            // Standard quality
            promptParts.push('standard definition');
            promptParts.push('1080p');
            break;
        }

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
    
    throw new Error(`Unsupported model: ${input.model}`);
  }
);
