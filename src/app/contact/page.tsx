import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question, feedback, or need support? We'd love to hear from you.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-muted p-3 rounded-full">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Email Us</h3>
                <p className="text-muted-foreground">For support, media inquiries, or general questions.</p>
                <a href="mailto:support@imagenmax.com" className="text-primary hover:underline">support@imagenmax.com</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-muted p-3 rounded-full">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Call Us</h3>
                <p className="text-muted-foreground">Our lines are open Mon-Fri, 9am-5pm.</p>
                <p className="text-primary">(123) 456-7890</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-muted p-3 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Our Office</h3>
                <p className="text-muted-foreground">123 Creativity Lane, Artville, CA 94043</p>
              </div>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>Fill out the form and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input placeholder="First Name" />
                  <Input placeholder="Last Name" />
                </div>
                <Input type="email" placeholder="Your Email" />
                <Input placeholder="Subject" />
                <Textarea placeholder="Your Message" rows={5} />
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
