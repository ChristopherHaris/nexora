import { PartnerDashboardShell } from "@/modules/partner/ui/components/partner-dashboard-shell";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Partner Console | Nexora",
  description: "Dashboard untuk admin dan partner canteen Nexora",
};

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const user = await currentUser();

  // Redirect to sign in if not logged in
  if (!userId || !user) {
    redirect("/sign-in");
  }
  
  const roles = (user.unsafeMetadata?.roles as string[]) || [];
  if (!roles.includes("partner_tenant") && !roles.includes("super-admin")) {
    redirect("/portal");
  }

  return <PartnerDashboardShell>{children}</PartnerDashboardShell>;
}
