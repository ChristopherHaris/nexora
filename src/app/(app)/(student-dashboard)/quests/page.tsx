"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Flame, Zap, Trophy, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { QuestsView } from "@/modules/gamification/ui/views/quests-view";
import { LeaderboardTable } from "@/modules/gamification/ui/components/leaderboard-table";
import { UserBadge } from "@/modules/gamification/ui/components/user-badge";
import { useState } from "react";

export default function QuestsPage() {
  const trpc = useTRPC();
  const [activeTab, setActiveTab] = useState<"quests" | "leaderboard" | "badges">("quests");

  const { data: stats, isLoading: loadingStats } = useQuery(
    trpc.gamification.getMyStats.queryOptions()
  );

  const { data: quests, isLoading: loadingQuests } = useQuery(
    trpc.gamification.getMyQuests.queryOptions()
  );

  const { data: leaderboard } = useQuery(
    trpc.gamification.getLeaderboard.queryOptions()
  );

  const { data: badges } = useQuery(
    trpc.gamification.getMyBadges.queryOptions()
  );

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { key: "quests", label: "Misi", icon: Flame },
    { key: "leaderboard", label: "Klasemen", icon: Trophy },
    { key: "badges", label: "Badges", icon: Award },
  ] as const;

  return (
    <div className="w-full space-y-8">
      {/* XP Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-200 rounded-bl-full border-b-4 border-l-4 border-black -mr-4 -mt-4 opacity-40" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase mb-4">
            <Zap className="w-4 h-4" /> Gamification Hub
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">
            Level {stats?.level ?? 1}
          </h1>

          <div className="max-w-md space-y-2">
            <div className="flex justify-between text-sm font-bold text-slate-600">
              <span>{stats?.xpProgress ?? 0} / 200 XP</span>
              <span>Level {(stats?.level ?? 1) + 1}</span>
            </div>
            <Progress value={stats?.xpProgressPercent ?? 0} className="h-4 bg-slate-200 border-2 border-black rounded-lg" />
          </div>

          <div className="flex gap-6 mt-6">
            <div className="bg-slate-50 border-2 border-black rounded-xl px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-xs font-black uppercase text-slate-500">Total XP</span>
              <p className="text-2xl font-black text-purple-700">{stats?.xp ?? 0}</p>
            </div>
            <div className="bg-slate-50 border-2 border-black rounded-xl px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-xs font-black uppercase text-slate-500">Koin</span>
              <p className="text-2xl font-black text-amber-600">{stats?.coins ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-4 border-black pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-black uppercase border-2 border-black rounded-t-xl transition-all ${
              activeTab === tab.key
                ? "bg-[#ECA823] text-slate-900 shadow-[2px_-2px_0px_0px_rgba(0,0,0,1)] border-b-0 mb-[-4px] pb-4"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "quests" && (
          <QuestsView quests={quests ?? []} />
        )}
        {activeTab === "leaderboard" && (
          <LeaderboardTable entries={leaderboard ?? []} />
        )}
        {activeTab === "badges" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase text-slate-900 tracking-tight">Koleksi Badge</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {(badges ?? []).map((badge) => (
                <UserBadge
                  key={badge.id}
                  name={badge.name}
                  description={badge.description}
                  iconUrl={badge.iconUrl}
                  category={badge.category}
                  xpBonus={badge.xpBonus}
                  isEarned={badge.isEarned}
                  earnedAt={badge.earnedAt}
                />
              ))}
              {(badges ?? []).length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500 font-bold">
                  Belum ada badge tersedia. Admin akan menambahkan badge segera!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
