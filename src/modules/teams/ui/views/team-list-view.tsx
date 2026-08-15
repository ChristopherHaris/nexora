"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Suspense, useState } from "react";
import { TeamList, TeamListSkeleton } from "@/modules/teams/ui/components/team-list";
import { TeamSort } from "@/modules/teams/ui/components/team-sort";
import { TeamFilters } from "@/modules/teams/ui/components/team-filters";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Filter, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TeamListView = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-[#F4F4F0] min-h-screen flex flex-col font-sans">
      {/* Hero Header */}
      <div className="border-b-2 border-black bg-[#ECA823] overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-10 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white text-black w-max font-black text-sm uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Teammate Matcher</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.2] drop-shadow-sm text-slate-900">
              TEMUKAN <br/>
              <span className="text-white bg-[#0F4C3A] px-2 border-y-2 border-black inline-block my-1">REKAN TIM</span> <br/>
              SEFREKUENSI
            </h1>
            <p className="text-base md:text-lg font-bold text-slate-800 max-w-xl border-l-4 border-black pl-4">
              Cari rekan tim yang memiliki visi yang sama untuk kompetisi selanjutnya. Filter berdasarkan bidang lomba atau cari berdasarkan kemampuan yang kamu miliki.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-full lg:w-1/3 hidden lg:flex items-center justify-center"
          >
            <div className="w-56 h-56 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl flex flex-col items-center justify-center text-slate-900 hover:rotate-0 hover:-translate-y-2 transition-all cursor-pointer">
              <Zap className="w-20 h-20 mb-4 text-[#ECA823]" />
              <span className="text-2xl font-black uppercase">Get Matched</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 flex flex-col lg:flex-row gap-10 w-full flex-1">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex justify-between items-center w-full mb-4">
          <h2 className="text-2xl font-black uppercase">Tim Aktif</h2>
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            className="border-2 border-black bg-white hover:bg-gray-100 text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Sidebar */}
        <AnimatePresence>
          {(showFilters || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full lg:w-[320px] shrink-0 lg:block overflow-hidden lg:overflow-visible"
            >
              <div className="sticky top-24 flex flex-col gap-6 bg-[#F4F4F0] lg:bg-transparent pb-6 lg:pb-0 z-20">
                <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                  <div className="border-b-2 border-black pb-4 mb-2 flex items-center justify-between">
                    <h3 className="font-black text-xl uppercase tracking-wider">Urutkan</h3>
                    <button className="lg:hidden" onClick={() => setShowFilters(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <TeamSort />
                </div>
                
                <div className="bg-[#0F4C3A] p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                  <div className="border-b-2 border-black pb-4 mb-2 flex items-center justify-between border-[#16654E]">
                    <h3 className="font-black text-xl uppercase tracking-wider text-white">Filter Bidang</h3>
                  </div>
                  <div className="bg-white p-4 border-2 border-black rounded-lg shadow-sm">
                    <TeamFilters />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 w-full"
        >
          <div className="hidden lg:flex mb-6 items-center justify-between border-b-2 border-black pb-4">
            <h2 className="text-2xl font-black uppercase tracking-tight">Daftar Tim Aktif</h2>
            <span className="font-bold px-4 py-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-md text-sm">
              Real-time
            </span>
          </div>

          <ScrollArea className="rounded-xl h-[600px] lg:h-[700px] bg-white border-2 border-black p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Suspense fallback={<TeamListSkeleton />}>
              <TeamList />
            </Suspense>
          </ScrollArea>
        </motion.div>
        
      </div>
    </div>
  );
};
