"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Store, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { MenuList, MenuListSkeleton } from "../../components/menu-list";
import { MenuSort } from "../../components/menu-sort";
import { CartFloatingButton } from "../../components/cart-floating-button";
import { useMenuFilters } from "../../hooks/use-menu-filters";

interface Props {
  tenantSlug?: string;
}

export const CanteenListView = ({ tenantSlug }: Props) => {
  const [selectedCampus, setSelectedCampus] = useState<string>("UBM Ancol");
  const trpc = useTRPC();
  const [filters, setFilters] = useMenuFilters();

  // Get Tenants for selected campus
  const { data: tenantsData, isLoading: isLoadingTenants } = useQuery(
    trpc.canteen.getTenants.queryOptions({ campus: selectedCampus })
  );

  const campuses = [
    "UBM Ancol",
    "UBM Serpong",
    "Kampus Lain"
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F0]">
      <div className="bg-[#0F4C3A] text-white py-16 px-6 lg:px-24 relative overflow-hidden border-b-4 border-black">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#16654E] transform skew-x-12 translate-x-20 hidden lg:block border-l-4 border-black" />
        
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-sm mb-6 uppercase tracking-wider rounded-md">
            <Utensils className="w-4 h-4" /> Smart canteen
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4 uppercase drop-shadow-sm">
            Pesan Tanpa Antre.
          </h1>
          <p className="text-base lg:text-xl font-bold text-green-50 max-w-2xl leading-relaxed">
            Pilih kampus Anda, telusuri menu dari berbagai stan canteen, dan amankan slot waktu pengambilan Anda dengan mudah.
          </p>
        </div>
      </div>

      <div className="px-6 lg:px-24 py-12 flex flex-col gap-12">
        
        {/* Campus Selector */}
        <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-8 h-8 text-yellow-500" />
            <h2 className="text-xl lg:text-2xl font-black uppercase tracking-tight">Pilih Lokasi Kampus</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {campuses.map((campus) => (
              <Button
                key={campus}
                onClick={() => setSelectedCampus(campus)}
                variant={selectedCampus === campus ? "default" : "outline"}
                className={`rounded-md font-black uppercase text-lg h-14 px-8 transition-transform border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
                  selectedCampus === campus 
                    ? "bg-[#0F4C3A] text-white hover:bg-[#16654E]" 
                    : "bg-white text-black hover:bg-yellow-400"
                }`}
              >
                {campus}
              </Button>
            ))}
          </div>
        </div>

        {/* Available Tenants in selected campus */}
        <div className="flex flex-col gap-6 mt-4">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-[#0F4C3A]" />
            <h2 className="text-2xl font-black uppercase tracking-tight">Stan yang Buka ({tenantsData?.docs.length || 0})</h2>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {isLoadingTenants ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-56 h-20 bg-white border-2 border-black rounded-xl animate-pulse" />
              ))
            ) : tenantsData?.docs.length === 0 ? (
              <div className="w-full bg-white border-2 border-black rounded-xl p-12 text-center border-dashed">
                <p className="font-bold text-lg text-slate-500 uppercase">Tidak ada tenant yang buka di kampus ini.</p>
              </div>
            ) : (
              <>
                <div 
                  onClick={() => setFilters({ tenant: null })}
                  className={`px-8 py-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform cursor-pointer ${
                    !filters.tenant ? "bg-[#0F4C3A] text-white" : "bg-white text-black"
                  }`}
                >
                  <h3 className="font-black text-xl uppercase tracking-tight">Semua Stan</h3>
                </div>
                {tenantsData?.docs.map((tenant) => (
                  <div 
                    key={tenant.id} 
                    onClick={() => setFilters({ tenant: filters.tenant === String(tenant.id) ? null : String(tenant.id) })}
                    className={`px-8 py-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform cursor-pointer ${
                      filters.tenant === String(tenant.id) ? "bg-[#0F4C3A] text-white" : "bg-white text-black"
                    }`}
                  >
                    <h3 className="font-black text-xl uppercase tracking-tight">{tenant.name}</h3>
                    {tenant.locationDetail && (
                      <p className={`text-sm font-bold mt-1 ${filters.tenant === String(tenant.id) ? "text-green-100" : "text-slate-500"}`}>
                        {tenant.locationDetail}
                      </p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-6 mt-6 pt-12 border-t-4 border-black border-dashed">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-black uppercase tracking-tight">Katalog Menu</h2>
            <MenuSort />
          </div>
          <Suspense fallback={<MenuListSkeleton />}>
            <MenuList tenantSlug={tenantSlug} selectedCampus={selectedCampus} />
          </Suspense>
        </div>
      </div>
      
      <CartFloatingButton />
    </div>
  );
};
