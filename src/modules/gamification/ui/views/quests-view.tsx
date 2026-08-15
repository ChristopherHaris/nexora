import React from "react";
import { CheckCircle2, Target, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  type: "daily" | "weekly" | "milestone";
  progress: number;
  targetCount: number;
  isCompleted: boolean;
}

interface QuestsViewProps {
  quests: Quest[];
}

export function QuestsView({ quests }: QuestsViewProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "daily": return <Target className="w-5 h-5 text-blue-500" />;
      case "weekly": return <Calendar className="w-5 h-5 text-purple-500" />;
      case "milestone": return <Award className="w-5 h-5 text-amber-500" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case "daily": return "Harian";
      case "weekly": return "Mingguan";
      case "milestone": return "Pencapaian";
      default: return "Misi";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black uppercase text-slate-900 tracking-tight">Misi & Tantangan</h2>
        <p className="text-muted-foreground font-medium">
          Selesaikan misi untuk mendapatkan XP dan Nexora Coins. Kumpulkan badge eksklusif!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={cn(
              "flex flex-col p-6 border-4 rounded-xl relative overflow-hidden transition-all",
              quest.isCompleted 
                ? "border-green-200 bg-green-50/30" 
                : "border-border bg-white hover:border-primary/50 shadow-sm"
            )}
          >
            {quest.isCompleted && (
              <div className="absolute top-0 right-0 p-2 bg-green-100 rounded-bl-xl border-b-2 border-l-2 border-green-200">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-100 rounded-lg">
                {getIcon(quest.type)}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  {getLabel(quest.type)}
                </span>
                <h4 className="font-bold text-slate-900 leading-tight">{quest.title}</h4>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-6 flex-1">
              {quest.description}
            </p>

            <div className="mt-auto space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Progres</span>
                  <span>{quest.progress} / {quest.targetCount}</span>
                </div>
                <Progress 
                  value={(quest.progress / quest.targetCount) * 100} 
                  className="h-2 bg-slate-100" 
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-slate-100">
                <div className="flex items-center gap-1 text-amber-600 font-bold">
                  <span className="text-lg">+{quest.xpReward}</span>
                  <span className="text-[10px] uppercase">XP</span>
                </div>
                <Button 
                  size="sm" 
                  variant={quest.isCompleted ? "outline" : "default"}
                  className={cn("font-bold", quest.isCompleted && "text-green-600 border-green-200")}
                  disabled={quest.isCompleted}
                >
                  {quest.isCompleted ? "Selesai" : "Lanjutkan"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
