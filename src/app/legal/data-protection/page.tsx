import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";

export const metadata: Metadata = {
  title: "Data Protection Policy",
  description: "How Flow Automate protects and processes personal data.",
};

export default function DataProtectionPage() {
  return <LegalDocumentPage path="/legal/data-protection" fallbackTitle="Data Protection Policy" />;
}
