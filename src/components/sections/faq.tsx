
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
    question: "Is there a free plan?",
    answer: "Yes, our Free plan is perfect for trying out the platform. It includes a limited number of generation credits per month. For more advanced use, you can upgrade to our Pro or Mega plans."
  },
  {
    question: "What models can I use?",
    answer: "We provide access to a curated list of powerful, open-source image and video models via the Replicate API, including Stable Diffusion XL, Zeroscope, AnimateDiff, and more."
  },
  {
    question: "Can I use the generated media for commercial purposes?",
    answer: "Yes, images and videos created under our Pro and Mega plans come with a commercial use license. The Free plan is for personal use only."
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
