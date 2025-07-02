
"use client"

import { useState } from 'react';
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
import { ImageIcon, Sparkles, Wand2, Loader2, Download, Cpu, Ratio } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { generateMedia, MediaGenerationOutput } from "@/ai/flows/image-generation-flow";
import { cn } from '@/lib/utils';

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required.'),
  aspectRatio: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const aspectRatios = [
    { name: 'Square (1:1)', width: 1024, height: 1024, value: '1024x1024' },
    { name: 'Portrait (2:3)', width: 1024, height: 1536, value: '1024x1536' },
    { name: 'Landscape (3:2)', width: 1536, height: 1024, value: '1536x1024' },
];

export default function ImageGenerator() {
  const [generatedMedia, setGeneratedMedia] = useState<MediaGenerationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: 'A majestic lion wearing a crown, sitting on a throne in a cosmic library.',
      aspectRatio: aspectRatios[0].value,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setGeneratedMedia(null);

    const selectedRatio = aspectRatios.find(r => r.value === values.aspectRatio);

    try {
      const result = await generateMedia({
          prompt: values.prompt,
          width: selectedRatio?.width,
          height: selectedRatio?.height,
      });
      setGeneratedMedia(result);
      toast({
          title: "Success!",
          description: "Your image has been generated.",
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
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Your Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A majestic lion wearing a crown..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="aspectRatio" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-semibold flex items-center gap-2"><Ratio className="h-5 w-5 text-primary" /> Aspect Ratio</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                {aspectRatios.map(ratio => (
                                    <SelectItem key={ratio.value} value={ratio.value}>{ratio.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} />

              </CardContent>
              <CardFooter className="flex-col items-stretch gap-4">
                <Button type="submit" disabled={isGenerateDisabled} size="lg">
                  {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                      <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Generating...' : `Generate`}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      {/* Results Column */}
      <div className="lg:col-span-8 xl:col-span-9">
        <Card className="min-h-[calc(100vh-10rem)] flex items-center justify-center border-dashed bg-secondary/50 p-4 aspect-video">
          <div className="text-center w-full">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="h-16 w-16 mb-4 animate-spin" />
                    <p className="font-semibold">Generating your media...</p>
                    <p className="text-sm">This may take a few moments.</p>
                </div>
            ) : generatedMedia ? (
              <div className="w-full h-full aspect-video relative group">
                {generatedMedia.type === 'image' && (
                    <Image 
                        src={generatedMedia.url} 
                        alt={form.getValues('prompt')} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-contain" 
                        data-ai-hint={form.getValues('prompt').split(' ').slice(0, 2).join(' ')}
                      />
                )}
                {generatedMedia.type === 'video' && (
                    <video
                        src={generatedMedia.url}
                        controls
                        className="w-full h-full object-contain"
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
                        const extension = 'png';
                        const filename = `imagen-go-brainai-${form.getValues('prompt').replace(/\s+/g, '-').toLowerCase().slice(0, 20)}.${extension}`;
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
               <div className="flex flex-col items-center justify-center text-muted-foreground p-8">
                  <Sparkles className="h-16 w-16 mb-4" />
                  <p className="font-semibold text-lg">Your generated images will appear here.</p>
                  <p className="text-sm max-w-xs">Enter a prompt and choose a model to begin.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
