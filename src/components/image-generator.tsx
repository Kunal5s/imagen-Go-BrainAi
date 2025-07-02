
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
  SelectGroup,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Sparkles, Wand2, Loader2, AlertTriangle, Download, Cpu, Video } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { generateMedia, MediaGenerationOutput } from "@/ai/flows/image-generation-flow";
import { useUserPlan } from '@/context/user-plan-context';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required.'),
  model: z.string().min(1, 'Model is required.'),
});

type FormValues = z.infer<typeof formSchema>;

const imageModels = [
    { name: "Stable Diffusion XL", id: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de791de18060315f5cb400e263d80c0" },
    { name: "Realistic Vision v6.0", id: "lucataco/realistic-vision-v60-b1:5a8cb5b672f7a07f27715d262c5b35582f3484f997635649988450035043d191" },
    { name: "DreamShaper v8", id: "lykon/dreamshaper-8:b43d7b3223193e449915998b31372e020d57e510255b1f07e4d830b1348e5a7b" },
    { name: "OpenJourney", id: "prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a3345923d243" },
    { name: "Deliberate v2", id: "proximasan/deliberate-v2:ee5c6f642468f615383a54a73744a569562767093258c067a6d89953051a6291" },
];

const videoModels = [
    { name: "Stable Video Diffusion", id: "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172638" },
    { name: "Zeroscope v2 XL", id: "anotherjesse/zeroscope-v2-xl:71996d331e8ede8ef7bd76eba9fae076d31792e4ddf4ad057779b443d6aea62f" },
    { name: "AnimateDiff SDXL", id: "lucataco/animate-diff-sdxl:b6182a4d34f0a9e22472b86370258163f4a05f15d3159042b0051e59273c524b" },
    { name: "Deforum", id: "deforum/deforum_api:0621e21b0e004481b213c6baf538a502c30b135b1c5c644c9b914a8f94950b73" },
    { name: "ModelScope Text-to-Video", id: "cjwbw/modelscope-t2v:8153b527fa6a37fb33418c322b7d43b2f5c229712128711818274a7b458b9f71" },
];

const allModels = [...imageModels, ...videoModels];

export default function ImageGenerator() {
  const [generatedMedia, setGeneratedMedia] = useState<MediaGenerationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const { user, totalCredits, getCreditCost, deductCredits, openPlanModal, isLoginLocked } = useUserPlan();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: 'A majestic lion wearing a crown, sitting on a throne in a cosmic library.',
      model: imageModels[0].id,
    },
  });

  const { watch } = form;
  const modelValue = watch('model');
  
  const isVideoModel = videoModels.some(m => m.id === modelValue);
  const creditCost = getCreditCost(isVideoModel ? 'video' : 'image');
  
  const hasSufficientCredits = totalCredits >= creditCost;

  const onSubmit = async (values: FormValues) => {
    if (!user) {
        toast({
            title: "Login Required",
            description: "Please log in to generate images or videos.",
            variant: "destructive"
        });
        openPlanModal();
        return;
    }

    if (isLoginLocked) {
        toast({
            title: "Free Account Limit Reached",
            description: "You have used your free account too many times. Please upgrade to a paid plan.",
            variant: "destructive"
        });
        openPlanModal();
        return;
    }

    if (!hasSufficientCredits) {
        toast({
            title: "Insufficient Credits",
            description: `You don't have enough credits for this generation. Please upgrade your plan.`,
            variant: "destructive"
        });
        return;
    }

    setIsLoading(true);
    setGeneratedMedia(null);
    
    try {
      const result = await generateMedia(values);
      setGeneratedMedia(result);
      deductCredits(creditCost);
      toast({
          title: "Success!",
          description: `${creditCost} credits were deducted for your generation.`,
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
      // Use fetch to get blob for direct download, bypassing CORS issues with simple links
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
                
                <FormField control={form.control} name="model" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-semibold flex items-center gap-2"><Cpu className="h-5 w-5 text-primary" /> Model</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    <FormLabel className="px-2 py-1.5 text-xs font-semibold">Image Models</FormLabel>
                                    {imageModels.map(model => (
                                        <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                                <SelectGroup>
                                     <FormLabel className="px-2 py-1.5 text-xs font-semibold">Video Models</FormLabel>
                                    {videoModels.map(model => (
                                        <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} />

              </CardContent>
              <CardFooter className="flex-col items-stretch gap-4">
                  <div className='text-center'>
                      <p className="font-bold text-lg">
                          {creditCost} Credits
                      </p>
                      <p className="text-xs text-muted-foreground">
                         Cost for this generation
                      </p>
                  </div>
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
                    <p className="text-sm">This may take a few moments, especially for videos.</p>
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
                        const extension = generatedMedia.type === 'image' ? 'png' : 'mp4';
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
                {!user ? (
                   <>
                      <ImageIcon className="h-16 w-16 mb-4" />
                      <p className="font-semibold text-lg">Login to start creating.</p>
                      <p className="text-sm max-w-xs">Please log in to generate images and videos.</p>
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
                        Your current balance is not enough for this generation. Please upgrade or buy a booster pack.
                    </p>
                    <Button onClick={() => { const pricing = document.getElementById('pricing'); pricing?.scrollIntoView({behavior: 'smooth'}); }} className="mt-4">Upgrade Plan</Button>
                  </>
                ) : (
                  <>
                      <Sparkles className="h-16 w-16 mb-4" />
                      <p className="font-semibold text-lg">Your generated images and videos will appear here.</p>
                      <p className="text-sm max-w-xs">Enter a prompt and choose a model to begin.</p>
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
