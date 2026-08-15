import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserBadgeProps {
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  xpBonus: number;
  earnedAt?: string;
  isEarned?: boolean;
  className?: string;
}

export function UserBadge({
  name,
  description,
  iconUrl,
  category,
  xpBonus,
  earnedAt,
  isEarned = true,
  className,
}: UserBadgeProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center p-4 border-2 rounded-xl text-center transition-all duration-300",
        isEarned
          ? "border-primary bg-white shadow-sm hover:shadow-md hover:-translate-y-1"
          : "border-border bg-muted/50 grayscale opacity-70",
        className
      )}
      title={description}
    >
      <div className="relative w-16 h-16 mb-3">
        <Image
          src={iconUrl}
          alt={name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 64px"
        />
      </div>
      <h4 className={cn("font-bold text-sm mb-1", isEarned ? "text-slate-900" : "text-muted-foreground")}>
        {name}
      </h4>
      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 mb-2">
        {category}
      </span>
      {isEarned ? (
        <span className="text-xs text-primary font-semibold">+{xpBonus} XP</span>
      ) : (
        <span className="text-xs text-muted-foreground">Terkunci</span>
      )}
      {earnedAt && (
        <span className="text-[10px] text-muted-foreground mt-2">
          {new Date(earnedAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      )}
    </div>
  );
}
