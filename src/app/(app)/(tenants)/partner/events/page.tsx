"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function PartnerEventsPage() {
  const trpc = useTRPC();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery(
    trpc.events.getMany.queryOptions({ limit: 10, cursor: 1 })
  );

  return (
    <div className="flex flex-col gap-8 w-full font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#ECA823] border-4 border-border rounded-base shadow-shadow">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase">Manajemen Event & Lomba</h1>
          <p className="text-slate-800 font-bold mt-1">Kelola semua perlombaan, seminar, dan acara kampus.</p>
        </div>
        <Link href="/partner/events/create">
          <Button className="bg-primary text-white border-2 border-border shadow-shadow hover:bg-green-700 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 rounded-base font-bold px-6 py-6 h-auto">
            <Plus className="w-5 h-5" /> TAMBAH EVENT BARU
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-base border-4 border-border shadow-shadow flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-900" />
          <Input 
            placeholder="Cari event berdasarkan nama..." 
            className="pl-10 h-12 bg-[#F4F4F0] border-2 border-border rounded-base w-full font-bold focus-visible:ring-0 focus-visible:bg-yellow-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto h-12 rounded-base flex items-center gap-2 border-2 border-border font-bold text-slate-900 hover:bg-yellow-300 transition-colors shadow-sm">
          <Filter className="w-5 h-5" /> FILTER KATEGORI
        </Button>
      </div>

      {/* Neo-brutalist Data Table */}
      <div className="bg-white border-4 border-border rounded-base shadow-shadow overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-primary text-white font-black uppercase tracking-wider border-b-4 border-border">
              <tr>
                <th className="px-6 py-5 border-r-2 border-border">Nama Event</th>
                <th className="px-6 py-5 border-r-2 border-border">Kategori</th>
                <th className="px-6 py-5 border-r-2 border-border">Cakupan</th>
                <th className="px-6 py-5 border-r-2 border-border">Harga</th>
                <th className="px-6 py-5 border-r-2 border-border">Status</th>
                <th className="px-6 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-border font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-800 font-bold bg-yellow-100">MEMUAT DATA...</td>
                </tr>
              ) : data?.docs && data.docs.length > 0 ? (
                data.docs.map((event: any) => (
                  <tr key={event.id} className="hover:bg-[#F4F4F0] transition-colors">
                    <td className="px-6 py-4 border-r-2 border-border">
                      <p className="font-black text-lg text-slate-900 uppercase line-clamp-1">{event.title}</p>
                      <p className="text-sm text-slate-700 line-clamp-1 max-w-[250px] font-bold mt-1">{event.description}</p>
                    </td>
                    <td className="px-6 py-4 border-r-2 border-border">
                      <span className="px-3 py-1.5 bg-yellow-300 border-2 border-border text-slate-900 rounded-base text-xs font-black uppercase">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-r-2 border-border font-bold">
                      {event.locationFormat}
                    </td>
                    <td className="px-6 py-4 border-r-2 border-border font-black text-green-600">
                      {event.ticketPrice === 0 ? "GRATIS" : `Rp ${event.ticketPrice?.toLocaleString()}`}
                    </td>
                    <td className="px-6 py-4 border-r-2 border-border">
                      <span className="px-3 py-1.5 bg-green-400 border-2 border-border text-slate-900 rounded-base text-xs font-black uppercase">
                        PUBLISHED
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-base border-2 border-border hover:bg-yellow-300">
                            <MoreHorizontal className="w-5 h-5 text-slate-900" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-base border-4 border-border shadow-shadow p-2 font-bold">
                          <DropdownMenuItem className="cursor-pointer mb-1 hover:bg-yellow-300 rounded-sm">
                            <Edit className="w-4 h-4 mr-2" /> EDIT EVENT
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-white bg-red-500 hover:bg-red-600 focus:bg-red-600 focus:text-white rounded-sm border-2 border-transparent">
                            <Trash2 className="w-4 h-4 mr-2" /> HAPUS
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-800 font-bold bg-[#F4F4F0]">
                    BELUM ADA EVENT YANG DIBUAT.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t-4 border-border bg-[#F4F4F0] flex items-center justify-between font-bold text-slate-900">
          <div>MENAMPILKAN {data?.docs?.length || 0} EVENT</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="rounded-base border-2 border-border uppercase font-black bg-white">SEBELUMNYA</Button>
            <Button variant="outline" size="sm" disabled className="rounded-base border-2 border-border uppercase font-black bg-white">SELANJUTNYA</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
