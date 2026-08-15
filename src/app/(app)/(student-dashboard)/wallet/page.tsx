"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Coins, ArrowUpRight, ArrowDownLeft, Wallet, Gift, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function WalletPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [redeemAmount, setRedeemAmount] = useState(50);

  const { data: stats, isLoading: loadingStats } = useQuery(
    trpc.gamification.getMyStats.queryOptions()
  );

  const { data: history, isLoading: loadingHistory } = useQuery(
    trpc.gamification.getWalletHistory.queryOptions()
  );

  const redeemMutation = useMutation(
    trpc.gamification.redeemCoinsForDiscount.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Berhasil! Anda mendapat diskon Rp ${data.discountRupiah.toLocaleString("id-ID")}`);
        queryClient.invalidateQueries({ queryKey: trpc.gamification.getMyStats.queryKey() });
        queryClient.invalidateQueries({ queryKey: trpc.gamification.getWalletHistory.queryKey() });
      },
      onError: (err) => {
        toast.error(err.message);
      },
    })
  );

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-200 rounded-bl-full border-b-4 border-l-4 border-black -mr-4 -mt-4 opacity-40" />
        <div className="absolute bottom-4 right-16 w-12 h-12 bg-amber-500 rounded-full border-4 border-black opacity-60" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase mb-4">
            <Wallet className="w-4 h-4" /> Nexora Wallet
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight uppercase">
            Dompet Digital
          </h1>
          <p className="text-base font-bold text-slate-600 max-w-xl">
            Kumpulkan Nexora Coins dari aktivitas kampus. Tukarkan menjadi diskon nyata di Smart Kantin!
          </p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
          <Coins className="w-12 h-12 text-slate-900 mx-auto mb-4" />
          <p className="text-sm font-black uppercase text-slate-800 mb-2">Saldo Nexora Coins</p>
          <p className="text-6xl font-black text-slate-900">{stats?.coins ?? 0}</p>
          <p className="text-sm font-bold text-slate-700 mt-2">
            = Rp {((stats?.coins ?? 0) * 100).toLocaleString("id-ID")} diskon
          </p>
        </div>

        <div className="bg-white rounded-2xl border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <Gift className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-lg font-black uppercase text-slate-900 mb-4">Tukar Koin ke Diskon</h3>
          <p className="text-sm font-bold text-slate-500 mb-6">1 Koin = Rp 100 diskon di Smart Kantin</p>

          <div className="flex gap-2 mb-4">
            {[10, 25, 50, 100].map((amount) => (
              <button
                key={amount}
                onClick={() => setRedeemAmount(amount)}
                className={`flex-1 py-2 border-2 border-black rounded-lg text-sm font-black uppercase transition-all ${
                  redeemAmount === amount
                    ? "bg-primary text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-slate-900 hover:bg-slate-50"
                }`}
              >
                {amount}
              </button>
            ))}
          </div>

          <Button
            className="w-full h-12 font-black uppercase text-sm bg-primary hover:bg-green-700 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            disabled={redeemMutation.isPending || (stats?.coins ?? 0) < redeemAmount}
            onClick={() => redeemMutation.mutate({ amount: redeemAmount })}
          >
            {redeemMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Tukarkan {redeemAmount} Koin (= Rp {(redeemAmount * 100).toLocaleString("id-ID")})
          </Button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xl font-black uppercase text-slate-900 mb-6 border-b-4 border-black pb-4">
          Riwayat Transaksi
        </h2>

        {loadingHistory ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (history ?? []).length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-bold">
            Belum ada riwayat transaksi. Mulai gunakan fitur Nexora untuk mengumpulkan koin!
          </div>
        ) : (
          <div className="space-y-3">
            {(history ?? []).map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 p-4 bg-slate-50 border-2 border-border rounded-xl">
                <div className={`w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                  tx.type === "earned" ? "bg-green-200" : "bg-red-200"
                }`}>
                  {tx.type === "earned" ? (
                    <ArrowDownLeft className="w-5 h-5 text-green-800" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-800" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-slate-900">{tx.description}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    {new Date(tx.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className={`font-black text-lg ${tx.type === "earned" ? "text-green-700" : "text-red-700"}`}>
                  {tx.type === "earned" ? "+" : "-"}{tx.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
