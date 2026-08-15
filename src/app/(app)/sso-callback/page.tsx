import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-base border-4 border-border shadow-shadow p-8 text-center">
        <h1 className="text-2xl font-black text-slate-900 uppercase mb-4">
          Mengautentikasi...
        </h1>
        <p className="text-slate-600 font-bold mb-8">
          Tunggu sebentar, kami sedang memproses login Anda dari penyedia layanan.
        </p>
        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="hidden">
          <AuthenticateWithRedirectCallback />
        </div>
      </div>
    </div>
  );
}
