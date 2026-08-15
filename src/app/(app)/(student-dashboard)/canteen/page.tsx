"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Coffee, Search, Store, Utensils, Plus, Loader2, ShoppingBag, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartFloatingButton } from "@/modules/canteen/components/cart-floating-button";
import { useCartStore } from "@/modules/canteen/hooks/use-cart-store";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SmartCanteenPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const { openCart } = useCartStore();

  const [activeTab, setActiveTab] = useState<"food" | "drink" | "snack" | "dessert" | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [loadingItemId, setLoadingItemId] = useState<string | number | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#ECA823] mb-3" />
        <p className="font-black text-slate-700 uppercase text-sm">Memverifikasi Akun Mahasiswa...</p>
      </div>
    );
  }

  const { data: tenantsData } = useQuery(trpc.canteen.getTenants.queryOptions());

  const { data: menuData, isLoading } = useQuery(
    trpc.canteen.getMany.queryOptions({
      limit: 50,
      type: activeTab === "all" ? null : activeTab,
      search: searchQuery || null,
      tenant: selectedTenantId || null,
    })
  );

  const { data: cartData } = useQuery(trpc.canteen.getCart.queryOptions());
  const cartItems = cartData?.items || [];
  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartItemMap = new Map<string | number, number>();
  cartItems.forEach((ci) => {
    const mId = typeof ci.menuItem === "object" && ci.menuItem !== null ? (ci.menuItem as any).id : ci.menuItem;
    if (mId) cartItemMap.set(String(mId), ci.quantity);
  });

  const addToCartMutation = useMutation({
    ...trpc.canteen.addToCart.mutationOptions(),
    onSuccess: () => {
      setLoadingItemId(null);
      toast.success("Added to cart!");
      queryClient.invalidateQueries(trpc.canteen.getCart.queryFilter());
    },
    onError: (err: any) => {
      setLoadingItemId(null);
      if (!isSignedIn) {
        router.push("/sign-in");
      } else {
        toast.error(err?.message || "Failed to add item to cart");
      }
    },
  });

  const handleAddToCart = (menuItemId: number | string) => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    setLoadingItemId(menuItemId);
    addToCartMutation.mutate({ menuItemId: Number(menuItemId), quantity: 1 });
  };

  return (
    <div className="flex flex-col h-full font-sans animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ECA823] border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4">
            <Utensils className="w-4 h-4 text-slate-900" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-900">NEXORA Canteen</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
            Smart Canteen
          </h1>
          <p className="text-slate-600 font-bold mt-2">Pre-order meals, skip the queue, pick up instantly.</p>
        </div>

        {/* SEARCH BAR & CART BUTTON */}
        <div className="w-full md:w-auto flex items-center gap-3">
          <div className="flex-1 md:w-64 flex items-center gap-2 bg-white p-2 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-base">
            <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search food or drinks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-2 outline-none font-bold text-slate-900 bg-transparent placeholder:text-slate-400 text-sm"
            />
          </div>

          <button
            onClick={() => {
              if (!isSignedIn) {
                router.push("/sign-in");
                return;
              }
              openCart();
            }}
            className="relative h-14 px-4 bg-white hover:bg-[#ECA823] border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-base flex items-center justify-center gap-2 font-black uppercase transition-all hover:-translate-y-0.5 shrink-0"
            title="Open Cart"
          >
            <ShoppingBag className="w-6 h-6 text-slate-900" />
            <span className="hidden sm:inline text-xs">Cart</span>
            {cartTotalItems > 0 && (
              <span className="bg-[#0F4C3A] text-white text-xs px-2 py-0.5 rounded-full font-black border border-white">
                {cartTotalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TENANT FILTER */}
      {tenantsData && tenantsData.docs.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Store className="w-5 h-5 text-[#0F4C3A]" />
            <span className="font-black uppercase text-sm tracking-wider text-slate-700">Filter Stalls</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedTenantId(null)}
              className={cn(
                "px-5 py-2.5 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-base font-black uppercase text-sm transition-all hover:-translate-y-0.5",
                !selectedTenantId
                  ? "bg-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5"
                  : "bg-white text-slate-900 hover:bg-yellow-100"
              )}
            >
              All Stalls
            </button>
            {tenantsData.docs.map((tenant) => (
              <button
                key={tenant.id}
                onClick={() => setSelectedTenantId(String(tenant.id))}
                className={cn(
                  "px-5 py-2.5 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-base font-black uppercase text-sm transition-all hover:-translate-y-0.5",
                  selectedTenantId === String(tenant.id)
                    ? "bg-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5"
                    : "bg-white text-slate-900 hover:bg-yellow-100"
                )}
              >
                {tenant.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CATEGORY TABS */}
      <div className="flex flex-nowrap overflow-x-auto gap-4 mb-8 pb-4 scrollbar-hide">
        {[
          { id: "all", label: "All Items", icon: Utensils },
          { id: "food", label: "Food", icon: Store },
          { id: "drink", label: "Drinks", icon: Coffee },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-shrink-0 flex items-center gap-2 px-6 py-3 border-4 border-border rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase transition-all",
                isActive 
                  ? "bg-slate-900 text-white translate-y-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                  : "bg-white text-slate-600 hover:bg-[#ECA823] hover:text-slate-900"
              )}
            >
              <Icon className="w-5 h-5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* MENU GRID */}
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12">
          <Loader2 className="w-12 h-12 text-[#ECA823] animate-spin mb-4" />
          <p className="font-bold text-slate-500 uppercase tracking-widest">Loading Menu...</p>
        </div>
      ) : menuData?.docs && menuData.docs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuData.docs.map((menu: any) => {
            const tenantName = typeof menu.tenant === "object" ? menu.tenant.storeName || menu.tenant.name : "Partner Stall";
            const isItemLoading = String(loadingItemId) === String(menu.id);
            const inCartQty = cartItemMap.get(String(menu.id)) || 0;
            
            return (
              <div 
                key={menu.id} 
                className="bg-white border-4 border-border rounded-base flex flex-col overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1.5 transition-all group"
              >
                {/* Image Area */}
                <div className="w-full h-48 bg-slate-100 border-b-4 border-border relative overflow-hidden flex items-center justify-center">
                  {menu.image?.url ? (
                    <Image 
                      src={menu.image.url} 
                      alt={menu.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Store className="w-16 h-16 text-slate-300" />
                  )}
                  {inCartQty > 0 && (
                    <div className="absolute top-2 right-2 bg-[#0F4C3A] text-white px-2.5 py-1 border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {inCartQty} in Cart
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-1 text-slate-500 mb-2">
                    <Store className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase truncate">{tenantName}</span>
                  </div>
                  
                  <h3 className="text-lg font-black text-slate-900 uppercase mb-1 line-clamp-1">{menu.name}</h3>
                  <p className="text-xs font-bold text-slate-500 line-clamp-2 mb-4 flex-1">
                    {menu.description || `Delicious choice for ${menu.name} – ${tenantName}`}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-2 border-t-2 border-dashed border-border">
                    <span className="text-xl font-black text-slate-900">
                      Rp{Number(menu.basePrice).toLocaleString("id-ID")}
                    </span>
                    <Button 
                      onClick={() => handleAddToCart(menu.id)}
                      disabled={isItemLoading}
                      className={cn(
                        "h-10 px-4 border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] rounded-base font-black uppercase text-xs transition-all flex items-center gap-1.5",
                        inCartQty > 0
                          ? "bg-[#0F4C3A] hover:bg-[#0c3c2e] text-white"
                          : "bg-[#ECA823] hover:bg-yellow-500 text-slate-900"
                      )}
                    >
                      {isItemLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : inCartQty > 0 ? (
                        <>
                          <Plus className="w-4 h-4" /> Add (+1)
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Order
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white border-4 border-border rounded-base border-dashed">
          <Utensils className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-2xl font-black text-slate-900 uppercase mb-2">No Menu Available</h3>
          <p className="font-bold text-slate-500 text-center max-w-md">
            No items are available in the canteen right now matching your selection.
          </p>
        </div>
      )}

      {/* Persistent Gojek-Style Floating Cart Bar & Slide-over */}
      <CartFloatingButton />
    </div>
  );
}
