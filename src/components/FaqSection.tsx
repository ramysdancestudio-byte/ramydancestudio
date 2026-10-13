import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { studioInfo } from '../data/danceData';

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "Where is Ramy's Dance Studio located in Ranchi?",
    answer: "Ramy's Dance Studio is centrally located on Kutchery Road: 2nd Floor, Metro Market, Kutchery Road, Ranchi - 834002, Jharkhand, India. We are easily accessible from Plaza Chowk, Albert Ekka Chowk, and Main Road.",
  },
  {
    question: "What dance classes and categories are available in Ranchi?",
    answer: "We offer comprehensive dance coaching across all major categories: Kids Dance (ages 4–12), Beginner Dance Foundation, Advance Hip-Hop & Urban Choreography, Bollywood & Ladies Fitness Batch, Custom Wedding Choreography, Gymnastics & Acro Training, and 1-on-1 Private Classes.",
  },
  {
    question: "How much is the demo class fee and how do I book?",
    answer: "You can book an introductory Demo Class for just ₹49 directly on our website or by contacting our team. Choose your preferred day and time slot between 11:00 AM to 7:00 PM, and your digital admission pass will be sent instantly via WhatsApp.",
  },
  {
    question: "What are the studio timings and class schedules?",
    answer: "Ramy's Dance Studio is open Monday through Saturday from 10:00 AM to 7:00 PM, and Sunday from 8:00 AM to 5:00 PM. We offer morning, afternoon, and evening batches to fit working professionals, students, and children.",
  },
  {
    question: "Do you offer wedding choreography and sangeet preparations?",
    answer: "Yes! We specialize in custom wedding choreography for bride & groom entries, family medleys, and full sangeet performances in Ranchi. Our choreographers provide customized routines and rehearsals tailored to your songs and comfort level.",
  },
  {
    question: "Can beginners with no prior dance experience join?",
    answer: "Absolutely. Our Beginner and Foundational batches are specifically designed for students with zero prior dance background. Instructors guide you step-by-step through rhythm, footwork, musicality, and body coordination in an encouraging atmosphere.",
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faqs" className="py-14 sm:py-20 bg-white text-neutral-900 border-t border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-neutral-950 uppercase">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm font-medium mt-2 max-w-xl mx-auto">
            Everything you need to know about dance classes, demo bookings, schedules &amp; studio location in Ranchi
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="border border-neutral-200 rounded-2xl bg-neutral-50/60 overflow-hidden transition-all duration-200 hover:border-neutral-300"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-5 sm:px-6 py-4.5 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
                >
                  <span className="font-bold text-neutral-950 text-sm sm:text-base leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-[#0066FF] text-white rotate-180' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-neutral-600 text-xs sm:text-sm leading-relaxed border-t border-neutral-200/60 bg-white">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help Banner */}
        <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="font-bold text-neutral-950 text-sm sm:text-base">
              Have a specific question about our dance batches?
            </h3>
            <p className="text-neutral-500 text-xs sm:text-sm mt-0.5">
              Chat directly with our instructors on WhatsApp for instant assistance.
            </p>
          </div>
          <a
            href={`https://wa.me/${studioInfo.whatsappNumber}?text=Hi%20Ramy's%20Dance%20Studio!%20I%20have%20a%20question%20about%20your%20classes`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all shrink-0 shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
