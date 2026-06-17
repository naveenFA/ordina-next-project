import type { Metadata } from "next";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a demo and see how Ordina works for your team in a 30-minute walkthrough.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="24h response time"
        title="Book a demo"
        description="See how Ordina works for your team in a 30-minute walkthrough. No pitch, no pressure — just a clear look at whether it's the right fit."
      />

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
          <form className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-zinc-900">First name *</span>
                <input
                  type="text"
                  name="firstName"
                  required
                  className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-zinc-900">Last name *</span>
                <input
                  type="text"
                  name="lastName"
                  required
                  className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
                />
              </label>
            </div>

            <label className="mt-4 block text-sm">
              <span className="font-medium text-zinc-900">Work email *</span>
              <input
                type="email"
                name="email"
                required
                className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
              />
            </label>

            <label className="mt-4 block text-sm">
              <span className="font-medium text-zinc-900">Your company name *</span>
              <input
                type="text"
                name="company"
                required
                className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
              />
            </label>

            <label className="mt-4 block text-sm">
              <span className="font-medium text-zinc-900">Team size</span>
              <select
                name="teamSize"
                className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
              >
                <option value="">Select…</option>
                <option>Just me</option>
                <option>2–10 people</option>
                <option>11–50 people</option>
                <option>51–200 people</option>
                <option>200+ people</option>
              </select>
            </label>

            <label className="mt-4 block text-sm">
              <span className="font-medium text-zinc-900">
                What best describes your role? *
              </span>
              <select
                name="role"
                required
                className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
              >
                <option value="">Select…</option>
                <option>Operations & Workflow</option>
                <option>Product & Engineering</option>
                <option>Strategy & Leadership</option>
                <option>Marketing & Growth</option>
                <option>Finance & Admin</option>
                <option>Other</option>
              </select>
            </label>

            <label className="mt-4 flex items-start gap-2 text-sm text-zinc-600">
              <input type="checkbox" name="updates" className="mt-1" />
              <span>
                Yes, I&apos;d like to receive product updates and insights from
                Ordina. Unsubscribe anytime.
              </span>
            </label>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              Send an inquiry
            </button>

            <p className="mt-4 text-xs text-zinc-500">
              By submitting, you agree to our Terms of Service and Privacy Policy.
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              No credit card · 15 day free trial
            </p>
          </form>

          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <h2 className="font-semibold text-zinc-900">Prefer a different way to connect?</h2>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="font-medium text-zinc-900">Email us directly</p>
                  <p className="text-zinc-600">For questions, partnerships, or anything else</p>
                  <a
                    href="mailto:support@ordina.com"
                    className="mt-1 inline-block text-indigo-600 hover:text-indigo-700"
                  >
                    support@ordina.com
                  </a>
                </div>
                <div>
                  <p className="font-medium text-zinc-900">Live chat</p>
                  <p className="text-zinc-600">
                    Talk to the team in real time during business hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
