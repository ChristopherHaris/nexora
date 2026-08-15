import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CampusAdminShell } from "@/modules/campus-admin/ui/components/campus-admin-shell";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Campus Admin - NEXORA",
  description: "Portal Administrasi Kampus Nexora",
  robots: { index: false, follow: false },
};

export default async function CampusAdminLayout({
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
  if (!roles.includes("campus_admin") && !roles.includes("super-admin")) {
    redirect("/portal"); // Not authorized
  }

  return (
    <CampusAdminShell>
      {children}
    </CampusAdminShell>
  );
}
