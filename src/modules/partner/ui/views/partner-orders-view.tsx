"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShoppingBag, CheckCircle2, Clock, Loader2, RefreshCw,
  Flame, CheckCheck, XCircle, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type OrderStatus =
  | "ALL"
  | "PAID"
  | "CONFIRMED"
  | "COOKING"
  | "READY_FOR_PICKUP"
  | "COMPLETED"
  | "CANCELLED_REFUNDED";

const TABS: { key: OrderStatus; label: string }[] = [
  { key: "ALL",              label: "All" },
  { key: "PAID",             label: "Incoming" },
  { key: "CONFIRMED",        label: "Confirmed" },
  { key: "COOKING",          label: "Cooking" },
  { key: "READY_FOR_PICKUP", label: "Ready" },
  { key: "COMPLETED",        label: "Completed" },
];

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  PAID:             { label: "Awaiting Confirmation", color: "text-blue-700",   bg: "bg-blue-100"   },
  CONFIRMED:        { label: "Confirmed",              color: "text-indigo-700", bg: "bg-indigo-100" },
  COOKING:          { label: "Cooking / Preparing",   color: "text-orange-700", bg: "bg-orange-100" },
  READY_FOR_PICKUP: { label: "Ready for Pickup",       color: "text-green-700",  bg: "bg-green-100"  },
  COMPLETED:        { label: "Completed",              color: "text-slate-600",  bg: "bg-slate-100"  },
  CANCELLED_REFUNDED: { label: "Cancelled",            color: "text-red-700",    bg: "bg-red-100"    },
};

function NextActionButton({
  order,
  onUpdate,
  isPending,
}: {
  order: any;
  onUpdate: (orderId: string, status: string) => void;
  isPending: boolean;
}) {
  switch (order.status) {
    case "PAID":
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase text-xs border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform"
            disabled={isPending}
            onClick={() => onUpdate(order.id, "CONFIRMED")}
          >
            Confirm
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:bg-red-50 font-black uppercase text-xs border-2 border-border"
            disabled={isPending}
            onClick={() => {
              if (confirm("Decline this order?")) onUpdate(order.id, "CANCELLED_REFUNDED");
            }}
          >
            Decline
          </Button>
        </div>
      );
    case "CONFIRMED":
      return (
        <Button
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-xs border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform flex items-center gap-1.5"
          disabled={isPending}
          onClick={() => onUpdate(order.id, "COOKING")}
        >
          <Flame className="w-3.5 h-3.5" /> Start Cooking
        </Button>
      );
    case "COOKING":
      return (
        <Button
          size="sm"
          className="bg-green-500 hover:bg-green-600 text-white font-black uppercase text-xs border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform flex items-center gap-1.5"
          disabled={isPending}
          onClick={() => onUpdate(order.id, "READY_FOR_PICKUP")}
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Pickup
        </Button>
      );
    case "READY_FOR_PICKUP":
      return (
        <Button
          size="sm"
          className="bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-xs border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform flex items-center gap-1.5"
          disabled={isPending}
          onClick={() => onUpdate(order.id, "COMPLETED")}
        >
          <CheckCheck className="w-3.5 h-3.5" /> Complete Order
        </Button>
      );
    default:
      return null;
  }
}

export function PartnerOrdersView() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<OrderStatus>("ALL");

  const { data: stats } = useQuery(trpc.partner.getTodayStats.queryOptions());
  const { data, isLoading, refetch, isFetching } = useQuery(
    trpc.partner.getOrders.queryOptions({
      status: activeTab,
      limit: 50,
    })
  );

  const updateMutation = useMutation({
    ...trpc.partner.updateOrderStatus.mutationOptions(),
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries(trpc.partner.getOrders.pathFilter());
      queryClient.invalidateQueries(trpc.partner.getTodayStats.pathFilter());
    },
    onError: (e: any) => toast.error(e.message || "Failed to update status"),
  });

  const handleUpdate = (orderId: string, status: string) => {
    updateMutation.mutate({ orderId, status: status as any });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase">Incoming Orders</h1>
          <p className="font-bold text-slate-500 mt-1">Manage and fulfill student orders in real-time</p>
        </div>
        <Button
          variant="outline"
          className="border-4 border-border font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", isFetching && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Today Total",  value: stats?.total ?? 0,     color: "bg-white" },
          { label: "Pending",      value: stats?.pending ?? 0,   color: "bg-blue-50" },
          { label: "Completed",    value: stats?.completed ?? 0, color: "bg-green-50" },
          { label: "Revenue",      value: `Rp${(stats?.revenue ?? 0).toLocaleString("id-ID")}`, color: "bg-yellow-50" },
        ].map((s) => (
          <div key={s.label} className={cn("border-4 border-border rounded-base p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]", s.color)}>
            <p className="text-xs font-black text-slate-400 uppercase">{s.label}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={cn(
              "px-4 py-2 rounded-base border-2 font-black uppercase text-xs shrink-0 transition-all",
              activeTab === t.key
                ? "bg-slate-900 text-white border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                : "bg-white text-slate-600 border-border hover:bg-slate-100"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="w-full h-48 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#ECA823]" />
        </div>
      ) : !data?.docs?.length ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border-4 border-dashed border-border rounded-base text-center">
          <ShoppingBag className="w-12 h-12 text-slate-300 mb-3" />
          <p className="font-black text-slate-500 uppercase">No orders found</p>
          <p className="text-xs font-bold text-slate-400 mt-1">Orders in this category will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.docs.map((order: any) => {
            const meta = STATUS_META[order.status] ?? {
              label: order.status,
              color: "text-slate-600",
              bg: "bg-slate-100",
            };
            const student = typeof order.user === "object" ? order.user : null;
            const slot = typeof order.timeSlot === "object" ? order.timeSlot : null;
            const timeStr = order.createdAt
              ? new Date(order.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
              : "";

            return (
              <div
                key={order.id}
                className="bg-white border-4 border-border rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 flex flex-col gap-4"
              >
                {/* Top row */}
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-slate-900 uppercase">
                        #{order.orderNumber ?? order.id.slice(0, 8)}
                      </span>
                      {order.pickupCode && (
                        <span className="px-2 py-0.5 bg-[#ECA823] text-slate-900 text-xs font-black uppercase rounded-base border border-border">
                          PICKUP: {order.pickupCode}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {timeStr}
                      </span>
                      {student?.fullName && (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" /> {student.fullName}
                        </span>
                      )}
                      {slot?.startTime && (
                        <span>
                          Slot: {new Date(slot.startTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={cn("text-xs font-black uppercase px-2.5 py-1 rounded-base border-2 border-border", meta.bg, meta.color)}>
                      {meta.label}
                    </span>
                    <NextActionButton
                      order={order}
                      onUpdate={handleUpdate}
                      isPending={updateMutation.isPending}
                    />
                  </div>
                </div>

                {/* Items */}
                {order.items && order.items.length > 0 && (
                  <div className="border-t-2 border-dashed border-border pt-3 space-y-1.5">
                    {order.items.map((item: any) => {
                      const menuItem = typeof item.menuItem === "object" ? item.menuItem : null;
                      return (
                        <div key={item.id} className="flex justify-between text-xs font-bold text-slate-700">
                          <span>{item.quantity}× {menuItem?.name ?? "Menu"}</span>
                          <span>Rp{Number(item.subtotal ?? 0).toLocaleString("id-ID")}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Notes */}
                {order.notes && (
                  <div className="p-2.5 bg-yellow-50 border-2 border-border rounded-base text-xs font-bold text-slate-700">
                    <span className="font-black uppercase text-slate-500">Note: </span>
                    {order.notes}
                  </div>
                )}

                {/* Footer Total */}
                <div className="flex justify-between items-center border-t-2 border-border pt-3 text-sm">
                  <span className="font-bold text-slate-500">Total Payment</span>
                  <span className="text-base font-black text-slate-900">
                    Rp{Number(order.totalAmount).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
