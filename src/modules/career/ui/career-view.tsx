"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Briefcase, GraduationCap, ArrowRight, ExternalLink, Trophy, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CareerView() {
  const trpc = useTRPC();
  const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);
  const [selectedPathId, setSelectedPathId] = useState<number | null>(null);

  // Fetch majors
  const { data: majors = [], isLoading: isLoadingMajors } = useQuery(
    trpc.career.getMajors.queryOptions()
  );

  // Fetch paths based on selected major
  const { data: paths = [], isLoading: isLoadingPaths, refetch } = useQuery(
    trpc.career.getCareerPaths.queryOptions({
      majorId: selectedMajorId || undefined,
    })
  );

  const toggleSkillMutation = useMutation(trpc.career.toggleSkillProgress.mutationOptions());

  const handleToggleSkill = async (skillId: number, currentStatus: boolean) => {
    await toggleSkillMutation.mutateAsync({
      skillId,
      isCompleted: !currentStatus,
    });
    refetch(); // Refetch paths to update progress
  };

  const selectedPath = paths.find((p) => p.id === selectedPathId) || paths[0];

  if (isLoadingMajors) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#ECA823] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] p-6 lg:p-12 font-sans overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-[#ECA823]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="max-w-6xl mx-auto flex flex-col gap-8 relative z-10">
        {/* Header section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center gap-4 mb-8"
        >
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_rgba(236,168,35,1)]">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-black uppercase text-black tracking-tight">
            Career Compass
          </h1>
          <p className="text-lg md:text-xl font-bold text-slate-600 max-w-2xl">
            Peta arah karier dan panduan skill yang wajib kamu kuasai berdasarkan jurusanmu.
          </p>
        </motion.div>

        {/* Major Selector */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#ECA823] rounded-xl flex items-center justify-center border-2 border-black">
              <GraduationCap className="w-6 h-6 text-black stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase">Pilih Jurusanmu</h2>
              <p className="text-slate-500 font-bold text-sm">Sesuaikan rekomendasi karier dengan program studimu.</p>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <select
              className="w-full md:w-64 h-12 px-4 bg-[#F4F4F0] border-2 border-black rounded-xl font-bold focus:ring-4 focus:ring-primary/20 transition-all outline-none"
              value={selectedMajorId || ""}
              onChange={(e) => {
                setSelectedMajorId(Number(e.target.value));
                setSelectedPathId(null);
              }}
            >
              <option value="" disabled>-- Pilih Jurusan --</option>
              {majors.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Loading state for paths */}
        {isLoadingPaths && selectedMajorId && (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Content Area */}
        {!isLoadingPaths && paths.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar: Career Paths */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
              <h3 className="font-black uppercase text-xl mb-2 flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" /> Jalur Karier
              </h3>
              <div className="flex flex-col gap-3">
                {paths.map((path) => (
                  <button
                    key={path.id}
                    onClick={() => setSelectedPathId(path.id)}
                    className={`text-left p-5 border-4 rounded-2xl font-bold transition-all duration-300 ${
                      selectedPath?.id === path.id
                        ? "bg-black border-black text-white shadow-[6px_6px_0px_0px_rgba(236,168,35,1)] translate-x-2"
                        : "bg-white border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                    }`}
                  >
                    <h4 className="text-lg uppercase font-black">{path.title}</h4>
                    <p className={`text-sm mt-1 line-clamp-2 ${selectedPath?.id === path.id ? "text-slate-300" : "text-slate-500"}`}>
                      {path.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content: Skill Roadmap */}
            <div className="w-full lg:w-2/3">
              <AnimatePresence mode="wait">
                {selectedPath && (
                  <motion.div
                    key={selectedPath.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border-4 border-black rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full"
                  >
                    <div className="mb-8">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ECA823] text-black border-2 border-black rounded-full font-black text-xs uppercase mb-4">
                        <Trophy className="w-4 h-4" /> Roadmap Karier
                      </div>
                      <h2 className="text-3xl font-black uppercase text-black mb-3">
                        {selectedPath.title}
                      </h2>
                      <p className="text-slate-600 font-bold">
                        {selectedPath.description}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    {(() => {
                      const totalSkills = selectedPath.skills?.length || 0;
                      const completedSkills = selectedPath.skills?.filter(s => s.isCompleted).length || 0;
                      const progressPercent = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;
                      
                      return (
                        <div className="mb-8 p-4 bg-[#F4F4F0] border-2 border-black rounded-2xl">
                          <div className="flex justify-between items-center mb-2 font-black uppercase">
                            <span className="text-sm">Kesiapan Karier</span>
                            <span className="text-xl text-primary">{progressPercent}%</span>
                          </div>
                          <div className="h-4 bg-slate-200 border-2 border-black rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-primary"
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercent}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      );
                    })()}

                    {/* Skills Checklist */}
                    <h3 className="font-black uppercase text-lg mb-4 flex items-center gap-2">
                      Skill Checklist
                    </h3>
                    
                    <div className="flex flex-col gap-4">
                      {selectedPath.skills?.map((skill, index) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center justify-between p-4 border-2 rounded-xl transition-all ${
                            skill.isCompleted
                              ? "bg-primary/10 border-primary text-black"
                              : "bg-white border-slate-200 hover:border-black"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => handleToggleSkill(skill.id, skill.isCompleted)}
                              disabled={toggleSkillMutation.isPending}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              {skill.isCompleted ? (
                                <CheckCircle2 className="w-8 h-8 text-primary fill-primary/20" />
                              ) : (
                                <Circle className="w-8 h-8 text-slate-300 hover:text-black" />
                              )}
                            </button>
                            <div>
                              <h4 className={`font-bold text-lg ${skill.isCompleted ? "line-through text-slate-500" : "text-black"}`}>
                                {skill.skillName}
                              </h4>
                              {skill.isCertification && (
                                <span className="inline-block mt-1 text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 rounded-full">
                                  Sertifikasi
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {skill.resourceUrl && (
                            <a 
                              href={skill.resourceUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
                            >
                              Belajar <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </motion.div>
                      ))}
                      
                      {(!selectedPath.skills || selectedPath.skills.length === 0) && (
                        <div className="p-8 text-center border-2 border-dashed border-slate-300 rounded-2xl">
                          <p className="font-bold text-slate-500">Belum ada skill yang dipetakan untuk jalur ini.</p>
                        </div>
                      )}
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Empty state when no major selected or no paths found */}
        {!isLoadingPaths && selectedMajorId && paths.length === 0 && (
          <div className="bg-white border-4 border-black rounded-3xl p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-black uppercase mb-2">Belum Ada Data Karier</h2>
            <p className="text-slate-500 font-bold">
              Maaf, roadmap karier untuk jurusan ini belum tersedia.
            </p>
          </div>
        )}

        {!selectedMajorId && !isLoadingMajors && (
          <div className="bg-[#ECA823]/20 border-4 border-[#ECA823] border-dashed rounded-3xl p-12 text-center mt-4">
            <h2 className="text-2xl font-black uppercase mb-2 text-black">Pilih Jurusan Terlebih Dahulu</h2>
            <p className="text-slate-700 font-bold">
              Untuk melihat rekomendasi karier, silakan pilih jurusanmu di menu dropdown atas.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
