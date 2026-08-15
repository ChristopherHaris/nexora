"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Clock, CheckCircle2, Crosshair, Loader2, UserCircle2, ShieldAlert, FileText, CheckSquare, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const statusConfig = {
  OPEN: { label: "TERSEDIA", color: "bg-white text-black border-black", icon: Crosshair },
  TAKEN: { label: "DIKERJAKAN", color: "bg-blue-400 text-black border-black", icon: Clock },
  COMPLETED: { label: "SELESAI", color: "bg-green-400 text-black border-black", icon: CheckCircle2 },
};

export default function CampusGigsPage() {
  const trpc = useTRPC();
  const { data: gigs, isLoading, refetch } = useQuery(trpc.gamification.getGigs.queryOptions());
  
  const takeMutation = useMutation(trpc.gamification.takeGig.mutationOptions());
  const completeMutation = useMutation(trpc.gamification.completeGig.mutationOptions());

  const [modalState, setModalState] = useState<{ 
    isOpen: boolean; 
    type: 'take' | 'submit' | 'loading' | 'success' | 'error'; 
    message: string; 
    gigId?: number;
  }>({
    isOpen: false,
    type: 'loading',
    message: ''
  });
  
  const [submissionUrl, setSubmissionUrl] = useState("");

  const handleTake = async (id: number) => {
    try {
      setModalState({ isOpen: true, type: 'loading', message: 'Menerima Gig...' });
      await takeMutation.mutateAsync({ gigId: id });
      setModalState({ isOpen: true, type: 'success', message: 'GIG DITERIMA! Silakan mulai kerjakan dan kumpulkan sebelum deadline.' });
      refetch();
    } catch (e: any) {
      setModalState({ isOpen: true, type: 'error', message: e.message || 'Gagal menerima gig.' });
    }
  };

  const openSubmitModal = (id: number) => {
    setSubmissionUrl("");
    setModalState({ isOpen: true, type: 'submit', message: '', gigId: id });
  };

  const handleSubmit = async () => {
    if (!modalState.gigId || !submissionUrl) return;
    try {
      setModalState({ ...modalState, type: 'loading', message: 'Mengirimkan hasil & transfer koin...' });
      await completeMutation.mutateAsync({ gigId: modalState.gigId, submissionUrl });
      setModalState({ isOpen: true, type: 'success', message: 'GIG SELESAI! Koin dan XP telah ditransfer ke Wallet Anda.' });
      refetch();
    } catch (e: any) {
      setModalState({ isOpen: true, type: 'error', message: e.message || 'Gagal mengirim hasil.' });
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="bg-[#00FFFF] p-6 sm:p-8 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-bl-full border-b-4 border-l-4 border-black -mr-4 -mt-4 opacity-40" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase mb-4">
            <FileText className="w-4 h-4" /> Freelance Marketplace
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight uppercase">
            Campus Gigs
          </h1>
          <p className="text-base font-bold text-slate-900/80 max-w-xl">
            Kerjakan proyek freelance dari perusahaan mitra atau pihak luar dan dapatkan komisi berupa Nexora Coins!
          </p>
        </div>
      </div>

      {/* Gigs List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
            <p className="text-slate-500 font-bold uppercase">Memuat Gigs...</p>
          </div>
        ) : gigs?.length === 0 ? (
          <div className="border-4 border-black border-dashed p-12 text-center text-slate-500 font-bold rounded-2xl bg-white">
            BELUM ADA GIGS YANG TERSEDIA SAAT INI.
          </div>
        ) : (
          gigs?.map((gig: any) => {
            const statusStr = (gig.status || "OPEN") as keyof typeof statusConfig;
            const cfg = statusConfig[statusStr] || statusConfig.OPEN;
            const Icon = cfg.icon;
            
            return (
              <div 
                key={gig.id} 
                className={`bg-white border-4 border-black rounded-2xl p-0 flex flex-col md:flex-row shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden`}
              >
                {/* Left Side: Info */}
                <div className="flex-1 p-6 md:p-8 border-b-4 md:border-b-0 md:border-r-4 border-black relative">
                  {gig.isWorker && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-black px-4 py-2 border-b-4 border-l-4 border-black">
                      GIG ANDA
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className={`flex items-center gap-2 px-3 py-1 font-black text-xs md:text-sm border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-md ${cfg.color}`}>
                      <Icon className="w-4 h-4" /> {cfg.label}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-700 border-2 border-black rounded-md px-3 py-1 font-bold">
                      {gig.category}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-none uppercase">
                    {gig.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3 inline-flex border-2 border-black rounded-xl">
                    <Briefcase className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">DIPOSTING OLEH</p>
                      <p className="text-sm font-black text-slate-900">{gig.posterName || 'Partner/Perusahaan'}</p>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-slate-600 mb-8 max-w-3xl line-clamp-3">
                    {gig.description}
                  </p>

                  {statusStr === "COMPLETED" && (
                    <div className="text-xs font-bold text-green-700 mb-4 bg-green-100 p-3 border-2 border-green-500 rounded-lg inline-block">
                      LINK HASIL KERJA: {gig.submissionUrl}
                    </div>
                  )}
                </div>

                {/* Right Side: Rewards & Action */}
                <div className="w-full md:w-72 bg-slate-50 p-6 md:p-8 flex flex-col justify-between items-center text-center">
                  <div className="w-full">
                    <p className="text-xs font-black text-slate-500 mb-4 tracking-widest border-b-2 border-slate-200 pb-2">KOMISI (FEE)</p>
                    <div className="flex flex-col gap-3 mb-8">
                      <div className="bg-[#ECA823] text-black font-black text-3xl py-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {gig.budgetCoins} KOIN
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <p className="text-xs font-bold text-slate-500 mb-2">DEADLINE: {gig.deadline ? new Date(gig.deadline).toLocaleDateString() : 'N/A'}</p>
                    
                    {statusStr === "OPEN" && !gig.isOwner && (
                      <Button onClick={() => handleTake(gig.id)} className="w-full h-14 font-black text-lg bg-black text-white hover:bg-slate-800 border-4 border-black transition-all rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-2">
                        AMBIL GIG
                      </Button>
                    )}
                    {statusStr === "TAKEN" && gig.isWorker && (
                      <Button onClick={() => openSubmitModal(gig.id)} className="w-full h-14 font-black text-lg bg-blue-500 text-white hover:bg-blue-600 border-4 border-black transition-all rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-2">
                        KUMPULKAN HASIL
                      </Button>
                    )}
                    {statusStr === "TAKEN" && !gig.isWorker && (
                      <Button disabled className="w-full h-14 font-black text-lg bg-slate-200 text-slate-500 border-4 border-slate-300 transition-all rounded-xl mt-2">
                        SUDAH DIAMBIL
                      </Button>
                    )}
                    {statusStr === "COMPLETED" && (
                      <Button disabled className="w-full h-14 font-black text-lg bg-green-100 border-4 border-green-500 text-green-700 rounded-xl mt-2">
                        SELESAI
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalState.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg border-4 border-black p-8 rounded-2xl flex flex-col relative overflow-hidden bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
            >
              {modalState.type === 'submit' && (
                <>
                  <h3 className="text-3xl font-black mb-4 uppercase">Kumpulkan Hasil Kerja</h3>
                  <p className="text-sm font-bold text-slate-500 mb-6">Masukkan link hasil pekerjaan (Google Drive / GitHub / dll).</p>
                  
                  <Input 
                    placeholder="https://..." 
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    className="mb-8 border-2 border-black font-bold h-14 text-lg rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                  
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => setModalState({ isOpen: false, type: 'loading', message: '' })}
                      className="flex-1 bg-white border-2 border-black text-black hover:bg-slate-100 rounded-xl h-14 font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      Batal
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={!submissionUrl.trim()}
                      className="flex-1 bg-primary text-white border-2 border-black hover:bg-primary/90 rounded-xl h-14 font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      Kirim
                    </Button>
                  </div>
                </>
              )}

              {modalState.type === 'loading' && (
                <div className="py-10 flex flex-col items-center text-center">
                  <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
                  <h3 className="text-2xl font-black uppercase">Memproses...</h3>
                  <p className="font-bold text-slate-500 mt-2">{modalState.message}</p>
                </div>
              )}

              {modalState.type === 'success' && (
                <div className="py-6 flex flex-col items-center text-center">
                  <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
                  <h3 className="text-4xl font-black uppercase mb-4">Berhasil!</h3>
                  <p className="font-bold text-slate-600 mb-8">{modalState.message}</p>
                  <Button 
                    onClick={() => setModalState({ isOpen: false, type: 'loading', message: '' })}
                    className="w-full bg-black text-white hover:bg-slate-800 border-2 border-black font-black py-6 text-xl rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Lanjut
                  </Button>
                </div>
              )}

              {modalState.type === 'error' && (
                <div className="py-6 flex flex-col items-center text-center">
                  <ShieldAlert className="w-20 h-20 text-red-500 mb-6" />
                  <h3 className="text-4xl font-black uppercase mb-4">Gagal!</h3>
                  <p className="font-bold text-slate-600 mb-8">{modalState.message}</p>
                  <Button 
                    onClick={() => setModalState({ isOpen: false, type: 'loading', message: '' })}
                    className="w-full bg-black text-white hover:bg-slate-800 border-2 border-black font-black py-6 text-xl rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Tutup
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
