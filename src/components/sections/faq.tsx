
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is Imagen Max BrainAi?",
    answer: "Imagen Max BrainAi is an advanced AI platform that allows you to create high-quality, unique images and videos from text prompts. It's designed for artists, designers, and creatives of all levels."
  },
  {
    question: "What can I create with it?",
    answer: "You can create anything you can imagine! From realistic portraits and landscapes to fantasy art, and even short video clips. Our platform gives you access to a wide variety of specialized AI models."
  },
  {
    question: "Is this service free to use?",
    answer: "Yes, currently all image and video generation on Imagen Max BrainAi is completely free to use. You can start creating right away without any subscription or credits."
  },
  {
    question: "What models can I use?",
    answer: "We provide access to a curated list of powerful, open-source image and video models via the Replicate API, including Stable Diffusion XL, Zeroscope, AnimateDiff, and more."
  },
  {
    question: "Can I use the generated media for commercial purposes?",
    answer: "Generally, yes. However, each AI model has its own license and terms of use. We recommend checking the license for the specific model you are using on its official page before using generated content for commercial projects."
  },
  {
    question: "Do you store my generated images and videos?",
    answer: "The application does not currently store your generated media in a personal gallery. You should download any images or videos you wish to keep immediately after they are generated."
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
