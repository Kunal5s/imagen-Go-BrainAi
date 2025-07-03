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
  FormDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Sparkles, Wand2, Loader2, Download, Video, Palette, Sun, Smile, Camera } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { generateMedia, MediaGenerationOutput } from "@/ai/flows/image-generation-flow";
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const styles = ["Photorealistic", "Anime", "Cartoon", "3D Render", "Pixel Art", "Impressionistic", "Surreal"];
const moods = ["Happy", "Sad", "Calm", "Energetic", "Mysterious", "Romantic"];
const lightings = ["Daylight", "Studio", "Neon", "Sunset", "Backlight", "Dramatic"];
const colors = ["Vibrant", "Monochromatic", "Pastel", "Muted", "Black and White"];
const ratios = [
    { name: '1:1 (Square)', width: 1024, height: 1024 },
    { name: '16:9 (Widescreen)', width: 1024, height: 576 },
    { name: '9:16 (Portrait)', width: 576, height: 1024 },
    { name: '4:3 (Standard)', width: 1024, height: 768 },
    { name: '3:2 (Landscape)', width: 1024, height: 683 },
];

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required.'),
  model: z.string().min(1, 'Please select a model.'),
  style: z.string().optional(),
  mood: z.string().optional(),
  lighting: z.string().optional(),
  color: z.string().optional(),
  ratio: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type GenerationType = 'image' | 'video';

const imageModels = [
    { name: 'Stable Diffusion XL', id: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de79ed883204318ea3862e816de84e2' },
    { name: 'Pollinations Majesty Diffusion', id: 'pollinations/majesty-diffusion-v4:17a73e346f917516104259463c33b2591b65d8364803960305b0b301b44ee2b5' },
    { name: 'Realistic Vision v6.0', id: 'sg161222/realistic-vision-v6.0-b1:5c54964a586c4764491a117376c3395669a85016834033e46c8205423f892857' },
    { name: 'Pollinations Lemon Diffusion', id: 'pollinations/lemon-diffusion:1a63c6753a2283a04297374b3446d3202e8d2e825a2786b5e054454795e1e550'},
    { name: 'DreamShaper v8', id: 'lykon/dreamshaper-8:92209930b2c171e544605f4245701419a43fb6334635173f458e65e495a6397b' },
    { name: 'OpenJourney', id: 'prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a334592a01eb' },
]

const videoModels = [
    { name: 'Zeroscope v2 XL', id: 'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748103455d22b6c4215f93' },
    { name: 'AnimateDiff', id: 'lucataco/animate-diff:beecf59c4aee8d81bf34deacbedae75d9863e44928b341076f6d83393c049845' },
    { name: 'Stable Video Diffusion', id: 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172638'},
]

export default function ImageGenerator() {
  const [generatedMedia, setGeneratedMedia] = useState<MediaGenerationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<GenerationType>('image');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: 'A majestic lion wearing a crown, sitting on a throne in a cosmic library.',
      model: imageModels[0].id,
      style: styles[0],
      mood: moods[0],
      lighting: lightings[0],
      color: colors[0],
      ratio: ratios[0].name,
    },
  });

  useEffect(() => {
    form.setValue('model', generationType === 'image' ? imageModels[0].id : videoModels[0].id)
  }, [generationType, form]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setGeneratedMedia(null);

    let detailedPrompt = values.prompt;
    const creativeParts = [values.style, values.mood, values.lighting, values.color].filter(Boolean);
    if (creativeParts.length > 0) {
      detailedPrompt += `, ${creativeParts.join(', ')}`;
    }
    
    const selectedRatio = ratios.find(r => r.name === values.ratio);

    try {
      const result = await generateMedia({
          prompt: detailedPrompt,
          model: values.model,
          type: generationType,
          width: selectedRatio?.width,
          height: selectedRatio?.height,
      });
      setGeneratedMedia(result);
      toast({
          title: "Success!",
          description: `Your ${generationType} has been generated.`,
      });
    } catch (error) {
      console.error("Media generation failed:", error);
      toast({
        title: "Error Generating Media",
        description: error instanceof Error ? error.message : "An unknown error occurred. Please try a different prompt or model.",
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
        description: "Could not download the media. Please try right-clicking to save it.",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };
  
  const isGenerateDisabled = isLoading;
  const currentModels = generationType === 'image' ? imageModels : videoModels;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Controls Column */}
      <div className="lg:col-span-4 xl:col-span-3">
        <Card className="sticky top-24 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Generation Settings</CardTitle>
                <CardDescription>Describe your vision.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <Tabs value={generationType} onValueChange={(value) => setGenerationType(value as GenerationType)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="image"><ImageIcon className="mr-2" /> Image</TabsTrigger>
                    <TabsTrigger value="video"><Video className="mr-2" /> Video</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Enter your prompt</FormLabel>
                       <FormDescription>Describe the image you want to create in detail.</FormDescription>
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

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold flex items-center gap-2">
                        <Wand2 className="h-5 w-5 text-primary" /> Model
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currentModels.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="creative-tools">
                    <AccordionTrigger className="font-semibold">Creative Tools</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <FormField control={form.control} name="style" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><Camera className="h-4 w-4" />Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent>{styles.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                            </Select>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="mood" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><Smile className="h-4 w-4" />Mood</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent>{moods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                            </Select>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="lighting" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><Sun className="h-4 w-4" />Lighting</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent>{lightings.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                            </Select>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="color" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><Palette className="h-4 w-4" />Color</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent>{colors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="ratio" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><ImageIcon className="h-4 w-4" />Ratio</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={generationType === 'video'}>
                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent>{ratios.map(r => <SelectItem key={r.name} value={r.name}>{r.name}</SelectItem>)}</SelectContent>
                            </Select>
                             {generationType === 'video' && <FormDescription className="text-xs">Ratio controls are disabled for video generation.</FormDescription>}
                          </FormItem>
                        )} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter className="flex gap-2 pt-6">
                <Button type="submit" disabled={isGenerateDisabled} size="lg" className="flex-grow">
                  {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                      <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Generating...' : `Generate`}
                </Button>
                <Button type="button" variant="outline" size="lg" disabled={isLoading}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Suggest
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      {/* Results Column */}
      <div className="lg:col-span-8 xl:col-span-9">
        <Card className="w-full aspect-square md:aspect-video flex items-center justify-center border-dashed bg-secondary/50 p-4">
          <div className="text-center w-full h-full">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center text-muted-foreground h-full">
                    <Loader2 className="h-16 w-16 mb-4 animate-spin" />
                    <p className="font-semibold">Generating your media...</p>
                    <p className="text-sm">This may take a few moments.</p>
                </div>
            ) : generatedMedia ? (
              <div className="w-full h-full relative group">
                {generatedMedia.type === 'image' && (
                    <Image 
                        src={generatedMedia.url} 
                        alt={form.getValues('prompt')} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-contain rounded-lg" 
                        data-ai-hint={form.getValues('prompt').split(' ').slice(0, 2).join(' ')}
                      />
                )}
                {generatedMedia.type === 'video' && (
                    <video
                        src={generatedMedia.url}
                        controls
                        className="w-full h-full object-contain rounded-lg"
                        autoPlay
                        loop
                        muted
                    />
                )}
                <div 
                  className={cn(
                    "absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                    downloading ? 'cursor-wait' : 'cursor-pointer'
                  )}
                  onClick={() => {
                      if (generatedMedia?.url) {
                        const extension = generatedMedia.type === 'image' ? 'png' : 'mp4';
                        const filename = `imagen-max-brainai-${form.getValues('prompt').replace(/\s+/g, '-').toLowerCase().slice(0, 20)}.${extension}`;
                        handleDownload(generatedMedia.url, filename);
                      }
                  }}
                >
                  {downloading ? (
                    <Loader2 className="h-12 w-12 text-white animate-spin" />
                  ) : (
                    <Download className="h-12 w-12 text-white" />
                  )}
                </div>
              </div>
            ) : (
               <div className="flex flex-col h-full items-center justify-center text-muted-foreground p-8">
                  <ImageIcon className="h-20 w-20 mb-4 text-muted-foreground/50" />
                  <p className="font-semibold text-lg">Your generated images will appear here.</p>
                  <p className="text-sm max-w-xs text-center">Enter a prompt above and click "Generate" to begin.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
