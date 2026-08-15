"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2, CheckCircle2, XCircle, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FormData = {
  competitionName: string;
  field: string;
  description: string;
  deadline: string;
  competitionDate: string;
  positions: {
    positionName: string;
    skillRequired: string;
    slotsNeeded: number;
  }[];
};

export const TeamCreateView = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const createTeamMutation = useMutation(trpc.teams.createTeam.mutationOptions());
  const addPositionMutation = useMutation(trpc.teams.addPosition.mutationOptions());

  const [modalState, setModalState] = useState<{ isOpen: boolean; status: 'success' | 'error' | 'loading'; message: string; teamId?: string }>({
    isOpen: false,
    status: 'loading',
    message: ''
  });

  const { register, control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      competitionName: "",
      field: "",
      description: "",
      deadline: "",
      competitionDate: "",
      positions: [{ positionName: "", skillRequired: "", slotsNeeded: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "positions"
  });

  const onSubmit = async (data: FormData) => {
    try {
      setModalState({ isOpen: true, status: 'loading', message: 'Sedang membangun markas tim Anda...' });
      
      // 1. Create team
      const team = await createTeamMutation.mutateAsync({
        competitionName: data.competitionName,
        field: data.field,
        description: data.description,
        deadline: new Date(data.deadline).toISOString(),
        competitionDate: new Date(data.competitionDate).toISOString(),
      });

      // 2. Create positions
      for (const pos of data.positions) {
        if (pos.positionName) {
          await addPositionMutation.mutateAsync({
            teamId: team.id,
            positionName: pos.positionName,
            skillRequired: pos.skillRequired,
            slotsNeeded: Number(pos.slotsNeeded),
          });
        }
      }

      setModalState({ isOpen: true, status: 'success', message: 'Tim berhasil dibuat!', teamId: String(team.id) });
    } catch (e: unknown) {
      const err = e as Error;
      setModalState({ isOpen: true, status: 'error', message: err.message || 'Gagal membuat tim' });
    }
  };

  return (
    <div className="bg-[#F4F4F0] min-h-screen font-sans pb-20 relative">
      {/* Header */}
      <div className="border-b-4 border-black bg-[#0F4C3A]">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[#ECA823] text-black w-max font-black text-sm uppercase tracking-wider mb-6">
            <Users className="w-4 h-4" />
            <span>Rekrutmen</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.1] text-white drop-shadow-sm mb-4">
            BENTUK <span className="text-[#ECA823] border-b-4 border-black inline-block leading-[0.8] pb-1">TIM</span> IMPIANMU
          </h1>
          <p className="text-base md:text-lg font-bold text-gray-200 max-w-xl border-l-4 border-[#ECA823] pl-4">
            Cari anggota berbakat di NEXORA untuk kompetisi yang akan kamu ikuti.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
          
          {/* Lomba Section */}
          <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl flex flex-col gap-6">
            <div className="flex items-center justify-between border-b-4 border-black pb-4 border-dashed">
              <h2 className="text-3xl font-black uppercase tracking-wider">Informasi Lomba</h2>
              <div className="w-12 h-12 bg-[#BBE2EC] border-4 border-black rounded-full flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">1</div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-black uppercase text-sm tracking-wider">Nama Kompetisi</label>
              <Input 
                {...register("competitionName", { required: true })} 
                placeholder="Contoh: Gemastik 2026 - UX Design" 
                className="border-2 border-black bg-[#F4F4F0] p-4 h-14 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col gap-2 flex-1">
                <label className="font-black uppercase text-sm tracking-wider">Bidang Lomba</label>
                <select 
                  {...register("field", { required: true })}
                  className="w-full rounded-md border-2 border-black bg-[#F4F4F0] px-4 py-3 h-14 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                >
                  <option value="">Pilih Bidang</option>
                  <option value="Software Development">Software Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Business Plan">Business Plan</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Game Development">Game Development</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-2 flex-1">
                <label className="font-black uppercase text-sm tracking-wider">Batas Pendaftaran Anggota</label>
                <Input 
                  type="date"
                  {...register("deadline", { required: true })} 
                  className="border-2 border-black bg-[#F4F4F0] p-4 h-14 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                />
              </div>
              
              <div className="flex flex-col gap-2 flex-1">
                <label className="font-black uppercase text-sm tracking-wider">Tanggal Akhir Lomba</label>
                <Input 
                  type="date"
                  {...register("competitionDate", { required: true })} 
                  className="border-2 border-black bg-[#F4F4F0] p-4 h-14 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-black uppercase text-sm tracking-wider">Deskripsi Singkat Proyek</label>
              <Textarea 
                {...register("description")} 
                placeholder="Jelaskan sedikit tentang proyek atau ide yang ingin diangkat..."
                className="min-h-[140px] border-2 border-black bg-[#F4F4F0] p-4 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow"
              />
            </div>
          </div>

          {/* Posisi Section */}
          <div className="bg-[#ECA823] border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-4 border-black border-dashed pb-4 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white border-4 border-black rounded-full flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">2</div>
                <h2 className="text-3xl font-black uppercase tracking-wider">Kebutuhan Anggota</h2>
              </div>
              <Button 
                type="button" 
                onClick={() => append({ positionName: "", skillRequired: "", slotsNeeded: 1 })}
                className="bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-black uppercase"
              >
                + Tambah Posisi
              </Button>
            </div>
            
            <div className="flex flex-col gap-6 mt-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-6 md:p-8 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl flex flex-col gap-6 relative group hover:-translate-y-1 transition-transform">
                  {fields.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => remove(index)}
                      className="absolute -top-4 -right-4 bg-red-500 text-white w-10 h-10 rounded-full border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black hover:scale-110 transition-transform"
                      title="Hapus Posisi"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  )}
                  
                  <div className="flex flex-col gap-2">
                    <label className="font-black uppercase text-xs tracking-wider text-gray-500">Nama Posisi</label>
                    <Input 
                      {...register(`positions.${index}.positionName` as const, { required: true })} 
                      placeholder="Contoh: Frontend Developer" 
                      className="border-b-4 border-t-0 border-l-0 border-r-0 border-black bg-transparent rounded-none px-0 text-2xl font-black focus-visible:ring-0 focus-visible:border-b-[#0F4C3A] transition-colors"
                    />
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col gap-2 flex-1">
                      <label className="font-black uppercase text-xs tracking-wider text-gray-500">Skill Spesifik</label>
                      <Input 
                        {...register(`positions.${index}.skillRequired` as const)} 
                        placeholder="Contoh: React, Tailwind, API" 
                        className="border-2 border-black bg-[#F4F4F0] p-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2 w-full md:w-[150px]">
                      <label className="font-black uppercase text-xs tracking-wider text-gray-500">Jumlah</label>
                      <Input 
                        type="number"
                        min={1}
                        {...register(`positions.${index}.slotsNeeded` as const, { required: true })} 
                        className="border-2 border-black bg-[#F4F4F0] p-3 text-xl font-black text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-6 mt-4">
            <Button 
              type="button" 
              onClick={() => router.back()}
              className="bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-black uppercase py-7 px-10 text-xl w-full sm:w-auto rounded-xl"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={modalState.isOpen}
              className="bg-[#0F4C3A] text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-[#16654E] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-black uppercase py-7 px-10 text-xl w-full sm:w-auto rounded-xl"
            >
              Terbitkan Pencarian
            </Button>
          </div>
        </form>
      </div>

      {/* Neo-Brutalist Modal */}
      <AnimatePresence>
        {modalState.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`w-full max-w-md border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-xl flex flex-col items-center text-center relative overflow-hidden ${
                modalState.status === 'success' ? 'bg-[#BBE2EC]' : 
                modalState.status === 'error' ? 'bg-[#ff6b6b]' : 'bg-white'
              }`}
            >
              {modalState.status === 'loading' && (
                <>
                  <Loader2 className="w-16 h-16 animate-spin text-black mb-6" />
                  <h3 className="text-3xl font-black uppercase tracking-wider mb-2">Memproses</h3>
                  <p className="font-bold text-lg">{modalState.message}</p>
                </>
              )}

              {modalState.status === 'success' && (
                <>
                  <div className="w-24 h-24 bg-green-400 border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                    <CheckCircle2 className="w-12 h-12 text-black" />
                  </div>
                  <h3 className="text-4xl font-black uppercase tracking-wider mb-2">BERHASIL!</h3>
                  <p className="font-bold mb-8 text-lg">{modalState.message}</p>
                  <Button 
                    onClick={() => router.push(`/teams/${modalState.teamId}`)}
                    className="w-full bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 font-black uppercase py-7 text-xl rounded-xl hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    Lihat Tim Anda
                  </Button>
                </>
              )}

              {modalState.status === 'error' && (
                <>
                  <div className="w-24 h-24 bg-red-200 border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                    <XCircle className="w-12 h-12 text-black" />
                  </div>
                  <h3 className="text-4xl font-black uppercase tracking-wider mb-2 text-white">GAGAL!</h3>
                  <p className="font-bold mb-8 text-white text-lg">{modalState.message}</p>
                  <Button 
                    onClick={() => setModalState({ isOpen: false, status: 'loading', message: '' })}
                    className="w-full bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 font-black uppercase py-7 text-xl rounded-xl hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    Tutup
                  </Button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
