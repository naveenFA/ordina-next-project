import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { PRICING_PLANS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Flexible pricing plans for small teams finding their rhythm or scaling organizations managing complex workflows.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Flexible pricing plans"
        description="Whether you're a small team finding your rhythm or a scaling organization managing complex workflows, there's a plan that fits."
      />

      <section className="pb-20 pt-4">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-10 text-center text-sm text-zinc-500">
            Yearly billing · Save 20%
          </p>
          <div className="grid gap-6 lg:grid-cols-3">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col rounded-2xl border p-8 ${
                  "featured" in plan && plan.featured
                    ? "border-indigo-300 bg-indigo-50/50 shadow-md ring-1 ring-indigo-200"
                    : "border-zinc-200 bg-white"
                }`}
              >
                <h2 className="text-xl font-semibold text-zinc-900">{plan.name}</h2>
                <p className="mt-2 text-sm text-zinc-600">{plan.description}</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-4xl font-semibold text-zinc-900">
                    ${plan.yearlyPrice}
                  </span>
                  <span className="mb-1 text-sm text-zinc-500">/mo</span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  ${plan.price}/mo billed monthly
                </p>
                <button
                  type="button"
                  className={`mt-6 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                    "featured" in plan && plan.featured
                      ? "bg-zinc-900 text-white hover:bg-zinc-700"
                      : "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  Choose {plan.name}
                </button>
                <p className="mt-6 text-sm font-medium text-zinc-900">
                  What&apos;s included
                </p>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="text-indigo-500">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
