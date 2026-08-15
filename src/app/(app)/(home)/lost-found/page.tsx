"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MapPin, Calendar, CheckCircle2, MessageSquare, AlertTriangle } from "lucide-react";

import { motion } from "framer-motion";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";

export default function LostFoundPage() {
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hideMatch, setHideMatch] = useState(false);
  
  const trpc = useTRPC();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const isCampusAdmin = (user?.unsafeMetadata?.roles as string[])?.includes("campus_admin") 
                     || (user?.publicMetadata?.roles as string[])?.includes("campus_admin");
  
  const { data: reports } = useQuery(
    trpc.lostfound.getReports.queryOptions({ filter })
  );
  
  const { data: matches } = useQuery({
    ...trpc.lostfound.getMatches.queryOptions(),
    enabled: !!isSignedIn,
  });

  const filteredItems = (reports || []).filter(item => {
    if (searchQuery && !(item.itemName?.toLowerCase()?.includes(searchQuery.toLowerCase()))) return false;
    return true;
  });

  const topMatch = matches && matches.length > 0 ? matches[0] : null;
  const showMatch = !!topMatch && !hideMatch;

  return (
    <div className="min-h-screen bg-[#F4F4F0] p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase text-black tracking-tight mb-2">
              Lost & Found
            </h1>
            <p className="text-lg font-bold text-slate-600">
              Pusat bantuan kehilangan dan penemuan barang di kampus.
            </p>
          </div>
          {isCampusAdmin && (
            <Button 
              className="h-14 px-8 bg-[#ECA823] hover:bg-yellow-500 text-black border-4 border-black rounded-xl font-black uppercase text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
              onClick={() => toast.info("Fitur pelaporan sedang dalam tahap integrasi dengan TRPC")}
            >
              <Plus className="w-6 h-6 mr-2 stroke-[3]" /> Buat Laporan
            </Button>
          )}
        </div>

        {/* Smart Matching Banner */}
        {showMatch && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#4ADE80] border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center gap-6 relative"
          >
            <button 
              onClick={() => setHideMatch(true)} 
              className="absolute top-4 right-4 bg-black text-white w-8 h-8 rounded-full font-black flex items-center justify-center hover:bg-slate-800"
            >
              ×
            </button>
            <div className="w-20 h-20 bg-white border-4 border-black rounded-2xl shadow-sm flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-10 h-10 text-[#4ADE80] stroke-[3]" />
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 rounded-full text-xs font-black uppercase mb-2">
                <AlertTriangle className="w-3 h-3 text-yellow-300" /> AI Match Found ({topMatch.similarityScore}%)
              </div>
              <h2 className="text-2xl font-black uppercase text-black mb-1">
                Kecocokan Ditemukan!
              </h2>
              <p className="text-black font-bold">
                Terdapat barang yang mirip dengan laporan Anda. Silakan hubungi pelapor.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-w-[200px] shrink-0">
              <Button className="w-full h-12 bg-white text-black border-4 border-black rounded-xl font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform hover:bg-slate-50">
                <MessageSquare className="w-4 h-4 mr-2" /> Chat Penemu
              </Button>
            </div>
          </motion.div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex bg-[#F4F4F0] border-2 border-black rounded-xl p-1 gap-1 shrink-0">
            {["all", "lost", "found"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as "all" | "lost" | "found")}
                className={`px-6 py-2 rounded-lg font-black uppercase text-sm transition-all ${
                  filter === f
                    ? "bg-black text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f === "all" ? "Semua" : f === "lost" ? "Kehilangan" : "Penemuan"}
              </button>
            ))}
          </div>
          
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input 
              placeholder="Cari nama barang, lokasi, dsb..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-full min-h-[48px] bg-[#F4F4F0] border-2 border-black rounded-xl font-bold focus-visible:ring-0 focus-visible:bg-yellow-50"
            />
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              className="bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col group cursor-pointer"
            >
              <div className={`p-4 border-b-4 border-black flex justify-between items-center ${
                item.type === 'LOST' ? 'bg-red-400' : 'bg-blue-400'
              }`}>
                <span className="font-black uppercase text-black bg-white/50 px-3 py-1 rounded-full text-xs">
                  {item.type === 'LOST' ? 'Hilang' : 'Ditemukan'}
                </span>
                <span className="font-bold text-sm text-black">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="p-6 flex flex-col flex-1 gap-4">
                <h3 className="font-black text-xl uppercase leading-tight line-clamp-2">
                  {item.itemName}
                </h3>
                
                <p className="font-bold text-slate-600 line-clamp-3 text-sm">
                  {item.description}
                </p>
                
                <div className="mt-auto pt-4 border-t-2 border-black/10 flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="font-bold text-sm truncate">{item.locationDetail}</span>
                </div>
              </div>
            </div>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
              <Search className="w-16 h-16 mb-4 opacity-50" />
              <p className="font-black uppercase text-xl text-slate-500">Tidak ada data ditemukan</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
