"use client";

import { useUser } from "@clerk/nextjs";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  Store,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  PAID:             { label: "Awaiting Confirmation", color: "text-blue-700",   bg: "bg-blue-100"   },
  CONFIRMED:        { label: "Confirmed",              color: "text-indigo-700", bg: "bg-indigo-100" },
  COOKING:          { label: "Cooking / Preparing",   color: "text-orange-700", bg: "bg-orange-100" },
  READY_FOR_PICKUP: { label: "Ready for Pickup",       color: "text-green-700",  bg: "bg-green-100"  },
  COMPLETED:        { label: "Completed",              color: "text-green-800",  bg: "bg-green-200"  },
  CANCELLED_REFUNDED: { label: "Cancelled",            color: "text-red-700",    bg: "bg-red-100"    },
};

export function PartnerDashboardView() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { data: tenant, isLoading: loadingTenant } = useQuery(trpc.tenants.getMyTenant.queryOptions());
  const { data: stats, isLoading: loadingStats } = useQuery(trpc.partner.getTodayStats.queryOptions());
  const { data: ordersData, isLoading: loadingOrders, refetch, isFetching } = useQuery(
    trpc.partner.getOrders.queryOptions({ status: "ALL", limit: 10 })
  );

  const updateMutation = useMutation({
    ...trpc.partner.updateOrderStatus.mutationOptions(),
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries(trpc.partner.getOrders.pathFilter());
      queryClient.invalidateQueries(trpc.partner.getTodayStats.pathFilter());
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="w-full">
      {/* Welcome Header */}
      <div className="mb-6 bg-white p-8 rounded-base border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ECA823] rounded-bl-full border-b-4 border-l-4 border-border opacity-50" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 border-2 border-border rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase mb-4 text-slate-900">
            <Store className="w-3.5 h-3.5" />
            {tenant?.name ? tenant.name : "Merchant Console"}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight uppercase">
            Today's Overview
          </h1>
          <p className="text-base font-bold text-slate-500">
            Hello, {user?.firstName || user?.fullName || "Partner"}.
            {tenant?.name ? (
              <span className="ml-1 text-slate-900">
                Canteen <span className="text-[#ECA823] font-black">{tenant.name}</span> is active and ready for orders.
              </span>
            ) : (
              <span className="ml-1 text-slate-700">
                Please configure your canteen profile in settings to start accepting student orders.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Onboarding Banner if Tenant not set up */}
      {!loadingTenant && !tenant && (
        <div className="mb-6 p-6 bg-[#ECA823] border-4 border-border rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white border-2 border-border rounded-base flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <p className="font-black text-slate-900 uppercase text-lg">Your Canteen is Not Configured</p>
              <p className="text-sm font-bold text-slate-800">
                Set up your stall name in settings to activate your merchant account and upload menus!
              </p>
            </div>
          </div>
          <Link
            href="/partner/settings"
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 text-white font-black uppercase text-sm rounded-base border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform"
          >
            Setup Canteen Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders",    value: stats?.total     ?? 0, icon: ShoppingBag, bg: "bg-white"        },
          { label: "In Progress",     value: stats?.pending   ?? 0, icon: Clock,       bg: "bg-blue-50"      },
          { label: "Completed Orders",value: stats?.completed ?? 0, icon: CheckCircle2,bg: "bg-green-50"     },
          { label: "Revenue (Rp)",    value: `${(stats?.revenue ?? 0).toLocaleString("id-ID")}`, icon: TrendingUp, bg: "bg-yellow-50" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={cn("rounded-base border-4 border-border p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]", s.bg)}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-white border-2 border-border rounded-base flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Icon className="w-4 h-4 text-slate-900" />
                </div>
                <span className="text-xs font-black text-slate-500 uppercase">{s.label}</span>
              </div>
              {loadingStats ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              ) : (
                <p className="text-3xl font-black text-slate-900">{s.value}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Orders */}
      <div className="bg-white rounded-base border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between px-6 py-4 border-b-4 border-border">
          <h2 className="text-lg font-black text-slate-900 uppercase">Live Orders & Activity</h2>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-yellow-100 border-2 border-border rounded-base text-xs font-black uppercase text-slate-900">
              Live
            </span>
            <Button
              variant="outline"
              size="sm"
              className="border-2 font-black uppercase text-xs"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin")} />
            </Button>
          </div>
        </div>

        <div className="divide-y-2 divide-border">
          {loadingOrders ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-7 h-7 animate-spin text-[#ECA823]" />
            </div>
          ) : !ordersData?.docs?.length ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 font-bold">No incoming orders yet.</p>
              <p className="text-xs font-bold text-slate-400 mt-1">
                Orders placed and paid by students will automatically appear here in real-time.
              </p>
            </div>
          ) : (
            ordersData.docs.slice(0, 8).map((order: any) => {
              const meta = STATUS_META[order.status] ?? { label: order.status, color: "text-slate-600", bg: "bg-slate-100" };
              return (
                <div key={order.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#F4F4F0] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-9 h-9 rounded-full border-2 border-border flex items-center justify-center shrink-0", meta.bg)}>
                      {order.status === "COMPLETED" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-[#ECA823]" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 uppercase">
                        #{order.orderNumber ?? order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs font-bold text-slate-400">
                        {new Date(order.createdAt).toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        {" · "}Rp{Number(order.totalAmount).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-black uppercase px-2 py-1 border-2 border-border rounded-base", meta.bg, meta.color)}>
                      {meta.label}
                    </span>
                    {order.status === "PAID" && (
                      <Button
                        size="sm"
                        className="text-xs font-black uppercase border-2 border-border bg-indigo-500 hover:bg-indigo-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform"
                        disabled={updateMutation.isPending}
                        onClick={() => updateMutation.mutate({ orderId: order.id, status: "CONFIRMED" })}
                      >
                        Confirm
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {(ordersData?.docs?.length ?? 0) > 0 && (
          <div className="px-6 py-4 border-t-4 border-border">
            <Link
              href="/partner/orders"
              className="text-sm font-black uppercase text-slate-600 hover:text-slate-900 transition-colors"
            >
              View All Orders →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
