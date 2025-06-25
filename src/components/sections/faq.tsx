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
    answer: "Yes, we offer a free plan that includes 10 generations per day. It's a great way to experience the power of Imagen Go BrainAi and see how it fits into your workflow."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, including Visa, Mastercard, and American Express. All payments are processed securely."
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription at any time. You will retain access to your plan's features until the end of the current billing cycle."
  },
  {
    question: "How many images are generated per prompt?",
    answer: "Our platform generates four unique image variations for every prompt you enter. This gives you a range of options to choose from and helps you find the perfect visual representation of your idea faster."
  },
  {
    question: "What image resolutions are supported?",
    answer: "Our plans support various resolutions. The Free plan offers Standard Quality (1080p), while our Pro and Mega plans provide up to 4K Ultra-High Quality for crystal-clear, professional-grade images."
  },
  {
    question: "Can I use the generated images for commercial purposes?",
    answer: "Yes! Images created under our Pro and Mega plans come with a commercial use license, allowing you to use them in your projects, for marketing, on products, and more."
  },
  {
    question: "How does the credit system work?",
    answer: "Credits are used to generate images. One credit typically equals one generation quad. Our paid plans come with a monthly credit allowance, and you can purchase Booster Packs if you need more."
  },
  {
    question: "Do you store my generated images?",
    answer: "Yes, your generated images are saved to your personal gallery, allowing you to access, view, and download them at any time from your account."
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
