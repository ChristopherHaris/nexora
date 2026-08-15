import type { Metadata } from "next";
import type { ReactNode } from "react";

import { StudentDashboardShell } from "@/modules/student-dashboard/ui/components/student-dashboard-shell";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard Siswa - NEXORA",
  description: "Student Portal untuk mengakses kantin, event, tim lomba, dan fitur kampus lainnya.",
  robots: { index: false, follow: false },
};

export default async function StudentDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <StudentDashboardShell>
      {children}
    </StudentDashboardShell>
  );
}
