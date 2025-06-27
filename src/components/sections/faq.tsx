import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is Imagen Go BrainAi?",
    answer: "Imagen Go BrainAi is an advanced AI image generation platform that allows you to create high-quality, unique images from text prompts. It's designed for artists, designers, and creatives of all levels."
  },
  {
    question: "What can I create with it?",
    answer: "You can create anything you can imagine! From realistic portraits and landscapes to fantasy art, product mockups, and abstract designs. Our AI understands a wide variety of styles and concepts."
  },
  {
    question: "Is there a free trial?",
    answer: "We have a Free plan that allows you to explore the interface, but you will need to upgrade to a paid plan to receive credits and generate images."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, including Visa, Mastercard, and American Express. All payments are processed securely."
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your monthly subscription at any time. You will retain access to your plan's credits until the end of the current 30-day cycle. Booster Pack credits do not expire."
  },
  {
    question: "How many images are generated per prompt?",
    answer: "Our platform generates five unique image variations for every prompt you enter. This gives you a range of options to choose from and helps you find the perfect visual representation of your idea faster."
  },
  {
    question: "What image resolutions are supported?",
    answer: "Our plans support various resolutions. The Pro plan provides HD (2K) quality, while our Mega plan provides up to 4K Ultra-High Quality for crystal-clear, professional-grade images."
  },
  {
    question: "Can I use the generated images for commercial purposes?",
    answer: "Yes! Images created under our Pro and Mega plans come with a commercial use license, allowing you to use them in your projects, for marketing, on products, and more."
  },
  {
    question: "How does the credit system work?",
    answer: "Credits are used to pay for image generations. Each model (Google Imagen 3, Pollinations) has a different cost per generation. Paid plans provide you with a monthly allowance of credits for each model, and you can purchase Booster Packs if you need more."
  },
  {
    question: "Do you store my generated images?",
    answer: "The application does not currently store your generated images in a personal gallery. You should download any images you wish to keep immediately after they are generated."
  }
]

export default function FaqSection() {
  return (
    <section id="faq" className="py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Have questions? We've got answers.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
