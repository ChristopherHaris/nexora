"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GraduationCap, BookOpen, CalendarCheck, PlusCircle, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import { FindTutorView } from "@/modules/peer-learning/ui/views/find-tutor-view";
import { MentoringSessionView } from "@/modules/peer-learning/ui/views/mentoring-session-view";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function PeerLearningPage() {
  const trpc = useTRPC();
  const [activeTab, setActiveTab] = useState<"find" | "sessions" | "my-profiles">("find");
  
  const [modalState, setModalState] = useState<{ isOpen: boolean; type: 'register' | 'loading' | 'success' | 'error'; message: string }>({
    isOpen: false,
    type: 'loading',
    message: ''
  });

  const [tutorForm, setTutorForm] = useState({
    title: "",
    skills: "",
    coinRatePerHour: 50,
    bio: "",
    cvUrl: "",
    portfolioUrl: "",
  });

  const { data: tutors, isLoading: loadingTutors, refetch: refetchTutors } = useQuery(
    trpc.peerLearning.findTutors.queryOptions()
  );

  const { data: sessions, isLoading: loadingSessions } = useQuery(
    trpc.peerLearning.getMySessions.queryOptions()
  );

  const { data: myProfiles, isLoading: loadingMyProfiles } = useQuery(
    trpc.peerLearning.getMyTutorProfiles.queryOptions()
  );

  const registerTutorMutation = useMutation(trpc.peerLearning.registerTutor.mutationOptions());

  const handleRegisterTutor = async () => {
    if (!tutorForm.title || !tutorForm.skills || !tutorForm.bio || !tutorForm.cvUrl) return;
    try {
      setModalState({ isOpen: true, type: 'loading', message: 'Mendaftarkan Profil Tutor...' });
      await registerTutorMutation.mutateAsync({
        title: tutorForm.title,
        skills: tutorForm.skills.split(",").map(s => s.trim()),
        coinRatePerHour: Number(tutorForm.coinRatePerHour),
        bio: tutorForm.bio,
        cvUrl: tutorForm.cvUrl,
        portfolioUrl: tutorForm.portfolioUrl || undefined,
      });
      setModalState({ isOpen: true, type: 'success', message: 'Pendaftaran Berhasil! Anda sekarang resmi menjadi Tutor.' });
      refetchTutors();
    } catch (e: any) {
      setModalState({ isOpen: true, type: 'error', message: e.message || 'Gagal mendaftar sebagai Tutor.' });
    }
  };

  if (loadingTutors && loadingSessions) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { key: "find", label: "Cari Tutor", icon: BookOpen },
    { key: "sessions", label: "Jadwal Saya", icon: CalendarCheck },
    { key: "my-profiles", label: "Profil Tutor Saya", icon: GraduationCap },
  ] as const;

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200 rounded-bl-full border-b-4 border-l-4 border-black -mr-4 -mt-4 opacity-40" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase mb-4">
            <GraduationCap className="w-4 h-4" /> Peer Learning
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight uppercase">
            Belajar Bareng
          </h1>
          <p className="text-base font-bold text-slate-600 max-w-xl">
            Cari kakak tingkat atau ahli di bidangnya. Booking sesi mentoring dan bayar pakai Nexora Coins!
          </p>
        </div>

        <div className="relative z-10 w-full md:w-auto">
          <Button 
            onClick={() => setModalState({ isOpen: true, type: 'register', message: '' })}
            className="w-full md:w-auto font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all h-12 bg-primary text-white"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Daftar Jadi Tutor
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-4 border-black pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-black uppercase border-2 border-black rounded-t-xl transition-all ${
              activeTab === tab.key
                ? "bg-[#ECA823] text-slate-900 shadow-[2px_-2px_0px_0px_rgba(0,0,0,1)] border-b-0 mb-[-4px] pb-4"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "find" && (
          <FindTutorView tutors={(tutors ?? []).filter(Boolean) as any} />
        )}
        {activeTab === "sessions" && (
          <MentoringSessionView sessions={sessions ?? []} />
        )}
        {activeTab === "my-profiles" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {myProfiles?.map((profile: any) => (
              <div key={profile.id} className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black uppercase line-clamp-2">{profile.title}</h3>
                  <span className={`text-xs font-black uppercase px-2 py-1 border-2 border-black ${profile.status === 'APPROVED' ? 'bg-green-400' : 'bg-yellow-400'}`}>
                    {profile.status}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-600 mb-4 line-clamp-3">{profile.bio}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.skills.map((skill: string, idx: number) => (
                    <span key={idx} className="text-xs bg-slate-100 border-2 border-black px-2 py-1 font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t-4 border-black pt-4">
                  <span className="font-black text-amber-600">{profile.coinRatePerHour} Koin/Jam</span>
                  <span className="text-sm font-bold text-slate-500">{profile.totalSessions} Selesai</span>
                </div>
              </div>
            ))}
            {myProfiles?.length === 0 && (
              <div className="col-span-full border-4 border-dashed border-slate-300 p-12 text-center">
                <p className="text-lg font-bold text-slate-500 uppercase">Anda belum memiliki Profil Tutor.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tutor Registration Modal */}
      <AnimatePresence>
        {modalState.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              {modalState.type === 'register' && (
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Daftar Jadi Tutor</h3>
                  <p className="text-sm font-bold text-slate-500 mb-6">Bagikan ilmu Anda dan dapatkan penghasilan berupa Nexora Coins.</p>
                  
                  <div>
                    <label className="text-xs font-black uppercase text-slate-900 mb-1 block">Judul Gig Tutor</label>
                    <Input 
                      placeholder="e.g. Tutor ReactJS Masterclass"
                      value={tutorForm.title}
                      onChange={(e) => setTutorForm({...tutorForm, title: e.target.value})}
                      className="border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-slate-900 mb-1 block">Keahlian (Pisahkan dengan koma)</label>
                    <Input 
                      placeholder="e.g. Matematika, UI/UX Design, React"
                      value={tutorForm.skills}
                      onChange={(e) => setTutorForm({...tutorForm, skills: e.target.value})}
                      className="border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs font-black uppercase text-slate-900 mb-1 block">Tarif per Jam (Koin)</label>
                      <Input 
                        type="number"
                        value={tutorForm.coinRatePerHour}
                        onChange={(e) => setTutorForm({...tutorForm, coinRatePerHour: Number(e.target.value)})}
                        className="border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black text-amber-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-slate-900 mb-1 block">Deskripsi Singkat (Bio)</label>
                    <Input 
                      placeholder="Ceritakan pengalaman dan gaya mengajar Anda..."
                      value={tutorForm.bio}
                      onChange={(e) => setTutorForm({...tutorForm, bio: e.target.value})}
                      className="border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-black uppercase text-slate-900 mb-1 block">Link CV (Wajib)</label>
                    <Input 
                      placeholder="https://..."
                      value={tutorForm.cvUrl}
                      onChange={(e) => setTutorForm({...tutorForm, cvUrl: e.target.value})}
                      className="border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-slate-900 mb-1 block">Link Portfolio (Opsional)</label>
                    <Input 
                      placeholder="https://..."
                      value={tutorForm.portfolioUrl}
                      onChange={(e) => setTutorForm({...tutorForm, portfolioUrl: e.target.value})}
                      className="border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
                    />
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setModalState({ isOpen: false, type: 'loading', message: '' })}
                      className="flex-1 border-2 border-black font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
                    >
                      Batal
                    </Button>
                    <Button 
                      onClick={handleRegisterTutor}
                      disabled={!tutorForm.title || !tutorForm.skills || !tutorForm.bio || !tutorForm.cvUrl}
                      className="flex-1 bg-primary text-white border-2 border-black font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
                    >
                      Daftar Sekarang
                    </Button>
                  </div>
                </div>
              )}

              {modalState.type === 'loading' && (
                <div className="py-10 flex flex-col items-center text-center">
                  <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
                  <h3 className="text-2xl font-black uppercase text-slate-900">Memproses...</h3>
                  <p className="font-bold text-slate-500 mt-2">{modalState.message}</p>
                </div>
              )}

              {modalState.type === 'success' && (
                <div className="py-6 flex flex-col items-center text-center">
                  <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
                  <h3 className="text-4xl font-black uppercase text-slate-900 mb-4">Berhasil!</h3>
                  <p className="font-bold text-slate-600 mb-8">{modalState.message}</p>
                  <Button 
                    onClick={() => setModalState({ isOpen: false, type: 'loading', message: '' })}
                    className="w-full bg-black text-white hover:bg-slate-800 border-2 border-black font-black uppercase py-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Lanjut
                  </Button>
                </div>
              )}

              {modalState.type === 'error' && (
                <div className="py-6 flex flex-col items-center text-center">
                  <ShieldAlert className="w-20 h-20 text-red-500 mb-6" />
                  <h3 className="text-4xl font-black uppercase text-slate-900 mb-4">Gagal!</h3>
                  <p className="font-bold text-slate-600 mb-8">{modalState.message}</p>
                  <Button 
                    onClick={() => setModalState({ isOpen: false, type: 'loading', message: '' })}
                    className="w-full bg-black text-white hover:bg-slate-800 border-2 border-black font-black uppercase py-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
