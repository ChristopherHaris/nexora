"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GraduationCap, ArrowRight, Loader2, Building, Store } from "lucide-react";

export const AddRoleView = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  
  const currentRoles = (user?.unsafeMetadata?.roles as string[]) || [];
  const [role, setRole] = useState<"student" | "partner">(
    !currentRoles.includes("student") ? "student" : "partner"
  );

  const [formData, setFormData] = useState({
    major: "",
    studentId: "",
    campus: "",
    phone: "",
    partnerName: "",
    picName: "",
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
                ...(user.unsafeMetadata?.studentData as any || {}),
                major: formData.major,
                studentId: formData.studentId,
                campus: formData.campus,
                phone: formData.phone,
              },
              partnerData: user.unsafeMetadata?.partnerData
            }
          : {
              roles: Array.from(new Set([...currentRoles, "partner_tenant"])),
              partnerData: {
                ...(user.unsafeMetadata?.partnerData as any || {}),
                partnerName: formData.partnerName,
                picName: formData.picName,
                phone: formData.phone,
              },
              studentData: user.unsafeMetadata?.studentData
            };

      await user.update({ unsafeMetadata });
      
      // Give Clerk some time to propagate metadata
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      toast.success("Profil berhasil dilengkapi!");
      router.push(role === "student" ? "/dashboard" : "/partner");
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan profil.");
    } finally {
      setIsPending(false);
    }
  };

  if (isLoaded && currentRoles.includes("student") && currentRoles.includes("partner_tenant")) {
    setTimeout(() => {
      router.push("/dashboard");
    }, 0);
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-base border-4 border-border shadow-shadow p-8 relative z-10 mt-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 uppercase">
            Tambah Peran Baru
          </h1>
          <p className="text-slate-600 font-bold mt-2">
            Lengkapi data di bawah untuk mengakses fitur tambahan di NEXORA.
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          {!currentRoles.includes("student") && (
            <button
              onClick={() => setRole("student")}
              className={`flex-1 py-3 border-4 border-border rounded-base font-black uppercase transition-all flex items-center justify-center gap-2 ${
                role === "student"
                  ? "bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                  : "bg-white text-slate-500 hover:bg-slate-100"
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              Mahasiswa
            </button>
          )}
          {!currentRoles.includes("partner_tenant") && (
            <button
              onClick={() => setRole("partner")}
              className={`flex-1 py-3 border-4 border-border rounded-base font-black uppercase transition-all flex items-center justify-center gap-2 ${
                role === "partner"
                  ? "bg-yellow-400 text-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                  : "bg-white text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Store className="w-5 h-5" />
              Partner Kantin
            </button>
          )}
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
                    Nama Bisnis/Usaha <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.partnerName}
                    onChange={(e) => updateField("partnerName", e.target.value)}
                    placeholder="Kantin UBM"
                    required
                    className="h-12 bg-[#F4F4F0] border-2 border-border rounded-base font-bold focus-visible:ring-0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-slate-900 uppercase">
                    Nama Pemilik/PIC <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.picName}
                    onChange={(e) => updateField("picName", e.target.value)}
                    placeholder="Bapak Budi"
                    required
                    className="h-12 bg-[#F4F4F0] border-2 border-border rounded-base font-bold focus-visible:ring-0"
                  />
                </div>
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
