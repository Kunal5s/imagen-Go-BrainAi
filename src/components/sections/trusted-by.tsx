import { Briefcase } from 'lucide-react';

const partners = [
  'TechCorp', 'InnovateInc', 'FutureSolutions', 'NextGen', 'Visionary',
];

export default function TrustedBySection() {
  return (
    <section className="py-12 bg-secondary">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-lg text-muted-foreground mb-8">
          Trusted by over 100,000 photographers and businesses
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {partners.map((partner) => (
            <div key={partner} className="flex items-center gap-2 text-muted-foreground text-xl font-semibold">
              <Briefcase className="h-6 w-6" />
              <span>{partner}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
