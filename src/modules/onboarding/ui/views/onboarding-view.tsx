"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GraduationCap, ArrowRight, Loader2, Building, Store } from "lucide-react";

export const OnboardingView = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [role, setRole] = useState<"student" | "partner">("student");

  const [formData, setFormData] = useState({
    major: "",
    studentId: "",
    campus: "",
    phone: "",
    partnerName: "",
    picName: "",
    tenantName: "",
    locationDetail: "",
    menuName: "",
    menuPrice: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !user) return;

    setIsPending(true);
    try {
      const currentRoles = (user.unsafeMetadata?.roles as string[]) || [];
      
      const unsafeMetadata =
        role === "student"
          ? {
              roles: Array.from(new Set([...currentRoles, "student"])),
              studentData: {
                major: formData.major,
                studentId: formData.studentId,
                campus: formData.campus,
                phone: formData.phone,
              }
            }
          : {
              roles: Array.from(new Set([...currentRoles, "partner_tenant"])),
              partnerData: {
                tenantName: formData.tenantName,
                campus: formData.campus,
                locationDetail: formData.locationDetail,
                phone: formData.phone,
                menuName: formData.menuName,
                menuPrice: formData.menuPrice,
                // Keep these if needed by the app:
                partnerName: formData.partnerName,
                picName: formData.picName,
              }
            };

      await user.update({ unsafeMetadata });
      
      // Give Clerk some time to propagate metadata
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      toast.success("Profil berhasil dilengkapi!");
      
      const newRoles = unsafeMetadata.roles;
      if (newRoles.length > 1) {
        router.push("/portal");
      } else {
        router.push(role === "student" ? "/dashboard" : "/partner");
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan profil.");
    } finally {
      setIsPending(false);
    }
  };

  if (isLoaded && user && (user.unsafeMetadata?.roles as string[])?.length > 0) {
    // If they already have a role, they shouldn't be here.
    // Wait a brief moment before redirecting to avoid flashing layout
    setTimeout(() => {
      const roles = user.unsafeMetadata.roles as string[];
      if (roles.length > 1) {
        router.push("/portal");
      } else {
        router.push(roles.includes("student") ? "/dashboard" : "/partner");
      }
    }, 0);
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-base border-4 border-border shadow-shadow p-8 relative z-10 mt-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 uppercase">
            Lengkapi Profil Anda
          </h1>
          <p className="text-slate-600 font-bold mt-2">
            Anda masuk menggunakan layanan pihak ketiga. Silakan lengkapi data berikut.
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setRole("student")}
            className={`flex-1 py-3 border-4 border-border rounded-base font-black uppercase transition-all flex items-center justify-center gap-2 ${
              role === "student"
                ? "bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                : "bg-white text-slate-500 hover:bg-slate-100"
            }`}
          >
            <GraduationCap className="w-5 h-5" /> Mahasiswa
          </button>
          <button
            onClick={() => setRole("partner")}
            className={`flex-1 py-3 border-4 border-border rounded-base font-black uppercase transition-all flex items-center justify-center gap-2 ${
              role === "partner"
                ? "bg-[#ECA823] text-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                : "bg-white text-slate-500 hover:bg-slate-100"
            }`}
          >
            <Store className="w-5 h-5" /> Partner
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {role === "student" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-slate-900 uppercase">
                    Program Studi <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.major}
                    onChange={(e) => updateField("major", e.target.value)}
                    placeholder="Sistem Informasi"
                    required
                    className="h-12 bg-[#F4F4F0] border-2 border-border rounded-base font-bold focus-visible:ring-0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-slate-900 uppercase">
                    NIM <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.studentId}
                    onChange={(e) => updateField("studentId", e.target.value)}
                    placeholder="36230035"
                    required
                    className="h-12 bg-[#F4F4F0] border-2 border-border rounded-base font-bold focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-slate-900 uppercase">
                    Pilih Kampus <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.campus}
                    onChange={(e) => updateField("campus", e.target.value)}
                    required
                    className="h-12 bg-[#F4F4F0] border-2 border-border rounded-base font-bold px-4 outline-none"
                  >
                    <option value="" disabled>Pilih Kampus Anda</option>
                    <option value="UBM Ancol">UBM Ancol</option>
                    <option value="UBM Serpong">UBM Serpong</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-slate-900 uppercase">
                    No. WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="08123456789"
                    required
                    className="h-12 bg-[#F4F4F0] border-2 border-border rounded-base font-bold focus-visible:ring-0"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-slate-900 uppercase">
                    Nama Tenant <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.tenantName}
                    onChange={(e) => updateField("tenantName", e.target.value)}
                    placeholder="Nasi Goreng Berkah"
                    required
                    className="h-12 bg-[#F4F4F0] border-2 border-border rounded-base font-bold focus-visible:ring-0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-slate-900 uppercase">
                    Pilih Kampus <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.campus}
                    onChange={(e) => updateField("campus", e.target.value)}
                    required
                    className="h-12 bg-[#F4F4F0] border-2 border-border rounded-base font-bold px-4 outline-none"
                  >
                    <option value="" disabled>-- Pilih Kampus --</option>
                    <option value="UBM Ancol">UBM Ancol</option>
                    <option value="UBM Serpong">UBM Serpong</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-slate-900 uppercase">
                    Lokasi Detail <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.locationDetail}
                    onChange={(e) => updateField("locationDetail", e.target.value)}
                    placeholder="Lantai 2, Stan Pojok"
                    required
                    className="h-12 bg-[#F4F4F0] border-2 border-border rounded-base font-bold focus-visible:ring-0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-slate-900 uppercase">
                    No. WhatsApp (Aktif) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="08123456789"
                    required
                    className="h-12 bg-[#F4F4F0] border-2 border-border rounded-base font-bold focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t-2 border-dashed border-border pt-4 mt-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-slate-900 uppercase">
                    Menu Andalan <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.menuName}
                    onChange={(e) => updateField("menuName", e.target.value)}
                    placeholder="Nasi Goreng Spesial"
                    required
                    className="h-12 bg-[#F4F4F0] border-2 border-border rounded-base font-bold focus-visible:ring-0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-slate-900 uppercase">
                    Harga (Rp) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.menuPrice}
                    onChange={(e) => updateField("menuPrice", e.target.value)}
                    placeholder="25000"
                    required
                    className="h-12 bg-[#F4F4F0] border-2 border-border rounded-base font-bold focus-visible:ring-0"
                  />
                </div>
              </div>
              
              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t-2 border-dashed border-border pt-4 mt-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-slate-900 uppercase">
                    Foto Stan / Kantin <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    required
                    className="h-12 bg-[#F4F4F0] border-2 border-border rounded-base font-bold focus-visible:ring-0 pt-2.5"
                  />
                  <p className="text-xs font-bold text-slate-500">Format: JPG, PNG (Maks 5MB)</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-slate-900 uppercase">
                    Surat Pernyataan <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    className="h-12 bg-[#F4F4F0] border-2 border-border rounded-base font-bold focus-visible:ring-0 pt-2.5"
                  />
                  <p className="text-xs font-bold text-slate-500">Surat Izin/Pernyataan Pihak Kampus.</p>
                </div>
              </div>
            </>
          )}

          <Button
            disabled={isPending || !isLoaded}
            type="submit"
            size="lg"
            className={`w-full h-14 mt-4 text-slate-900 rounded-base border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 font-black uppercase tracking-wider transition-all active:translate-y-0 active:shadow-shadow flex items-center justify-center gap-2 ${
              role === "student" ? "bg-[#4ADE80] hover:bg-green-500" : "bg-[#FBBF24] hover:bg-yellow-500"
            }`}
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                Selesai & Lanjutkan <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
