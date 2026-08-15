"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_mock_key_for_development", {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false, // Handle manually
  });
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  
  useEffect(() => {
    if (userId) {
      posthog.identify(userId);
    } else {
      posthog.reset();
    }
  }, [userId]);
  
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
