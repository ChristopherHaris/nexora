import type { Metadata } from "next";
import { headers } from "next/headers";
import { DM_Sans } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CSPostHogProvider } from "@/providers/posthog-provider";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEXORA — Super-App Kampus Terintegrasi",
  description:
    "Platform terintegrasi untuk mahasiswa, partner canteen, dan organizer event kampus. Pre-order canteen, cari tim lomba, dan lacak barang hilang dalam satu aplikasi.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const currentPath = (await headers()).get('x-current-path') || '';

  const roles = (user?.unsafeMetadata?.roles as string[]) || [];
  
  if (user && roles.length === 0) {
    if (!currentPath.includes('/onboarding') && !currentPath.includes('/sso-callback')) {
      redirect("/onboarding");
    }
  }

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${dmSans.className}`}>
        <ClerkProvider
          afterSignOutUrl="/"
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <NuqsAdapter>
              <CSPostHogProvider>
                <TRPCReactProvider>
                  <SpeedInsights />
                  {children}
                  <Toaster richColors />
                </TRPCReactProvider>
              </CSPostHogProvider>
            </NuqsAdapter>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
