"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type ContactFormProps = {
  inputClass: string;
  teamSizes: string[];
  roles: string[];
};

type ContactPayload = {
  fullName: string;
  email: string;
  company: string;
  teamSize: string;
  role: string;
  updates: boolean;
};

export function ContactForm({ inputClass, teamSizes, roles }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const payload: ContactPayload = {
      fullName: [firstName, lastName].filter(Boolean).join(" ").trim(),
      email: String(formData.get("email") ?? "").trim(),
      company: String(formData.get("company") ?? "").trim(),
      teamSize: String(formData.get("teamSize") ?? "").trim(),
      role: String(formData.get("role") ?? "").trim(),
      updates: formData.get("updates") !== null,
    };

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Contact request failed with ${response.status}`);
      }

      form.reset();
    } catch (error) {
      console.error("Failed to submit contact form", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white/[0.04] p-6 ring-1 ring-white/10 md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-white/80">First name*</span>
          <input
            type="text"
            name="firstName"
            required
            placeholder="John"
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <span className="text-white/80">Last name*</span>
          <input
            type="text"
            name="lastName"
            required
            placeholder="Meyer"
            className={inputClass}
          />
        </label>
      </div>
      <label className="mt-4 block text-sm">
        <span className="text-white/80">Work email*</span>
        <input
          type="email"
          name="email"
          required
          placeholder="john.meyer@hubspot.com"
          className={inputClass}
        />
      </label>
      <label className="mt-4 block text-sm">
        <span className="text-white/80">Your company name*</span>
        <input
          type="text"
          name="company"
          required
          placeholder="E.g.: Hubspot"
          className={inputClass}
        />
      </label>
      <label className="mt-4 block text-sm">
        <span className="text-white/80">Team size</span>
        <select name="teamSize" defaultValue="" className={inputClass}>
          <option value="" disabled>
            Select…
          </option>
          {teamSizes.map((teamSize) => (
            <option key={teamSize} className="text-black">
              {teamSize}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-4 block text-sm">
        <span className="text-white/80">What best describes your role? *</span>
        <select name="role" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Select…
          </option>
          {roles.map((role) => (
            <option key={role} className="text-black">
              {role}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-5 flex items-start gap-2.5 text-xs leading-relaxed text-white/55">
        <input type="checkbox" name="updates" className="mt-0.5 h-3.5 w-3.5 rounded-[3px]" />
        <span>
          Yes, I&apos;d like to receive product updates and insights from Ordina.
          Unsubscribe anytime.
        </span>
      </label>
      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-[var(--ordina-lime)] px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
      >
        Send an inquiry
      </button>
      <p className="mt-4 text-center text-xs text-white/45">
        By submitting, you agree to our{" "}
        <Link href="/legal/terms-of-service" className="underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy-policy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
