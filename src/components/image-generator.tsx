"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Image as ImageIcon, Sparkles, Wand2, Aperture, Ratio, Smile, Sun, Palette, Medal, Loader2 } from 'lucide-react';
import Image from 'next/image';

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

export default function ImageGenerator() {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setGeneratedImages([]);
    console.log(values);
    // AI call would go here
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratedImages([
      'https://placehold.co/512x512.png',
      'https://placehold.co/512x512.png',
      'https://placehold.co/512x512.png',
      'https://placehold.co/512x512.png',
    ]);
    setIsLoading(false);
  };

  return (
    <div className="space-y-8 my-12">
      <Card className="overflow-hidden shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6 space-y-6 bg-card">
              <div>
                <h3 className="font-semibold text-lg">Enter your prompt</h3>
                <p className="text-sm text-muted-foreground">Describe the image you want to create in detail.</p>
              </div>
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
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
                <AccordionItem value="item-1" className="border-b-0">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline p-0">
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
                                  </SelectContent>
                              </Select>
                          </FormItem>
                      )} />
                      <FormField control={form.control} name="quality" render={({ field }) => (
                          <FormItem>
                              <FormLabel className="flex items-center gap-2 text-xs text-muted-foreground"><Medal className="h-4 w-4" /> Quality</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                  <SelectContent>
                                      <SelectItem value="standard">Standard (1080p)</SelectItem>
                                      <SelectItem value="hd">HD (2K)</SelectItem>
                                      <SelectItem value="uhd">Ultra HD (4K)</SelectItem>
                                  </SelectContent>
                              </Select>
                          </FormItem>
                      )} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="p-6 pt-0 flex justify-between items-center bg-card">
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Generating...' : 'Generate 4 Images'}
              </Button>
              <Button variant="outline" type="button">
                <Wand2 className="mr-2 h-4 w-4" />
                Suggest Prompts
              </Button>
            </div>
          </form>
        </Form>
      </Card>
      
      <Card className="min-h-[400px] flex items-center justify-center border-dashed bg-card">
        <CardContent className="text-center p-6">
          {isLoading ? (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="h-16 w-16 mb-4 animate-spin" />
                  <p className="font-semibold">Generating your images...</p>
                  <p className="text-sm">This may take a few moments.</p>
              </div>
          ) : generatedImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {generatedImages.map((src, index) => (
                <Image key={index} src={src} alt={`Generated image ${index + 1}`} width={256} height={256} className="rounded-lg object-cover aspect-square" data-ai-hint="lion space" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="h-16 w-16 mb-4" />
              <p className="font-semibold">Your generated images will appear here.</p>
              <p className="text-sm">Enter a prompt above and click "Generate" to begin.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
