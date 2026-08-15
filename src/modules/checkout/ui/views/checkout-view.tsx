"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Clock,
  CreditCard,
  QrCode,
  CheckCircle2,
  Sparkles,
  Loader2,
  Receipt,
  X,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DEFAULT_FALLBACK_SLOTS = [
  { id: 1, startTime: "2026-08-15T09:30:00.000Z", endTime: "2026-08-15T10:00:00.000Z", label: "Break 1 (09:30 - 10:00)" },
  { id: 2, startTime: "2026-08-15T11:30:00.000Z", endTime: "2026-08-15T12:00:00.000Z", label: "Lunch Shift 1 (11:30 - 12:00)" },
  { id: 3, startTime: "2026-08-15T12:00:00.000Z", endTime: "2026-08-15T12:30:00.000Z", label: "Lunch Shift 2 (12:00 - 12:30)" },
  { id: 4, startTime: "2026-08-15T12:30:00.000Z", endTime: "2026-08-15T13:00:00.000Z", label: "Lunch Shift 3 (12:30 - 13:00)" },
  { id: 5, startTime: "2026-08-15T15:00:00.000Z", endTime: "2026-08-15T15:30:00.000Z", label: "Afternoon (15:00 - 15:30)" },
];

function formatSlotTime(timeStr?: string, fallback: string = "12:00") {
  if (!timeStr) return fallback;
  try {
    const d = new Date(timeStr);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return fallback;
  }
}

function DummyQrisSvg({ orderNumber }: { orderNumber?: string }) {
  return (
    <div className="p-2.5 sm:p-3 bg-white border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
      <div className="w-full flex items-center justify-between border-b-2 border-dashed border-slate-200 pb-1.5 mb-2">
        <div className="flex items-center gap-1">
          <span className="font-black text-[11px] tracking-widest text-red-600 uppercase">QRIS</span>
          <span className="text-[9px] font-bold text-slate-400">GPN</span>
        </div>
        <span className="text-[9px] font-black text-slate-500 uppercase truncate max-w-[130px]">
          {orderNumber || "NEXORA CANTEEN"}
        </span>
      </div>

      <svg
        viewBox="0 0 200 200"
        className="w-32 h-32 sm:w-38 sm:h-38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="200" height="200" fill="white" />
        <rect x="10" y="10" width="50" height="50" fill="black" />
        <rect x="20" y="20" width="30" height="30" fill="white" />
        <rect x="27" y="27" width="16" height="16" fill="black" />

        <rect x="140" y="10" width="50" height="50" fill="black" />
        <rect x="150" y="20" width="30" height="30" fill="white" />
        <rect x="157" y="27" width="16" height="16" fill="black" />

        <rect x="10" y="140" width="50" height="50" fill="black" />
        <rect x="20" y="150" width="30" height="30" fill="white" />
        <rect x="27" y="157" width="16" height="16" fill="black" />

        <rect x="70" y="15" width="10" height="10" fill="black" />
        <rect x="90" y="15" width="20" height="10" fill="black" />
        <rect x="120" y="15" width="10" height="10" fill="black" />

        <rect x="70" y="35" width="30" height="10" fill="black" />
        <rect x="110" y="35" width="10" height="10" fill="black" />

        <rect x="15" y="70" width="10" height="30" fill="black" />
        <rect x="35" y="70" width="20" height="10" fill="black" />
        <rect x="35" y="90" width="10" height="20" fill="black" />

        <rect x="70" y="70" width="20" height="20" fill="black" />
        <rect x="100" y="70" width="10" height="10" fill="black" />
        <rect x="120" y="70" width="20" height="10" fill="black" />
        <rect x="150" y="70" width="10" height="30" fill="black" />
        <rect x="170" y="70" width="20" height="10" fill="black" />

        <rect x="70" y="100" width="10" height="30" fill="black" />
        <rect x="90" y="110" width="30" height="10" fill="black" />
        <rect x="130" y="100" width="10" height="20" fill="black" />
        <rect x="170" y="90" width="10" height="30" fill="black" />

        <rect x="70" y="140" width="20" height="10" fill="black" />
        <rect x="100" y="140" width="10" height="20" fill="black" />
        <rect x="120" y="140" width="30" height="10" fill="black" />
        <rect x="160" y="140" width="20" height="10" fill="black" />

        <rect x="70" y="160" width="10" height="30" fill="black" />
        <rect x="90" y="170" width="30" height="10" fill="black" />
        <rect x="130" y="160" width="20" height="20" fill="black" />
        <rect x="160" y="170" width="30" height="10" fill="black" />

        <rect x="85" y="85" width="30" height="30" rx="4" fill="#ECA823" stroke="black" strokeWidth="2" />
        <text x="100" y="104" textAnchor="middle" fill="#000" fontSize="12" fontWeight="900">
          NX
        </text>
      </svg>

      <p className="text-[9px] font-bold text-slate-400 mt-1.5">
        NMID: ID10202689218290 · NEXORA SMART CANTEEN
      </p>
    </div>
  );
}

export const CheckoutView = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: cartData, isLoading: isLoadingCart } = useQuery(
    trpc.canteen.getCart.queryOptions()
  );
  const { data: rawTimeSlots, isLoading: isLoadingSlots } = useQuery(
    trpc.canteen.getTimeSlots.queryOptions()
  );

  const timeSlots = useMemo(() => {
    if (rawTimeSlots && rawTimeSlots.length > 0) {
      return rawTimeSlots;
    }
    return DEFAULT_FALLBACK_SLOTS;
  }, [rawTimeSlots]);

  const [selectedSlotId, setSelectedSlotId] = useState<string | number>("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "va" | "ewallet">("qris");

  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [countdown, setCountdown] = useState(300);

  const items = cartData?.items || [];
  const subtotal = items.reduce((acc, item) => {
    const price =
      typeof item.menuItem === "object" && item.menuItem !== null
        ? item.menuItem.basePrice || 0
        : 0;
    return acc + price * item.quantity;
  }, 0);

  const platformFee = items.length > 0 ? 2000 : 0;
  const totalFinal = subtotal + platformFee;

  // Auto-select first slot when loaded
  useEffect(() => {
    if (timeSlots && timeSlots.length > 0 && !selectedSlotId) {
      setSelectedSlotId(timeSlots[0].id);
    }
  }, [timeSlots, selectedSlotId]);

  useEffect(() => {
    if (!showQrisModal) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [showQrisModal]);

  const createOrderMutation = useMutation({
    ...trpc.canteen.createOrder.mutationOptions(),
    onSuccess: (res) => {
      queryClient.invalidateQueries(trpc.canteen.getCart.queryFilter());
      queryClient.invalidateQueries(trpc.canteen.getMyOrders.queryFilter());
      setActiveOrder(res.order);
      setShowQrisModal(true);
      setCountdown(300);
      toast.success("Order created! Please complete your QRIS payment.");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create order");
    },
  });

  const simulatePaymentMutation = useMutation({
    ...trpc.canteen.simulatePaymentSuccess.mutationOptions(),
    onSuccess: (res) => {
      setActiveOrder(res.order);
      setShowQrisModal(false);
      setShowReceiptModal(true);
      queryClient.invalidateQueries(trpc.canteen.getMyOrders.queryFilter());
      toast.success("QRIS Payment Successfully Verified! 🎉");
    },
    onError: (err: any) => {
      toast.error(err.message || "Payment verification failed");
    },
  });

  const handleCheckout = () => {
    const slotToUse = selectedSlotId || (timeSlots[0] ? timeSlots[0].id : 1);
    createOrderMutation.mutate({
      timeSlotId: slotToUse,
      notes: notes.trim() || undefined,
    });
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#F4F4F0] p-4 md:p-8 font-sans pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/canteen">
            <Button
              variant="outline"
              size="icon"
              className="border-4 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all bg-white cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-slate-900" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
              Order Checkout
            </h1>
            <p className="text-sm font-bold text-slate-500">
              Select pickup time slot and complete payment
            </p>
          </div>
        </div>

        {items.length === 0 && !activeOrder ? (
          <div className="p-12 bg-white border-4 border-dashed border-black rounded-2xl text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <Receipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-black uppercase text-slate-800">Your Cart is Empty</h2>
            <p className="text-sm font-bold text-slate-400 mt-1 mb-6">
              Please select food or beverage items from the canteen first.
            </p>
            <Link href="/canteen">
              <Button className="bg-[#ECA823] hover:bg-yellow-400 text-slate-900 font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 cursor-pointer">
                Back to Canteen
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* 1. Pickup Time Slot */}
              <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Clock className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black uppercase text-slate-900">
                      1. Select Pickup Time Slot
                    </h2>
                    <p className="text-xs font-bold text-slate-500">
                      Pick up your meal at this scheduled slot without queuing
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {isLoadingSlots && (!timeSlots || timeSlots.length === 0) ? (
                    <div className="col-span-full py-8 flex flex-col items-center justify-center">
                      <Loader2 className="w-7 h-7 animate-spin text-[#ECA823] mb-2" />
                      <p className="text-xs font-bold text-slate-500">Loading available time slots...</p>
                    </div>
                  ) : (
                    timeSlots.map((slot: any, index: number) => {
                      const isSelected = String(selectedSlotId) === String(slot.id);
                      const start = formatSlotTime(slot.startTime, index === 0 ? "09:30" : index === 1 ? "11:30" : "12:00");
                      const end = formatSlotTime(slot.endTime, index === 0 ? "10:00" : index === 1 ? "12:00" : "12:30");

                      return (
                        <button
                          key={slot.id || index}
                          type="button"
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`p-3.5 rounded-xl border-3 text-left transition-all relative cursor-pointer ${
                            isSelected
                              ? "bg-[#0F4C3A] text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                              : "bg-[#F4F4F0] text-slate-900 border-black hover:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? "text-emerald-300" : "text-slate-500"}`}>
                              Slot #{index + 1}
                            </span>
                            {isSelected ? (
                              <span className="w-5 h-5 bg-[#ECA823] text-slate-900 rounded-full flex items-center justify-center border border-black">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            ) : (
                              index === 1 && (
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-[#ECA823] text-slate-900 border border-black rounded">
                                  Peak
                                </span>
                              )
                            )}
                          </div>
                          <p className="text-base font-black leading-tight">
                            {start} - {end}
                          </p>
                          <span className={`text-[11px] font-bold mt-1 block ${isSelected ? "text-emerald-100" : "text-slate-500"}`}>
                            {slot.maxCapacity ? `Max ${slot.maxCapacity} orders` : "Ready on time"}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 2. Special Instructions */}
              <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-lg font-black uppercase text-slate-900 mb-2">
                  2. Special Instructions (Optional)
                </h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Sambal dipisah, es sedikit, jangan pakai bawang goreng..."
                  className="w-full h-24 p-3 bg-[#F4F4F0] border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#ECA823] resize-none text-sm placeholder:text-slate-400"
                />
              </div>

              {/* 3. Payment Method */}
              <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <CreditCard className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black uppercase text-slate-900">
                      3. Payment Method
                    </h2>
                    <p className="text-xs font-bold text-slate-500">
                      Instant payment with automated real-time QRIS verification
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: "qris" as const,
                      label: "QRIS Instant (GoPay / OVO / BCA / ShopeePay / Dana)",
                      desc: "Scan simulated QR code directly from your smartphone app",
                      badge: "Instant & Recommended",
                      icon: QrCode,
                    },
                    {
                      id: "va" as const,
                      label: "Virtual Account (BCA, Mandiri, BNI)",
                      desc: "Transfer via ATM or Mobile Banking simulator",
                      badge: null,
                      icon: CreditCard,
                    },
                    {
                      id: "ewallet" as const,
                      label: "Direct E-Wallet",
                      desc: "Direct integration simulation",
                      badge: null,
                      icon: CreditCard,
                    },
                  ].map((m) => {
                    const isSelected = paymentMethod === m.id;
                    return (
                      <label
                        key={m.id}
                        className={`flex items-start gap-4 p-4 border-3 rounded-2xl cursor-pointer transition-all ${
                          isSelected
                            ? "bg-yellow-50 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                            : "bg-[#F4F4F0] border-black hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={m.id}
                          checked={isSelected}
                          onChange={() => setPaymentMethod(m.id)}
                          className="mt-1 w-4 h-4 accent-[#ECA823] cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-black text-sm text-slate-900">{m.label}</span>
                            {m.badge && (
                              <span className="px-2 py-0.5 bg-[#ECA823] text-slate-900 border border-black text-[10px] font-black uppercase rounded-lg">
                                {m.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-slate-500 mt-0.5">{m.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sticky top-6 space-y-6">
                <h2 className="text-lg font-black uppercase text-slate-900 pb-3 border-b-4 border-black">
                  Order Summary
                </h2>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const menuItem = typeof item.menuItem === "object" ? item.menuItem : null;
                    const price = menuItem?.basePrice || 0;
                    return (
                      <div key={item.id} className="flex justify-between text-xs font-bold gap-2">
                        <span className="text-slate-700 truncate flex-1">
                          {item.quantity}× {menuItem?.name || "Menu"}
                        </span>
                        <span className="font-black text-slate-900 shrink-0">
                          {formatCurrency(price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2 pt-3 border-t-2 border-dashed border-slate-200 text-xs">
                  <div className="flex justify-between text-slate-500 font-bold">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-bold">
                    <span>Platform Fee</span>
                    <span>{formatCurrency(platformFee)}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-black text-base pt-2 border-t-2 border-black">
                    <span>Total Payment</span>
                    <span className="text-[#0F4C3A]">{formatCurrency(totalFinal)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={createOrderMutation.isPending || items.length === 0}
                  className="w-full h-14 bg-[#ECA823] hover:bg-yellow-400 text-slate-900 font-black uppercase text-base rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {createOrderMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <QrCode className="w-5 h-5 stroke-[2.5]" /> Pay with QRIS
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QRIS Modal (Centered & fully scrollable on all screen sizes) */}
      {showQrisModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-3 sm:p-4">
          <div className="flex min-h-full items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-[#ECA823] p-3.5 sm:p-4 border-b-4 border-black flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900" />
                  <h2 className="text-base sm:text-lg font-black uppercase text-slate-900">
                    QRIS Payment
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQrisModal(false)}
                  className="p-1 hover:bg-black/10 rounded-lg cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5 text-slate-900" />
                </button>
              </div>

              <div className="p-4 sm:p-5 flex flex-col items-center text-center space-y-3">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-red-100 border-2 border-red-300 rounded-lg text-xs font-black text-red-700">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Valid for {formattedTime}</span>
                </div>

                <DummyQrisSvg orderNumber={activeOrder?.orderNumber} />

                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Bill
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {formatCurrency(activeOrder?.totalAmount || totalFinal)}
                  </p>
                </div>

                <div className="w-full p-2.5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-left text-[11px] font-bold text-slate-600 space-y-0.5">
                  <p>1. Open GoPay / BCA / OVO / Dana / Mobile Banking</p>
                  <p>2. Scan QRIS or click instant simulation below</p>
                </div>

                <Button
                  onClick={() => {
                    if (activeOrder?.id) {
                      simulatePaymentMutation.mutate({ orderId: activeOrder.id });
                    }
                  }}
                  disabled={simulatePaymentMutation.isPending}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-sm sm:text-base rounded-xl border-3 sm:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {simulatePaymentMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Simulate Payment Success (Instant)
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Receipt Modal (Centered & fully scrollable on all screen sizes) */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-3 sm:p-4">
          <div className="flex min-h-full items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-emerald-600 p-4 sm:p-5 border-b-4 border-black text-white text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-white border-3 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-2">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                  Payment Successful!
                </h2>
                <p className="text-xs font-bold text-emerald-100 mt-0.5">
                  Your order has been forwarded to the canteen stall
                </p>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                <div className="p-3 sm:p-4 bg-yellow-100 border-3 border-black rounded-xl text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-[11px] font-black uppercase text-slate-600 tracking-wider">
                    Meal Pickup Code
                  </span>
                  <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-widest mt-0.5">
                    {activeOrder?.pickupCode || "NX-8291"}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                    Present this code at the stall counter when collecting your meal
                  </p>
                </div>

                <div className="space-y-1.5 text-xs font-bold text-slate-700 bg-slate-50 p-3 border-2 border-black rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Order ID</span>
                    <span className="font-black text-slate-900">{activeOrder?.orderNumber || `#${activeOrder?.id}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-black uppercase text-[10px]">
                      PAID (In Kitchen / Cooking)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Paid</span>
                    <span className="font-black text-slate-900">{formatCurrency(activeOrder?.totalAmount || totalFinal)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Button
                    onClick={() => router.push("/canteen")}
                    className="flex-1 h-11 bg-[#ECA823] hover:bg-yellow-400 text-slate-900 font-black uppercase text-xs sm:text-sm border-2 sm:border-3 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    Order More Items
                  </Button>
                  <Button
                    onClick={() => router.push("/dashboard")}
                    variant="outline"
                    className="flex-1 h-11 border-2 sm:border-3 border-black rounded-xl font-black uppercase text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all bg-white cursor-pointer"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
