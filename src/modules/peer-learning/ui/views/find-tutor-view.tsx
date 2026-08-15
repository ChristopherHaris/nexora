import React from "react";
import { Search, Star, BookOpen, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Tutor {
  id: string;
  name: string;
  title?: string;
  avatarUrl?: string;
  major: string;
  rating: number;
  completedSessions: number;
  hourlyRateCoins: number;
  skills: string[];
  cvUrl?: string;
  portfolioUrl?: string;
}

interface FindTutorViewProps {
  tutors: Tutor[];
}

export function FindTutorView({ tutors }: FindTutorViewProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase text-slate-900 tracking-tight">Cari Tutor Sebaya</h2>
          <p className="text-muted-foreground font-medium mt-2">
            Belajar bareng kakak tingkat atau ahli di bidangnya. Bayar pakai Nexora Coins!
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Cari mata kuliah atau skill..." 
            className="pl-9 h-11 border-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tutors.map((tutor) => (
          <div key={tutor.id} className="bg-white border-4 border-border rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 border-2 border-border">
                  <AvatarImage src={tutor.avatarUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {tutor.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-black text-lg text-slate-900 line-clamp-1 leading-tight">{tutor.title}</h3>
                  <p className="text-sm font-bold text-slate-600 line-clamp-1">{tutor.name}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{tutor.major}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-sm">{tutor.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {tutor.skills.map((skill) => (
                <span key={skill} className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600 mb-6 font-medium">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>{tutor.completedSessions} Sesi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span><span className="font-bold text-slate-900">{tutor.hourlyRateCoins}</span> Koin/Jam</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                {tutor.cvUrl && (
                  <Button variant="outline" className="flex-1 font-bold border-2" size="sm" onClick={() => window.open(tutor.cvUrl, '_blank')}>
                    Lihat CV
                  </Button>
                )}
                {tutor.portfolioUrl && (
                  <Button variant="outline" className="flex-1 font-bold border-2" size="sm" onClick={() => window.open(tutor.portfolioUrl, '_blank')}>
                    Portfolio
                  </Button>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 font-bold border-2" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" /> Chat
                </Button>
                <Button className="flex-1 font-bold" size="sm">
                  Booking
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
