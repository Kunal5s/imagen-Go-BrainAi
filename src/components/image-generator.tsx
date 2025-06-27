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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Sparkles, Wand2, Aperture, Ratio, Smile, Sun, Palette, Medal, Loader2, Star, AlertTriangle, Download, Cpu } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { generateImages } from "@/ai/flows/image-generation-flow";
import { useUserPlan } from '@/context/user-plan-context';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required.'),
  model: z.string(),
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
  const [downloading, setDownloading] = useState<string | null>(null);
  const { user, totalGoogleImagenCredits, totalPollinationsCredits, getCreditCost, deductCredits, activePlan, openPlanModal, isLoginLocked } = useUserPlan();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: 'A majestic lion wearing a crown, sitting on a throne in a cosmic library.',
      model: 'google-imagen',
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
  const modelValue = watch('model') as 'google-imagen' | 'pollinations';
  const aspectRatioValue = watch('aspectRatio');
  const creditCost = getCreditCost(qualityValue, modelValue);
  
  const hasSufficientCredits = modelValue === 'google-imagen' 
    ? totalGoogleImagenCredits >= creditCost 
    : totalPollinationsCredits >= creditCost;

  useEffect(() => {
    if (modelValue === 'google-imagen') {
        if (activePlan.name === 'Mega') {
            setValue('quality', 'uhd');
        } else if (activePlan.name === 'Pro') {
            setValue('quality', 'hd');
        } else {
            setValue('quality', 'standard');
        }
    }
  }, [activePlan, setValue, modelValue]);

  const onSubmit = async (values: FormValues) => {
    if (!user) {
        toast({
            title: "Login Required",
            description: "Please log in to generate images.",
            variant: "destructive"
        });
        openPlanModal();
        return;
    }

    if (isLoginLocked) {
        toast({
            title: "Free Account Limit Reached",
            description: "You have logged in too many times with this free account. Please upgrade to a paid plan.",
            variant: "destructive"
        });
        openPlanModal();
        return;
    }

    if (!hasSufficientCredits) {
        toast({
            title: "Insufficient Credits",
            description: `You don't have enough credits for the ${modelValue === 'google-imagen' ? 'Google Imagen 3' : 'Pollinations'} model. Please upgrade your plan.`,
            variant: "destructive"
        });
        return;
    }

    setIsLoading(true);
    setGeneratedImages([]);
    
    try {
      const result = await generateImages(values);
      setGeneratedImages(result);
      deductCredits(creditCost, values.model as 'google-imagen' | 'pollinations');
      toast({
          title: "Success!",
          description: `${creditCost} ${values.model === 'google-imagen' ? 'Google Imagen 3' : 'Pollinations'} credits were deducted.`,
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
  
  const handleDownload = async (url: string, filename: string) => {
    if (downloading) return;
    setDownloading(url);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Download Failed",
        description: "Could not download the image directly. Please try right-clicking to save it.",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };
  
  const aspectRatioClass = getAspectRatioClass(aspectRatioValue);

  const isGenerateDisabled = isLoading || !hasSufficientCredits || isLoginLocked;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Controls Column */}
      <div className="lg:col-span-4 xl:col-span-3">
        <Card className="sticky top-24 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Generation Settings</CardTitle>
                <CardDescription>Fine-tune your creation.</CardDescription>
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
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField control={form.control} name="model" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-semibold flex items-center gap-2"><Cpu className="h-5 w-5 text-primary" /> Model</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="google-imagen">Google Imagen 3 (Best Quality)</SelectItem>
                                <SelectItem value="pollinations">Pollinations (Alternative)</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} />

                <div className="space-y-4">
                  <Label className="font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Creative Controls
                  </Label>
                  <div className="grid grid-cols-1 gap-4">
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
                              disabled={modelValue === 'pollinations' || activePlan.tier < 2}
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
                </div>

              </CardContent>
              <CardFooter className="flex-col items-stretch gap-4">
                  <div className='text-center'>
                      <p className="font-bold text-lg">
                          {creditCost} Credits
                      </p>
                      <p className="text-xs text-muted-foreground">
                         Cost for {IMAGES_PER_GENERATION} images with {modelValue === 'google-imagen' ? 'Google Imagen 3' : 'Pollinations'}
                      </p>
                  </div>
                <Button type="submit" disabled={isGenerateDisabled} size="lg">
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
      </div>

      {/* Results Column */}
      <div className="lg:col-span-8 xl:col-span-9">
        <Card className="min-h-[calc(100vh-10rem)] flex items-center justify-center border-dashed bg-secondary/50 p-4">
          <div className="text-center w-full">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="h-16 w-16 mb-4 animate-spin" />
                    <p className="font-semibold">Generating your images...</p>
                    <p className="text-sm">This may take a few moments.</p>
                </div>
            ) : generatedImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {generatedImages.map((src, index) => {
                  const isDownloadingThis = downloading === src;
                  const filename = `imagen-go-brainai-${form.getValues('prompt').replace(/\s+/g, '-').toLowerCase().slice(0, 20)}-${index + 1}.png`;
                  return (
                    <div 
                      key={index}
                      onClick={() => !isDownloadingThis && handleDownload(src, filename)}
                      className={cn(
                        "block rounded-lg overflow-hidden group relative shadow-md",
                        isDownloadingThis ? 'cursor-wait' : 'cursor-pointer',
                        aspectRatioClass
                      )}
                      title="Click to download"
                    >
                      <Image 
                        src={src} 
                        alt={`Generated image ${index + 1}`} 
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
                        className="object-cover group-hover:opacity-80 transition-opacity" 
                        data-ai-hint={form.getValues('prompt').split(' ').slice(0, 2).join(' ')}
                        unoptimized={modelValue === 'pollinations'}
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {isDownloadingThis ? (
                          <Loader2 className="h-12 w-12 text-white animate-spin" />
                        ) : (
                          <Download className="h-12 w-12 text-white" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
               <div className="flex flex-col items-center justify-center text-muted-foreground p-8">
                {!user ? (
                   <>
                      <ImageIcon className="h-16 w-16 mb-4" />
                      <p className="font-semibold text-lg">Login to start creating.</p>
                      <p className="text-sm max-w-xs">Please log in to generate images.</p>
                      <Button onClick={openPlanModal} className="mt-4">Login</Button>
                   </>
                ) : isLoginLocked ? (
                  <>
                    <AlertTriangle className="h-16 w-16 mb-4 text-destructive" />
                    <p className="font-semibold text-lg">Free Account Limit Reached</p>
                    <p className="text-sm max-w-xs">You have logged in with this free account too many times. Please upgrade your plan to continue generating.</p>
                    <Button onClick={() => { const pricing = document.getElementById('pricing'); pricing?.scrollIntoView({behavior: 'smooth'}); }} className="mt-4">Upgrade Plan</Button>
                  </>
                ) : !hasSufficientCredits ? (
                  <>
                    <AlertTriangle className="h-16 w-16 mb-4 text-destructive" />
                    <p className="font-semibold text-lg">You don't have enough credits.</p>
                    <p className="text-sm max-w-xs">
                        Your current balance for the selected model is not enough for this generation. Please upgrade or buy a booster pack.
                    </p>
                    <Button onClick={() => { const pricing = document.getElementById('pricing'); pricing?.scrollIntoView({behavior: 'smooth'}); }} className="mt-4">Upgrade Plan</Button>
                  </>
                ) : (
                  <>
                      <ImageIcon className="h-16 w-16 mb-4" />
                      <p className="font-semibold text-lg">Your generated images will appear here.</p>
                      <p className="text-sm max-w-xs">Enter a prompt and adjust your settings to begin.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
