"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Store, Loader2, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/modules/canteen/hooks/use-cart-store";
import { useAuth } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

export const CartFloatingButton = () => {
  const { isOpen, openCart, closeCart } = useCartStore();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Hide on checkout page so it doesn't collide with payment forms
  const isCheckoutPage = pathname?.includes("/checkout");

  const { data, isLoading } = useQuery(trpc.canteen.getCart.queryOptions());

  const items = data?.items || [];
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => {
    const price = typeof item.menuItem === "object" && item.menuItem !== null 
      ? (item.menuItem.basePrice || 0) 
      : 0;
    return acc + (price * item.quantity);
  }, 0);

  const platformFee = items.length > 0 ? 2000 : 0;
  const totalPrice = subtotal + platformFee;

  // Lock background scroll when drawer is open so page doesn't scroll/detach
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isOpen]);

  const updateQuantityMutation = useMutation({
    ...trpc.canteen.updateCartItemQuantity.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.canteen.getCart.queryFilter());
    },
    onError: (e: any) => toast.error(e.message || "Failed to update quantity"),
  });

  const removeItemMutation = useMutation({
    ...trpc.canteen.removeFromCart.mutationOptions(),
    onSuccess: () => {
      toast.success("Item removed from cart");
      queryClient.invalidateQueries(trpc.canteen.getCart.queryFilter());
    },
    onError: (e: any) => toast.error(e.message || "Failed to remove item"),
  });

  if (isCheckoutPage) {
    return null;
  }

  return (
    <>
      {/* GrabFood / GoFood / ESB Style Sticky Floating Bottom Bar (Responsive) */}
      {totalItems > 0 && !isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-40 px-3 sm:px-4 pointer-events-none flex justify-center animate-in fade-in slide-in-from-bottom-8 duration-300">
          <div className="pointer-events-auto w-full max-w-xl bg-[#0F4C3A] text-white p-2.5 sm:p-3.5 rounded-2xl border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-2 sm:gap-3 transition-transform hover:-translate-y-0.5">
            <div
              onClick={() => {
                if (!isSignedIn) {
                  router.push("/sign-in");
                  return;
                }
                openCart();
              }}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer flex-1 min-w-0"
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-[#ECA823] text-slate-900 rounded-xl border-2 border-black flex items-center justify-center font-black shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] sm:text-xs w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-black border-2 border-black animate-pulse">
                  {totalItems}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-black uppercase text-emerald-300 tracking-wider truncate flex items-center gap-1">
                  <Sparkles className="w-3 h-3 hidden xs:inline" />
                  {totalItems} {totalItems === 1 ? "Item" : "Items"}
                </p>
                <p className="text-base sm:text-xl font-black text-white leading-tight truncate">
                  {formatCurrency(subtotal)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (!isSignedIn) {
                    router.push("/sign-in");
                    return;
                  }
                  openCart();
                }}
                className="hidden md:inline-flex items-center gap-1 px-3 py-2 bg-white hover:bg-yellow-50 text-slate-900 rounded-xl font-black uppercase text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                View Cart
              </button>
              <Link href="/canteen/checkout">
                <Button className="h-10 sm:h-11 px-3.5 sm:px-5 bg-[#ECA823] hover:bg-yellow-400 text-slate-900 font-black uppercase text-xs sm:text-sm rounded-xl border-2 sm:border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all flex items-center gap-1 cursor-pointer">
                  Checkout <ArrowRight className="w-4 h-4 stroke-[3]" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Drawer / Fullscreen Mobile Sheet (Locked in fixed overlay, cannot detach) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-hidden"
          onClick={() => closeCart()}
        >
          <div
            className="relative w-full sm:max-w-md bg-[#F4F4F0] border-l-0 sm:border-l-4 border-black shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full max-h-[100dvh] overflow-hidden animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{ touchAction: "auto" }}
          >
            {/* Drawer Header (Always pinned at top) */}
            <div className="shrink-0 flex items-center justify-between p-4 sm:p-5 border-b-4 border-black bg-[#ECA823]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <ShoppingBag className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black uppercase text-slate-900 leading-none">
                    Your Order Cart
                  </h2>
                  <span className="text-xs font-bold text-slate-800">
                    {totalItems} {totalItems === 1 ? "item" : "items"} selected
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => closeCart()}
                className="p-2 bg-white hover:bg-slate-100 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-900" />
              </button>
            </div>

            {/* Scrollable Items List */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-3">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-48">
                  <Loader2 className="w-8 h-8 animate-spin text-[#ECA823] mb-2" />
                  <p className="font-bold text-slate-500 text-sm">Loading cart...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white border-4 border-dashed border-black rounded-2xl">
                  <ShoppingBag className="w-14 h-14 text-slate-300 mb-3" />
                  <h3 className="text-base font-black uppercase text-slate-700">Your Cart is Empty</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    Select your favorite items from the canteen stalls to start ordering.
                  </p>
                </div>
              ) : (
                items.map((item) => {
                  const menuItem = typeof item.menuItem === "object" ? item.menuItem : null;
                  const price = menuItem?.basePrice || 0;
                  const tenant = typeof menuItem?.tenant === "object" ? menuItem?.tenant : null;
                  
                  return (
                    <div
                      key={item.id}
                      className="bg-white border-3 sm:border-4 border-black rounded-2xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex gap-3"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 border-2 border-black rounded-xl overflow-hidden shrink-0 flex items-center justify-center relative">
                        {menuItem?.image && typeof menuItem.image === "object" && menuItem.image.url ? (
                          <Image
                            src={menuItem.image.url}
                            alt={menuItem.name || "Menu"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Store className="w-7 h-7 text-slate-300" />
                        )}
                      </div>

                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          {tenant?.name && (
                            <span className="text-[10px] font-black uppercase text-slate-500 block truncate">
                              {tenant.name}
                            </span>
                          )}
                          <h4 className="font-black text-xs sm:text-sm uppercase text-slate-900 truncate">
                            {menuItem?.name || "Menu Item"}
                          </h4>
                          <p className="text-xs font-black text-[#0F4C3A]">
                            {formatCurrency(price)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t-2 border-dashed border-slate-200">
                          <div className="flex items-center gap-1.5 bg-[#F4F4F0] border-2 border-black rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantityMutation.mutate({
                                  cartItemId: item.id,
                                  quantity: item.quantity - 1,
                                })
                              }
                              disabled={updateQuantityMutation.isPending}
                              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-white hover:bg-red-50 border border-black rounded text-slate-900 font-bold cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-black px-1.5 min-w-[18px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantityMutation.mutate({
                                  cartItemId: item.id,
                                  quantity: item.quantity + 1,
                                })
                              }
                              disabled={updateQuantityMutation.isPending}
                              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-white hover:bg-green-50 border border-black rounded text-slate-900 font-bold cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItemMutation.mutate({ cartItemId: item.id })}
                            disabled={removeItemMutation.isPending}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pinned Bottom Summary & Instant Checkout (ALWAYS pinned & visible at bottom) */}
            {items.length > 0 && (
              <div className="shrink-0 p-4 sm:p-5 border-t-4 border-black bg-white space-y-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex justify-between font-bold text-slate-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-600">
                    <span>Platform Fee</span>
                    <span>{formatCurrency(platformFee)}</span>
                  </div>
                  <div className="flex justify-between font-black text-base sm:text-lg text-slate-900 pt-1.5 border-t-2 border-black">
                    <span>Total Payment</span>
                    <span className="text-[#0F4C3A]">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>

                <Link
                  href="/canteen/checkout"
                  onClick={() => closeCart()}
                  className="block"
                >
                  <Button className="w-full h-12 sm:h-14 bg-[#ECA823] hover:bg-yellow-400 text-slate-900 font-black uppercase text-sm sm:text-base rounded-xl sm:rounded-2xl border-3 sm:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer">
                    Proceed to Checkout <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
