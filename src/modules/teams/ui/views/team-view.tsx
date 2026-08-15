"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery, useMutation, useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ClockIcon, UsersIcon, ShieldIcon, CheckCircle2, XCircle, Loader2, ArrowLeft, Link as LinkIcon, FileText } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  teamId: string;
};

export const TeamView = ({ teamId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const { user } = useUser();
  const applyMutation = useMutation(trpc.teams.applyToPosition.mutationOptions());

  const [modalState, setModalState] = useState<{ isOpen: boolean; status: 'form' | 'success' | 'error' | 'loading'; message: string; positionId?: number }>({
    isOpen: false,
    status: 'loading',
    message: ''
  });

  const [formData, setFormData] = useState({
    message: '',
    linkedInUrl: '',
    cvUrl: '',
    portfolioUrl: ''
  });

  const { data, refetch } = useSuspenseQuery(
    trpc.teams.getOne.queryOptions({ teamId: Number(teamId) })
  );

  const isLeader = typeof data?.leader === 'object' && data?.leader !== null && data.leader.clerkId === user?.id;

  const { data: applicants } = useQuery({
    ...trpc.teams.getApplicants.queryOptions({ teamId: Number(teamId) }),
    enabled: isLeader,
  });

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F4F0]">
      <div className="text-center p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
        <h2 className="text-2xl font-black uppercase mb-4">Tim Tidak Ditemukan</h2>
        <Button onClick={() => router.back()} className="border-2 border-black font-black uppercase">Kembali</Button>
      </div>
    </div>
  );

  const positions = data.positions || [];

  const handleOpenForm = (positionId: number) => {
    setFormData({ message: '', linkedInUrl: '', cvUrl: '', portfolioUrl: '' });
    setModalState({ isOpen: true, status: 'form', message: '', positionId });
  };

  const submitApplication = async () => {
    if (!modalState.positionId) return;
    
    try {
      setModalState(prev => ({ ...prev, status: 'loading', message: 'Mengirimkan lamaran Anda...' }));
      await applyMutation.mutateAsync({ 
        teamId: Number(teamId), 
        positionId: modalState.positionId,
        message: formData.message,
        linkedInUrl: formData.linkedInUrl,
        cvUrl: formData.cvUrl,
        portfolioUrl: formData.portfolioUrl
      });
      setModalState({ isOpen: true, status: 'success', message: 'ANDA TELAH MELAMAR, SELANJUTNYA ANDA AKAN DI SELEKSI OLEH KETUA TIM!' });
      refetch();
    } catch (e: unknown) {
      const err = e as Error;
      setModalState({ isOpen: true, status: 'error', message: err.message || "Gagal mendaftar. Pastikan Anda belum mendaftar di posisi ini." });
    }
  };

  return (
    <div className="bg-[#F4F4F0] min-h-screen font-sans pb-20">
      {/* Header Banner */}
      <div className="bg-[#ECA823] border-b-4 border-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 relative z-10">
          <button 
            onClick={() => router.back()} 
            className="mb-8 inline-flex items-center gap-2 font-black uppercase text-sm hover:underline"
          >
            <ArrowLeft className="w-5 h-5" /> Kembali
          </button>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-4 py-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-sm rounded-md">
              {data.fieldCategory}
            </span>
            {!data.isClosed ? (
              <span className="px-4 py-2 bg-[#0F4C3A] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-sm rounded-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Open Recruitment
              </span>
            ) : (
              <span className="px-4 py-2 bg-red-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-sm rounded-md">
                Closed
              </span>
            )}
            
            {isLeader && (
              <span className="px-4 py-2 bg-blue-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-sm rounded-md">
                Tim Anda
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.1] text-black drop-shadow-sm mb-6">
            {data.competitionName}
          </h1>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-10 h-10 bg-[#BBE2EC] rounded-full border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <UsersIcon className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-gray-600">Pembuat</p>
                <p className="font-bold text-black">{typeof data.leader === 'object' && data.leader !== null ? data.leader.fullName : data.leader}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-10 h-10 bg-red-200 rounded-full border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <ClockIcon className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-gray-600">Deadline</p>
                <p className="font-bold text-black">{formatDate(data.deadline)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-6 relative z-20 flex flex-col gap-10">
        
        {/* Description Section */}
        <div className="bg-white border-4 border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
          <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-4 mb-6 tracking-wider">Deskripsi & Ide Proyek</h2>
          <div className="whitespace-pre-wrap text-lg font-medium leading-relaxed text-gray-800">
            {data.projectSynopsis || <span className="italic text-gray-400">Tidak ada deskripsi yang diberikan.</span>}
          </div>
        </div>

        {/* Positions Section */}
        <div className="bg-[#BBE2EC] border-4 border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
          <div className="flex items-center gap-4 border-b-4 border-black pb-4 mb-8">
            <ShieldIcon className="w-8 h-8" />
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider">Posisi yang Dibutuhkan</h2>
          </div>

          {positions.length === 0 ? (
            <div className="p-8 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl text-center">
              <p className="font-black text-xl text-gray-500 uppercase">Belum ada posisi yang dibuka.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {positions.map((pos: any) => {
                const isFull = pos.slotsFilled >= pos.slotsTotal;
                const hasApplied = pos.hasApplied;
                
                return (
                  <div key={pos.id} className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl flex flex-col justify-between overflow-hidden group hover:-translate-y-1 transition-transform">
                    <div className="p-6 md:p-8">
                      <div className="flex justify-between items-start mb-4">
                         <h3 className="text-2xl font-black uppercase tracking-tight line-clamp-2 pr-2">{pos.roleTitle}</h3>
                        <span className={`px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-xs rounded-md whitespace-nowrap ${isFull ? 'bg-red-400 text-white' : 'bg-green-400 text-black'}`}>
                          {pos.slotsFilled} / {pos.slotsTotal} Isi
                        </span>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-xs font-black uppercase text-gray-500 mb-2 tracking-wider">Persyaratan Keahlian:</p>
                        <div className="flex flex-wrap gap-2">
                          {pos.skillsRequired?.length > 0 ? (
                            pos.skillsRequired.map((s: any, i: number) => (
                              <span key={i} className="px-3 py-1 bg-[#F4F4F0] border-2 border-black font-bold text-sm rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                {s.skill}
                              </span>
                            ))
                          ) : (
                            <span className="italic text-gray-400 font-bold">Tidak ada spesifikasi khusus</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Area */}
                    <div className="p-6 md:p-8 bg-gray-50 border-t-4 border-black">
                      {isLeader ? (
                        <div className="text-center p-3 border-2 border-dashed border-gray-400 bg-gray-100 rounded-lg">
                          <p className="font-bold text-gray-500">Anda adalah ketua tim ini</p>
                        </div>
                      ) : hasApplied ? (
                        <div className="text-center p-4 border-4 border-black bg-blue-100 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <p className="font-black text-blue-800 uppercase">Telah Melamar</p>
                        </div>
                      ) : (
                        <Button 
                          className="w-full bg-[#0F4C3A] text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#16654E] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-black uppercase py-6 text-lg rounded-xl" 
                          disabled={data.isClosed || isFull}
                          onClick={() => handleOpenForm(pos.id)}
                        >
                          {isFull ? "Posisi Penuh" : "Lamar Posisi Ini"}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Applicants Section (LEADER ONLY) */}
        {isLeader && applicants && (
          <div className="bg-white border-4 border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
            <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-4 mb-6 tracking-wider">Daftar Pelamar</h2>
            {applicants.length === 0 ? (
              <p className="italic text-gray-500 font-bold">Belum ada yang melamar ke tim Anda.</p>
            ) : (
              <div className="space-y-4">
                {applicants.map((app: any) => {
                  const roleName = typeof app.vacancy === 'object' && app.vacancy ? app.vacancy.roleTitle : "Posisi";
                  const applicantName = typeof app.applicant === 'object' && app.applicant ? app.applicant.fullName : "User";
                  
                  return (
                    <div key={app.id} className="border-4 border-black rounded-xl p-6 bg-slate-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex justify-between items-start mb-4 border-b-2 border-black pb-4">
                        <div>
                          <h4 className="text-xl font-black uppercase text-black">{applicantName}</h4>
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 border-2 border-black font-black text-xs uppercase mt-1 rounded-md">
                            Melamar: {roleName}
                          </span>
                        </div>
                        <span className={`px-3 py-1 border-2 border-black font-black text-xs uppercase rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                          app.status === 'PENDING' ? 'bg-yellow-300 text-black' : 
                          app.status === 'ACCEPTED' ? 'bg-green-400 text-black' : 'bg-red-400 text-white'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-black uppercase text-gray-500 mb-1">Pitch Statement</p>
                          <p className="font-medium text-black bg-white p-3 border-2 border-black rounded-lg">{app.pitchStatement}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 mt-4">
                          {app.linkedInUrl && (
                            <a href={app.linkedInUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-bold bg-blue-50 text-blue-700 px-3 py-1.5 border-2 border-black rounded-md hover:bg-blue-100">
                              <LinkIcon className="w-4 h-4" /> LinkedIn
                            </a>
                          )}
                          {app.cvUrl && (
                            <a href={app.cvUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-bold bg-red-50 text-red-700 px-3 py-1.5 border-2 border-black rounded-md hover:bg-red-100">
                              <FileText className="w-4 h-4" /> CV
                            </a>
                          )}
                          {app.portfolioUrl && (
                            <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-bold bg-purple-50 text-purple-700 px-3 py-1.5 border-2 border-black rounded-md hover:bg-purple-100">
                              <LinkIcon className="w-4 h-4" /> Portfolio
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Neo-Brutalist Modal */}
      <AnimatePresence>
        {modalState.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`w-full max-w-lg border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-xl flex flex-col relative overflow-hidden ${
                modalState.status === 'success' ? 'bg-[#ECA823] items-center text-center' : 
                modalState.status === 'error' ? 'bg-[#ff6b6b] items-center text-center' : 
                modalState.status === 'loading' ? 'bg-white items-center text-center' : 'bg-white'
              }`}
            >
              {modalState.status === 'form' && (
                <>
                  <h3 className="text-2xl font-black uppercase tracking-wider mb-6 border-b-4 border-black pb-4 text-center">Formulir Pendaftaran Tim</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-1">Pitch Statement <span className="text-red-500">*</span></label>
                      <Textarea 
                        placeholder="Kenapa kamu cocok di posisi ini?" 
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all min-h-[100px]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-1">Link LinkedIn <span className="text-gray-400 font-bold normal-case">(Opsional)</span></label>
                      <Input 
                        placeholder="https://linkedin.com/in/..." 
                        value={formData.linkedInUrl}
                        onChange={(e) => setFormData({...formData, linkedInUrl: e.target.value})}
                        className="border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-1">Link CV <span className="text-gray-400 font-bold normal-case">(Opsional)</span></label>
                      <Input 
                        placeholder="Link Google Drive / PDF" 
                        value={formData.cvUrl}
                        onChange={(e) => setFormData({...formData, cvUrl: e.target.value})}
                        className="border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-1">Link Portfolio <span className="text-gray-400 font-bold normal-case">(Opsional)</span></label>
                      <Input 
                        placeholder="Link Behance / Dribbble / Github / dsb" 
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
                        className="border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      variant="outline"
                      onClick={() => setModalState({ isOpen: false, status: 'loading', message: '' })}
                      className="flex-1 bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 font-black uppercase py-6 rounded-xl hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      Batal
                    </Button>
                    <Button 
                      onClick={submitApplication}
                      disabled={!formData.message.trim()}
                      className="flex-1 bg-blue-600 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-700 font-black uppercase py-6 rounded-xl hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      Kirim Lamaran
                    </Button>
                  </div>
                </>
              )}

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
                  <h3 className="text-3xl font-black uppercase tracking-wider mb-4 text-black leading-tight text-center">BERHASIL!</h3>
                  <p className="font-black mb-8 text-black text-xl text-center leading-relaxed px-4">{modalState.message}</p>
                  <Button 
                    onClick={() => setModalState({ isOpen: false, status: 'loading', message: '' })}
                    className="w-full bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 font-black uppercase py-7 text-xl rounded-xl hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    Tutup
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

