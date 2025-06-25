import ImageGenerator from '@/components/image-generator';

export default function GeneratePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Image Generation Studio</h1>
        <p className="max-w-3xl mx-auto text-muted-foreground mt-4 text-base md:text-lg">
          Unleash your creativity. Describe your vision and watch our AI bring it to life in stunning detail.
        </p>
      </div>
      <ImageGenerator />
    </div>
  );
}
