import React from "react";
import { Calendar, Clock, Video, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  partnerName: string;
  partnerAvatar?: string;
  topic: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
  isMentor: boolean; // True if current user is the mentor
}

interface MentoringSessionViewProps {
  sessions: Session[];
}

export function MentoringSessionView({ sessions }: MentoringSessionViewProps) {
  const getStatusColor = (status: Session["status"]) => {
    switch (status) {
      case "accepted": return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "rejected":
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-border";
    }
  };

  const getStatusLabel = (status: Session["status"]) => {
    switch (status) {
      case "accepted": return "Akan Datang";
      case "completed": return "Selesai";
      case "pending": return "Menunggu";
      case "rejected": return "Ditolak";
      case "cancelled": return "Batal";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black uppercase text-slate-900 tracking-tight">Jadwal Mentoring</h2>
        <p className="text-muted-foreground font-medium">
          Kelola sesi belajar Anda sebagai murid maupun mentor.
        </p>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border-2 border-border rounded-xl gap-6 shadow-sm">
            
            <div className="flex items-center gap-5">
              <Avatar className="w-12 h-12 border-2 border-border">
                <AvatarImage src={session.partnerAvatar} />
                <AvatarFallback className="font-bold bg-slate-100">
                  {session.partnerName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                    {session.isMentor ? "Mengajar" : "Belajar"}
                  </span>
                  <span className={cn("text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border", getStatusColor(session.status))}>
                    {getStatusLabel(session.status)}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900">{session.topic}</h3>
                <p className="text-sm text-muted-foreground font-medium">Bersama {session.partnerName}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8 bg-slate-50 p-3 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Calendar className="w-4 h-4 text-primary" />
                <span>
                  {new Date(session.scheduledAt).toLocaleDateString("id-ID", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Clock className="w-4 h-4 text-primary" />
                <span>
                  {new Date(session.scheduledAt).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} ({session.durationMinutes} mnt)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {session.status === "accepted" && (
                <Button className="flex-1 md:flex-none font-bold bg-blue-600 hover:bg-blue-700">
                  <Video className="w-4 h-4 mr-2" /> Join Gmeet
                </Button>
              )}
              {session.status === "pending" && session.isMentor && (
                <>
                  <Button variant="outline" className="flex-1 md:flex-none border-green-200 text-green-700 hover:bg-green-50">
                    <CheckCircle className="w-4 h-4 mr-2" /> Terima
                  </Button>
                  <Button variant="outline" className="flex-1 md:flex-none border-red-200 text-red-700 hover:bg-red-50">
                    <XCircle className="w-4 h-4 mr-2" /> Tolak
                  </Button>
                </>
              )}
              {session.status === "completed" && !session.isMentor && (
                <Button variant="outline" className="flex-1 md:flex-none font-bold border-2">
                  Beri Rating
                </Button>
              )}
            </div>
            
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="p-12 text-center border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground font-medium">Belum ada sesi mentoring yang terjadwal.</p>
          </div>
        )}
      </div>
    </div>
  );
}
