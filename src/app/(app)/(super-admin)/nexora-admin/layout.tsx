import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SuperAdminShell } from "@/modules/super-admin/ui/components/super-admin-shell";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "God-Mode Analytics - NEXORA",
  description: "Portal Super Administrator Nexora",
  robots: { index: false, follow: false },
};

export default async function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  const roles = (user.unsafeMetadata?.roles as string[]) || [];
  if (!roles.includes("super-admin")) {
    redirect("/portal"); // Not authorized
  }

  return (
    <SuperAdminShell>
      {children}
    </SuperAdminShell>
  );
}
