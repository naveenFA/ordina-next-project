import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the Ordina platform.",
};

export default function TermsOfServicePage() {
  return <LegalDocumentPage path="/legal/terms-of-service" fallbackTitle="Terms of Service" />;
}
