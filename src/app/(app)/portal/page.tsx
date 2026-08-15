import { Metadata } from "next";
import { PortalSelectorView } from "@/modules/portal/ui/views/portal-selector-view";

export const metadata: Metadata = {
  title: "Pilih Portal - NEXORA",
  description: "Pilih portal identitas Anda untuk masuk ke sistem NEXORA.",
};

export default function PortalPage() {
  return <PortalSelectorView />;
}
