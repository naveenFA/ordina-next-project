import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Flow Automate uses cookies and tracking technologies.",
};

export default function CookiePolicyPage() {
  return <LegalDocumentPage path="/legal/cookie-policy" fallbackTitle="Cookie Policy" />;
}
