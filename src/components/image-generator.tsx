"use client"

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Image as ImageIcon, Sparkles, Wand2, Aperture, Ratio, Smile, Sun, Palette, Medal, Loader2, Star, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { generateImages } from "@/ai/flows/image-generation-flow";
import { useUserPlan } from '@/context/user-plan-context';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required.'),
  artisticStyle: z.string(),
  aspectRatio: z.string(),
  mood: z.string(),
  lighting: z.string(),
  colorPalette: z.string(),
  quality: z.string(),
});

type FormValues = z.infer<typeof formSchema>;
const IMAGES_PER_GENERATION = 5;

const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
        case 'square': return 'aspect-square';
        case 'portrait': return 'aspect-[9/16]';
        case 'landscape': return 'aspect-[16/9]';
        case 'widescreen': return 'aspect-[21/9]';
        case 'ultrawide': return 'aspect-[32/9]';
        case 'photo-portrait': return 'aspect-[4/5]';
        case 'photo-landscape': return 'aspect-[3/2]';
        case 'cinema-scope': return 'aspect-[2.39/1]';
        case 'mobile-vertical': return 'aspect-[4/5]';
        case 'desktop-wallpaper': return 'aspect-[16/10]';
        case 'a4-paper': return 'aspect-[1/1.41]';
        case 'instagram-story': return 'aspect-[9/16]';
        case 'facebook-post': return 'aspect-[1.91/1]';
        case 'twitter-post': return 'aspect-[16/9]';
        case 'pinterest-pin': return 'aspect-[2/3]';
        default: return 'aspect-square';
    }
};


export default function ImageGenerator() {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, totalCredits, getCreditCost, deductCredits, activePlan, openPlanModal } = useUserPlan();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: 'A majestic lion wearing a crown, sitting on a throne in a cosmic library.',
      artisticStyle: 'photographic',
      aspectRatio: 'square',
      mood: 'mysterious',
      lighting: 'cinematic',
      colorPalette: 'default',
      quality: 'standard',
    },
  });

  const { setValue, watch } = form;
  const qualityValue = watch('quality');
  const aspectRatioValue = watch('aspectRatio');
  const creditCost = getCreditCost(qualityValue) * IMAGES_PER_GENERATION;
  const hasSufficientCredits = totalCredits >= creditCost;

  useEffect(() => {
    // Automatically set quality based on the highest available plan
    if (activePlan.name === 'Mega') {
      setValue('quality', 'uhd');
    } else if (activePlan.name === 'Pro') {
      setValue('quality', 'hd');
    } else {
      setValue('quality', 'standard');
    }
  }, [activePlan, setValue]);

  const onSubmit = async (values: FormValues) => {
    if (!user) {
        toast({
            title: "Login Required",
            description: "Please log in to start generating images.",
            variant: "destructive"
        });
        openPlanModal();
        return;
    }

    if (!hasSufficientCredits) {
        toast({
            title: "Insufficient Credits",
            description: "You don't have enough credits for this generation. Please upgrade your plan.",
            variant: "destructive"
        });
        return;
    }

    setIsLoading(true);
    setGeneratedImages([]);
    
    try {
      const result = await generateImages(values);
      setGeneratedImages(result);
      deductCredits(creditCost);
      toast({
        title: "Success!",
        description: `${creditCost} credits were deducted from your account.`,
      });
    } catch (error) {
      console.error("Image generation failed:", error);
      toast({
        title: "Error Generating Images",
        description: "The AI was unable to generate images for this prompt. This can happen due to safety filters or other issues. Please try a different prompt.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const aspectRatioClass = getAspectRatioClass(aspectRatioValue);

  return (
    <div className="space-y-8 my-12">
      <Card className="overflow-hidden shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
                <CardTitle>Image Generation Studio</CardTitle>
                <CardDescription>Describe the image you want to create, and our AI will bring it to life.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Your Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A majestic lion wearing a crown, sitting on a throne in a cosmic library."
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Creative Tools
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="artisticStyle" render={({ field }) => (
                          <FormItem>
                              <FormLabel className="flex items-center gap-2 text-xs text-muted-foreground"><Aperture className="h-4 w-4" /> Artistic Style</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                  <SelectContent>
                                      <SelectItem value="photographic">Photographic</SelectItem>
                                      <SelectItem value="cinematic">Cinematic</SelectItem>
                                      <SelectItem value="anime">Anime</SelectItem>
                                      <SelectItem value="fantasy">Fantasy Art</SelectItem>
                                      <SelectItem value="3d">3D Render</SelectItem>
                                      <SelectItem value="comic-book">Comic Book</SelectItem>
                                      <SelectItem value="watercolor">Watercolor</SelectItem>
                                      <SelectItem value="line-art">Line Art</SelectItem>
                                      <SelectItem value="isometric">Isometric</SelectItem>
                                      <SelectItem value="pixel-art">Pixel Art</SelectItem>
                                      <SelectItem value="surrealism">Surrealism</SelectItem>
                                      <SelectItem value="minimalism">Minimalism</SelectItem>
                                      <SelectItem value="impressionism">Impressionism</SelectItem>
                                      <SelectItem value="expressionism">Expressionism</SelectItem>
                                      <SelectItem value="steampunk">Steampunk</SelectItem>
                                      <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                                      <SelectItem value="pop-art">Pop Art</SelectItem>
                                      <SelectItem value="art-nouveau">Art Nouveau</SelectItem>
                                      <SelectItem value="graffiti">Graffiti</SelectItem>
                                      <SelectItem value="claymation">Claymation</SelectItem>
                                  </SelectContent>
                              </Select>
                          </FormItem>
                      )} />
                      <FormField control={form.control} name="aspectRatio" render={({ field }) => (
                          <FormItem>
                              <FormLabel className="flex items-center gap-2 text-xs text-muted-foreground"><Ratio className="h-4 w-4" /> Aspect Ratio</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                  <SelectContent>
                                      <SelectItem value="square">Square (1:1)</SelectItem>
                                      <SelectItem value="portrait">Portrait (9:16)</SelectItem>
                                      <SelectItem value="landscape">Landscape (16:9)</SelectItem>
                                      <SelectItem value="widescreen">Widescreen (21:9)</SelectItem>
                                      <SelectItem value="ultrawide">Ultrawide (32:9)</SelectItem>
                                      <SelectItem value="photo-portrait">Photo Portrait (4:5)</SelectItem>
                                      <SelectItem value="photo-landscape">Photo Landscape (3:2)</SelectItem>
                                      <SelectItem value="cinema-scope">CinemaScope (2.39:1)</SelectItem>
                                      <SelectItem value="mobile-vertical">Mobile Vertical (4:5)</SelectItem>
                                      <SelectItem value="desktop-wallpaper">Desktop Wallpaper (16:10)</SelectItem>
                                      <SelectItem value="a4-paper">A4 Paper</SelectItem>
                                      <SelectItem value="instagram-story">Instagram Story (9:16)</SelectItem>
                                      <SelectItem value="facebook-post">Facebook Post (1.91:1)</SelectItem>
                                      <SelectItem value="twitter-post">Twitter Post (16:9)</SelectItem>
                                      <SelectItem value="pinterest-pin">Pinterest Pin (2:3)</SelectItem>
                                  </SelectContent>
                              </Select>
                          </FormItem>
                      )} />
                      <FormField control={form.control} name="mood" render={({ field }) => (
                          <FormItem>
                              <FormLabel className="flex items-center gap-2 text-xs text-muted-foreground"><Smile className="h-4 w-4" /> Mood</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                  <SelectContent>
                                      <SelectItem value="mysterious">Mysterious</SelectItem>
                                      <SelectItem value="happy">Happy</SelectItem>
                                      <SelectItem value="dramatic">Dramatic</SelectItem>
                                      <SelectItem value="calm">Calm</SelectItem>
                                      <SelectItem value="energetic">Energetic</SelectItem>
                                      <SelectItem value="romantic">Romantic</SelectItem>
                                      <SelectItem value="somber">Somber</SelectItem>
                                      <SelectItem value="whimsical">Whimsical</SelectItem>
                                      <SelectItem value="eerie">Eerie</SelectItem>
                                      <SelectItem value="powerful">Powerful</SelectItem>
                                      <SelectItem value="nostalgic">Nostalgic</SelectItem>
                                      <SelectItem value="dreamy">Dreamy</SelectItem>
                                      <SelectItem value="chaotic">Chaotic</SelectItem>
                                      <SelectItem value="peaceful">Peaceful</SelectItem>
                                      <SelectItem value="playful">Playful</SelectItem>
                                      <SelectItem value="melancholic">Melancholic</SelectItem>
                                      <SelectItem value="opulent">Opulent</SelectItem>
                                      <SelectItem value="futuristic">Futuristic</SelectItem>
                                      <SelectItem value="rustic">Rustic</SelectItem>
                                      <SelectItem value="serene">Serene</SelectItem>
                                  </SelectContent>
                              </Select>
                          </FormItem>
                      )} />
                      <FormField control={form.control} name="lighting" render={({ field }) => (
                          <FormItem>
                              <FormLabel className="flex items-center gap-2 text-xs text-muted-foreground"><Sun className="h-4 w-4" /> Lighting</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                  <SelectContent>
                                      <SelectItem value="cinematic">Cinematic</SelectItem>
                                      <SelectItem value="natural">Natural</SelectItem>
                                      <SelectItem value="studio">Studio</SelectItem>
                                      <SelectItem value="dramatic">Dramatic</SelectItem>
                                      <SelectItem value="soft">Soft</SelectItem>
                                      <SelectItem value="hard">Hard</SelectItem>
                                      <SelectItem value="backlight">Backlight</SelectItem>
                                      <SelectItem value="golden-hour">Golden Hour</SelectItem>
                                      <SelectItem value="neon">Neon</SelectItem>
                                      <SelectItem value="moonlight">Moonlight</SelectItem>
                                      <SelectItem value="ambient">Ambient</SelectItem>
                                      <SelectItem value="rim-lighting">Rim Lighting</SelectItem>
                                      <SelectItem value="volumetric">Volumetric</SelectItem>
                                      <SelectItem value="low-key">Low-key</SelectItem>
                                      <SelectItem value="high-key">High-key</SelectItem>
                                      <SelectItem value="underwater">Underwater</SelectItem>
                                      <SelectItem value="spotlight">Spotlight</SelectItem>
                                      <SelectItem value="candlelight">Candlelight</SelectItem>
                                      <SelectItem value="bioluminescent">Bioluminescent</SelectItem>
                                      <SelectItem value="firelight">Firelight</SelectItem>
                                  </SelectContent>
                              </Select>
                          </FormItem>
                      )} />
                      <FormField control={form.control} name="colorPalette" render={({ field }) => (
                          <FormItem>
                              <FormLabel className="flex items-center gap-2 text-xs text-muted-foreground"><Palette className="h-4 w-4" /> Color Palette</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                  <SelectContent>
                                      <SelectItem value="default">Default</SelectItem>
                                      <SelectItem value="vibrant">Vibrant</SelectItem>
                                      <SelectItem value="monochrome">Monochrome</SelectItem>
                                      <SelectItem value="pastel">Pastel</SelectItem>
                                      <SelectItem value="earth-tones">Earth Tones</SelectItem>
                                      <SelectItem value="jewel-tones">Jewel Tones</SelectItem>
                                      <SelectItem value="cool">Cool</SelectItem>
                                      <SelectItem value="warm">Warm</SelectItem>
                                      <SelectItem value="sepia">Sepia</SelectItem>
                                      <SelectItem value="inverted">Inverted</SelectItem>
                                      <SelectItem value="technicolor">Technicolor</SelectItem>
                                      <SelectItem value="gradient">Gradient</SelectItem>
                                      <SelectItem value="neon-noir">Neon Noir</SelectItem>
                                      <SelectItem value="cyber-glow">Cyber Glow</SelectItem>
                                      <SelectItem value="muted-tones">Muted Tones</SelectItem>
                                      <SelectItem value="high-contrast">High Contrast</SelectItem>
                                      <SelectItem value="solarized">Solarized</SelectItem>
                                      <SelectItem value="vintage">Vintage</SelectItem>
                                      <SelectItem value="triadic">Triadic</SelectItem>
                                      <SelectItem value="analogous">Analogous</SelectItem>
                                  </SelectContent>
                              </Select>
                          </FormItem>
                      )} />
                      <FormField control={form.control} name="quality" render={({ field }) => (
                          <FormItem>
                              <FormLabel className="flex items-center gap-2 text-xs text-muted-foreground"><Medal className="h-4 w-4" /> Quality</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value} 
                                disabled={activePlan.name === 'Free' || activePlan.name === 'Booster Pack'}
                              >
                                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                  <SelectContent>
                                      <SelectItem value="standard">Standard (1080p)</SelectItem>
                                      <SelectItem value="hd" disabled={activePlan.tier < 2}>HD (2K)</SelectItem>
                                      <SelectItem value="uhd" disabled={activePlan.tier < 3}>Ultra HD (4K)</SelectItem>
                                  </SelectContent>
                              </Select>
                          </FormItem>
                      )} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex-col sm:flex-row justify-between items-center bg-muted/50 p-4">
                <div className='text-center sm:text-left mb-4 sm:mb-0'>
                    <p className="font-bold text-lg">
                        {creditCost} Credits
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Cost for {IMAGES_PER_GENERATION} images at {qualityValue} quality
                    </p>
                </div>
              <Button type="submit" disabled={isLoading || !hasSufficientCredits} size="lg">
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Generating...' : `Generate ${IMAGES_PER_GENERATION} Images`}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <Card className="min-h-[400px] flex items-center justify-center border-dashed bg-card">
        <CardContent className="text-center p-6 w-full">
          {isLoading ? (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="h-16 w-16 mb-4 animate-spin" />
                  <p className="font-semibold">Generating your images...</p>
                  <p className="text-sm">This may take a few moments.</p>
              </div>
          ) : generatedImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {generatedImages.map((src, index) => (
                <a 
                  key={index}
                  href={src}
                  download={`imagen-go-${form.getValues('prompt').replace(/\s+/g, '-').toLowerCase().slice(0, 20)}-${index + 1}.png`}
                  className={cn(
                    "block rounded-lg overflow-hidden group relative",
                    aspectRatioClass
                  )}
                  title="Click to download"
                >
                  <Image 
                    src={src} 
                    alt={`Generated image ${index + 1}`} 
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    className="rounded-lg object-cover group-hover:opacity-80 transition-opacity" 
                    data-ai-hint={form.getValues('prompt').split(' ').slice(0, 2).join(' ')} 
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  </div>
                </a>
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center text-muted-foreground">
              {!user ? (
                 <>
                    <ImageIcon className="h-16 w-16 mb-4" />
                    <p className="font-semibold">Login to start creating.</p>
                    <p className="text-sm">Please log in to generate images and use your credits.</p>
                    <Button onClick={openPlanModal} className="mt-4">Login</Button>
                 </>
              ) : !hasSufficientCredits ? (
                <>
                  <AlertTriangle className="h-16 w-16 mb-4 text-destructive" />
                  <p className="font-semibold text-lg">You don't have enough credits.</p>
                  <p className="text-sm max-w-xs">Your current balance is {totalCredits}, but this generation costs {creditCost}. Please upgrade your plan to continue.</p>
                  <Button onClick={() => { const pricing = document.getElementById('pricing'); pricing?.scrollIntoView({behavior: 'smooth'}); }} className="mt-4">Upgrade Plan</Button>
                </>
              ) : (
                <>
                    <ImageIcon className="h-16 w-16 mb-4" />
                    <p className="font-semibold">Your generated images will appear here.</p>
                    <p className="text-sm">Enter a prompt above and click "Generate" to begin.</p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
