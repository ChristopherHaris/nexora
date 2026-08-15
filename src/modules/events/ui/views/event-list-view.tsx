"use client";

import { Suspense, useState } from "react";
import { EventList, EventListSkeleton } from "@/modules/events/ui/components/event-list";
import { EventSort } from "@/modules/events/ui/components/event-sort";
import { EventFilters } from "@/modules/events/ui/components/event-filters";
import { Star, Trophy, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const EventListView = () => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="bg-[#F4F4F0] min-h-screen flex flex-col font-sans">
      {/* Neo-brutalist Hero Header */}
      <div className="border-b-2 border-black bg-[#0F4C3A] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#16654E] transform skew-x-12 translate-x-20 hidden lg:block border-l-2 border-black" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-10 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-yellow-400 text-black w-max font-black text-sm uppercase tracking-wider">
              <Star className="w-4 h-4" />
              <span>NEXORA EVENT HUB</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.2] drop-shadow-sm">
              TEMUKAN <br/>
              <span className="text-[#0F4C3A] bg-yellow-400 px-2 border-y-2 border-black inline-block my-1">LOMBA & ACARA</span> <br/>
              TERBAIK
            </h1>
            <p className="text-base md:text-lg font-bold text-green-50 max-w-xl border-l-4 border-yellow-400 pl-4">
              Pusat informasi lengkap untuk segala perlombaan, seminar, dan aktivitas kampus. Tingkatkan portofolio akademikmu sekarang!
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 3 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-full lg:w-1/3 hidden lg:flex items-center justify-center"
          >
            <div className="w-56 h-56 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl flex flex-col items-center justify-center text-[#0F4C3A] hover:rotate-0 hover:-translate-y-2 transition-all cursor-pointer">
              <Trophy className="w-20 h-20 mb-4 text-yellow-500" />
              <span className="text-2xl font-black uppercase">Start Winning</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 w-full flex-1">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-black uppercase">Daftar Lomba</h2>
          <Button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="border-2 border-black bg-yellow-400 hover:bg-yellow-500 text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 relative">
          
          {/* Sidebar Filters */}
          <AnimatePresence>
            {(showMobileFilters || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
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
                      <button className="lg:hidden" onClick={() => setShowMobileFilters(false)}>
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <EventSort />
                  </div>
                  
                  <div className="bg-yellow-400 p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                    <div className="border-b-2 border-black pb-4 mb-2 flex items-center justify-between">
                      <h3 className="font-black text-xl uppercase tracking-wider text-black">Filter Kategori</h3>
                    </div>
                    <div className="font-bold bg-white p-4 border-2 border-black rounded-lg shadow-sm">
                      <EventFilters />
                    </div>
                  </div>
                  
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Event List Area */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full flex-1"
          >
            <div className="hidden lg:flex mb-6 items-center justify-between border-b-2 border-black pb-4">
              <h2 className="text-2xl font-black uppercase tracking-tight">Daftar Lomba Aktif</h2>
              <span className="font-bold px-4 py-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-md text-sm">
                Real-time
              </span>
            </div>
            
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EventListSkeleton />
                <EventListSkeleton />
                <EventListSkeleton />
                <EventListSkeleton />
              </div>
            }>
              <EventList />
            </Suspense>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
