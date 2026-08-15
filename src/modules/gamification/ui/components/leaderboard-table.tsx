import React from "react";
import { Trophy, Medal, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatarUrl?: string;
  xpPoints: number;
  campusName: string;
  rank: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500 drop-shadow-md" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400 drop-shadow-md" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-700 drop-shadow-md" />;
      default:
        return <span className="font-bold text-slate-500">{rank}</span>;
    }
  };

  return (
    <div className="bg-white border-2 border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-50 border-b-2 border-border flex items-center justify-between">
        <h3 className="font-black text-lg uppercase text-slate-900">Top Mahasiswa</h3>
        <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">Global</span>
      </div>
      <div className="divide-y-2 divide-border">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "flex items-center p-4 transition-colors hover:bg-slate-50",
              entry.id === currentUserId ? "bg-amber-50/50" : ""
            )}
          >
            <div className="w-8 flex justify-center mr-4">
              {getRankIcon(entry.rank)}
            </div>
            <Avatar className={cn(
              "w-10 h-10 border-2",
              entry.rank === 1 ? "border-yellow-500 glow-amber" : "border-border"
            )}>
              <AvatarImage src={entry.avatarUrl} alt={entry.name} />
              <AvatarFallback className="font-bold bg-slate-200">
                {entry.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-1">
              <h4 className={cn("font-bold text-sm", entry.id === currentUserId ? "text-primary" : "text-slate-900")}>
                {entry.name} {entry.id === currentUserId && "(Anda)"}
              </h4>
              <p className="text-xs text-muted-foreground">{entry.campusName}</p>
            </div>
            <div className="text-right">
              <span className="font-black text-primary block">{entry.xpPoints}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">XP</span>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="p-8 text-center text-muted-foreground font-medium">
            Belum ada data klasemen.
          </div>
        )}
      </div>
    </div>
  );
}
