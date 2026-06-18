import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Ordina B.V. collects, uses, and protects personal data.",
};

export default function PrivacyPolicyPage() {
  return <LegalDocumentPage path="/legal/privacy-policy" fallbackTitle="Privacy Policy" />;
}
