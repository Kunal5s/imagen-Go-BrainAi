import { UploadCloud, PencilRuler, Send } from 'lucide-react';

const steps = [
  {
    icon: UploadCloud,
    title: '1. Create your Profile',
    description: "Upload 5,000+ of your previously edited photos to create your unique AI editing profile. The more photos, the better the result.",
  },
  {
    icon: PencilRuler,
    title: '2. Upload your Photos',
    description: "Import your RAW photos from your computer or Lightroom Classic. Our app handles the rest.",
  },
  {
    icon: Send,
    title: '3. Get Edited Photos',
    description: "Receive your edited photos in record time. Review, tweak if needed, and export for your clients.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">How it works</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Get started in three simple steps.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="bg-background p-5 rounded-full border shadow-sm">
                  <step.icon className="h-8 w-8 text-primary-foreground/80" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
