"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, ChefHat, BellRing, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type OrderStatus = "PAID" | "COOKING" | "READY_FOR_PICKUP" | "COMPLETED";

export default function PartnerKDSPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { data: ordersData, isLoading } = useQuery({
    ...trpc.partner.getOrders.queryOptions({ status: "ALL", limit: 50 }),
    refetchInterval: 10000, 
  });

  const orders = ordersData?.docs || [];

  const { mutate: updateStatus } = useMutation({
    ...trpc.partner.updateOrderStatus.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.partner.getOrders.queryFilter());
    }
  });

  const prevOrdersLength = useRef(0);
  
  useEffect(() => {
    if (orders) {
      if (orders.length > prevOrdersLength.current && prevOrdersLength.current !== 0) {
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.log("Audio autoplay blocked:", e));
        }
        toast("Pesanan Baru Masuk!", {
          icon: <BellRing className="w-5 h-5 text-primary" />,
          className: "bg-white border-4 border-black font-black uppercase text-slate-900"
        });
      }
      prevOrdersLength.current = orders.length;
    }
  }, [orders]);

  const handleUpdateStatus = (id: string, newStatus: OrderStatus) => {
    updateStatus({ orderId: id, status: newStatus as any });
  };

  const getOrdersByStatus = (status: OrderStatus) => orders?.filter((o: any) => o.status === status) || [];

  const Column = ({ title, status, icon: Icon, colorClass, nextStatus, buttonText }: any) => (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-100 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className={`p-4 border-b-4 border-black flex justify-between items-center ${colorClass}`}>
        <h2 className="font-black text-xl text-black uppercase tracking-tight flex items-center gap-2">
          <Icon className="w-6 h-6 stroke-[3]" /> {title}
        </h2>
        <span className="bg-black text-white px-3 py-1 rounded-full font-black text-sm">
          {getOrdersByStatus(status).length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {isLoading ? (
           <div className="flex flex-col items-center justify-center h-full text-slate-400">
             <Loader2 className="w-8 h-8 animate-spin mb-2" />
             <p className="font-black uppercase text-sm">Memuat...</p>
           </div>
        ) : (
          <AnimatePresence>
            {getOrdersByStatus(status).map((order: any) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                key={order.id}
                className="bg-white border-4 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3 relative"
              >
                <div className="flex justify-between items-start border-b-2 border-black pb-3">
                  <div>
                    <p className="font-black text-lg uppercase text-black leading-none">{order.orderNumber || "ORDER"}</p>
                    <p className="text-sm font-bold text-slate-600 mt-1">
                      {order.user?.fullName || "Pelanggan"}
                    </p>
                  </div>
                  <div className="bg-yellow-300 font-black px-2 py-1 border-2 border-black rounded-lg text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3 stroke-[3]" /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                <ul className="flex flex-col gap-2">
                  {order.items?.map((item: any, idx: number) => {
                    const itemName = item.menuItem?.name || "Menu Item";
                    return (
                      <li key={idx} className="flex flex-col">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{item.quantity}x {itemName}</span>
                        </div>
                        {order.notes && idx === 0 && (
                          <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-1 rounded mt-1 border border-red-300 w-max">
                            📝 {order.notes}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                
                {nextStatus && (
                  <Button 
                    onClick={() => handleUpdateStatus(order.id, nextStatus)}
                    className={`mt-2 w-full h-12 font-black uppercase tracking-wider text-black border-4 border-black rounded-xl hover:-translate-y-1 transition-transform ${
                      status === "PAID" ? "bg-blue-400 hover:bg-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : 
                      status === "COOKING" ? "bg-[#4ADE80] hover:bg-green-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : 
                      "bg-[#ECA823] hover:bg-yellow-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    }`}
                  >
                    {buttonText}
                  </Button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {!isLoading && getOrdersByStatus(status).length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
            <Icon className="w-12 h-12 mb-2 stroke-[2]" />
            <p className="font-black uppercase text-sm">Kosong</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-2 h-full flex flex-col font-sans">
      <audio ref={audioRef} src="/audio/bell.mp3" preload="auto" />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black uppercase text-black tracking-tight">KDS (Kitchen Display)</h1>
          <p className="text-slate-600 font-bold">Kelola pesanan canteen secara real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        <Column 
          title="Pesanan Baru" 
          status="PAID" 
          icon={BellRing}
          colorClass="bg-[#ECA823]" 
          nextStatus="COOKING"
          buttonText="Mulai Masak"
        />
        <Column 
          title="Sedang Dimasak" 
          status="COOKING" 
          icon={ChefHat}
          colorClass="bg-blue-400" 
          nextStatus="READY_FOR_PICKUP"
          buttonText="Siap Diambil"
        />
        <Column 
          title="Siap Diambil" 
          status="READY_FOR_PICKUP" 
          icon={CheckCircle2}
          colorClass="bg-[#4ADE80]" 
          nextStatus="COMPLETED"
          buttonText="Selesaikan"
        />
      </div>
    </div>
  );
}
