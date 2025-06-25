import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    quote: "Imagen has completely changed my wedding photography business. I'm saving 10-15 hours per wedding. It's a no-brainer.",
    author: "Jane Doe",
    title: "Wedding Photographer",
    avatar: "https://placehold.co/40x40.png",
    aiHint: "portrait woman"
  },
  {
    quote: "The AI culling is scary good. It picks the keepers with incredible accuracy. I trust it more than my own eye now!",
    author: "John Smith",
    title: "Event Photographer",
    avatar: "https://placehold.co/40x40.png",
    aiHint: "portrait man"
  },
  {
    quote: "I was skeptical about AI editing, but Imagen's profiles are amazing. It learned my style perfectly and the consistency is unmatched.",
    author: "Samantha Lee",
    title: "Portrait Photographer",
    avatar: "https://placehold.co/40x40.png",
    aiHint: "portrait person"
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Loved by photographers worldwide</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our users have to say.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col">
              <CardContent className="p-6 flex-grow flex flex-col">
                <p className="text-lg mb-6 flex-grow">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} data-ai-hint={testimonial.aiHint} />
                    <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
