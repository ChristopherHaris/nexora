import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import arcjet, { detectBot, fixedWindow } from "@arcjet/next";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/canteen(.*)",
  "/dashboard(.*)",
  "/partner(.*)",
  "/admin(.*)",
  "/super-admin(.*)",
  "/teams(.*)",
  "/wallet(.*)",
  "/quests(.*)",
  "/peer-learning(.*)",
  "/mini-cases(.*)",
]);

const aj = arcjet({
  key: process.env.ARCJET_KEY || "ajkey_mock",
  rules: [
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 20,
    }),
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
  ],
});

export default clerkMiddleware(async (auth, req) => {
  // Ensure user is signed in to access protected routes like canteen, dashboard, etc.
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Arcjet protection
  if (req.nextUrl.pathname.startsWith('/api/trpc') || req.nextUrl.pathname.startsWith('/sign-up')) {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
      }
      if (decision.reason.isBot()) {
        return NextResponse.json({ error: "No bots allowed" }, { status: 403 });
      }
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-current-path', req.nextUrl.pathname);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
