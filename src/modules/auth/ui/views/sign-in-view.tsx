"use client";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { GraduationCap, Store, ShieldAlert, Sparkles } from "lucide-react";

export const SignInView = () => {
  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* LEFT COLUMN: BRANDING & GRAPHICS (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#ECA823] p-12 flex-col relative border-r-4 border-border">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        {/* Decorative Shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary border-4 border-border rounded-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] opacity-80 animate-pulse" />
        <div className="absolute bottom-32 left-10 w-40 h-40 bg-white border-4 border-border rounded-base shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-12" />
        
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <Link href="/" className="inline-block mb-12">
            <span className="text-5xl font-black tracking-tight text-slate-900 uppercase bg-white px-4 py-2 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" /> NEXORA
            </span>
          </Link>
          
          <h1 className="text-6xl font-black text-slate-900 uppercase leading-[1.1] mb-6 drop-shadow-sm">
            Satu Platform<br />Ribuan Peluang.
          </h1>
          <p className="text-xl font-bold text-slate-800 max-w-md mb-12">
            Masuk sekarang dan kelola kehidupan kampus Anda. Mulai dari pesan makan di kantin pintar, cari teman lomba, hingga laporkan barang hilang.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white p-4 border-4 border-border rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-sm transform hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-primary border-2 border-border rounded-base flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-black uppercase text-slate-900">Student Portal</p>
                <p className="text-sm font-bold text-slate-500">Akses fitur kampus</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white p-4 border-4 border-border rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-sm transform hover:-translate-y-1 transition-transform ml-8">
              <div className="w-12 h-12 bg-[#FBBF24] border-2 border-border rounded-base flex items-center justify-center">
                <Store className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <p className="font-black uppercase text-slate-900">Partner Console</p>
                <p className="text-sm font-bold text-slate-500">Kelola pesanan kantin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: SIGN IN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative bg-white">
        <div className="absolute top-10 right-10 w-24 h-24 bg-blue-400 border-4 border-border rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-6 opacity-20 hidden lg:block" />
        
        <div className="w-full max-w-2xl bg-white rounded-base border-4 border-border shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 md:p-14 relative z-10">
          
          {/* Mobile Brand (visible only on mobile) */}
          <div className="mb-8 relative z-10 text-center lg:hidden">
            <Link href="/" className="inline-block">
              <span className="text-4xl font-black tracking-tight text-slate-900 uppercase bg-yellow-300 px-3 py-1 border-4 border-border shadow-sm">
                NEXORA
              </span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white border-2 border-border rounded-base shadow-sm font-black uppercase text-sm mb-4">
              Selamat Datang Kembali
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Masuk ke Akun
            </h2>
            <p className="text-slate-500 font-bold mt-2">
              Lanjutkan untuk mengakses fitur super-app Anda.
            </p>
          </div>

          <div className="flex justify-center w-full">
            <SignIn
              fallbackRedirectUrl="/"
              signUpUrl="/sign-up"
              appearance={{
                elements: {
                  rootBox: "w-full flex justify-center",
                  cardBox: "w-full max-w-none shadow-none border-0",
                  card: "w-full max-w-none shadow-none border-0 bg-transparent p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "h-14 bg-white text-slate-900 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 font-black uppercase tracking-wider transition-all rounded-base",
                  socialButtonsBlockButtonText: "font-black uppercase",
                  formButtonPrimary:
                    "w-full h-14 bg-primary text-white hover:bg-green-700 rounded-base border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 font-black uppercase tracking-wider transition-all",
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
    </div>
  );
};

