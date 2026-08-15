"use client";

import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { ArrowLeft, Store } from "lucide-react";

export const SignUpTenantView = () => {
  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col lg:flex-row font-sans">
      <div className="flex-1 overflow-y-auto p-6 lg:p-12 flex flex-col items-center justify-center relative">
        {/* Mobile brand header */}
        <div className="w-full max-w-md lg:hidden mb-8 text-center">
          <Link href="/">
            <span className="text-3xl font-black tracking-tight text-slate-900 uppercase">
              NEXORA
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md bg-white rounded-base border-4 border-border shadow-shadow p-8 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 font-bold hover:text-slate-900 transition-colors group mb-6 uppercase"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali</span>
          </Link>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ECA823] border-2 border-border rounded-base shadow-sm font-black uppercase text-sm mb-4">
              <Store className="w-4 h-4" /> Buka Usaha di Nexora
            </div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              Jadi Partner Tenant
            </h1>
            <p className="text-slate-600 font-bold mt-2 text-sm">
              Buat akun Anda sekarang. Lengkapi detail toko dan menu di langkah selanjutnya.
            </p>
          </div>

          <div className="flex justify-center w-full">
            <SignUp
              fallbackRedirectUrl="/onboarding?role=partner"
              signInUrl="/sign-in"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  cardBox: "w-full shadow-none border-0",
                  card: "w-full shadow-none border-0 bg-transparent p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "h-14 bg-white text-slate-900 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 font-black uppercase tracking-wider transition-all rounded-base",
                  socialButtonsBlockButtonText: "font-black uppercase",
                  formButtonPrimary:
                    "w-full h-14 bg-[#4ADE80] text-slate-900 hover:bg-green-500 rounded-base border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 font-black uppercase tracking-wider transition-all",
                  formFieldInput:
                    "h-14 bg-[#F4F4F0] border-2 border-border rounded-base font-bold text-base focus:ring-0 focus:border-border focus:bg-yellow-50 transition-colors px-4",
                  formFieldLabel: "text-sm font-black text-slate-900 uppercase mb-2",
                  footerActionLink: "text-primary font-black uppercase hover:underline",
                  dividerLine: "bg-border",
                  dividerText: "text-slate-500 font-black uppercase",
                  identityPreviewEditButton: "text-primary font-bold",
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Decorative Side Panel for Desktop */}
      <div className="hidden lg:flex w-[450px] bg-slate-900 border-l-4 border-border flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#ECA823] border-4 border-white rounded-base transform rotate-12 opacity-90" />
        <div className="absolute bottom-20 left-8 w-24 h-24 bg-[#4ADE80] border-4 border-white rounded-base transform -rotate-6 opacity-90" />
        
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 bg-white border-4 border-border rounded-base shadow-shadow flex items-center justify-center mx-auto mb-8 transform -rotate-3">
            <Store className="w-12 h-12 text-slate-900" />
          </div>
          <h2 className="text-4xl font-black uppercase mb-4 tracking-tight">
            NEXORA Partner
          </h2>
          <p className="text-lg font-bold text-slate-300 leading-relaxed">
            Platform modern untuk berjualan di kampus. Bebas antre, notifikasi pesanan real-time, dan manajemen menu yang mudah!
          </p>
        </div>
      </div>
    </div>
  );
};
