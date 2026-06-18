import type { Metadata } from "next";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqSection } from "@/components/sections/faq-section";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Flexible pricing plans for small teams finding their rhythm or scaling organizations managing complex workflows.",
};

export default function PricingPage() {
  return (
    <div className="text-[var(--ordina-text)]">
      <PricingPlans />
      <TestimonialsSection />
      <FaqSection />
    </div>
  );
}
