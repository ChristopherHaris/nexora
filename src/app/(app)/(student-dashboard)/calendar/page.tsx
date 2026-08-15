"use client";

import React, { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon, CheckSquare, Trophy, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";
import { id } from "date-fns/locale";

type EventType = {
  date: Date;
  title: string;
  type: "COMPETITION" | "STUDY_TASK";
  category?: string;
};

export default function GlobalCalendarPage() {
  const trpc = useTRPC();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Fetch data
  const { data: teamsData, isLoading: loadingTeams } = useQuery(trpc.teams.getMyActiveTeams.queryOptions());
  const { data: tasksData, isLoading: loadingTasks } = useQuery(trpc.studyTasks.getTasks.queryOptions({ category: "Semua" }));

  const isLoading = loadingTeams || loadingTasks;

  // Aggregate events
  const events: EventType[] = [];

  if (teamsData) {
    teamsData.forEach((team: any) => {
      if (team.competitionDate) {
        events.push({
          date: new Date(team.competitionDate),
          title: team.competitionName,
          type: "COMPETITION",
          category: team.fieldCategory,
        });
      }
    });
  }

  if (tasksData) {
    tasksData.forEach((task: any) => {
      if (task.deadline) {
        events.push({
          date: new Date(task.deadline),
          title: task.title,
          type: "STUDY_TASK",
          category: task.category,
        });
      }
    });
  }

  // Get dates that have events for the calendar modifiers
  const eventDates = events.map(e => e.date);

  // Filter events for the selected date
  const selectedEvents = events.filter(e => 
    selectedDate ? isSameDay(e.date, selectedDate) : false
  );

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="bg-[#ECA823] p-6 sm:p-8 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col justify-between items-start">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase mb-4">
            <CalendarIcon className="w-4 h-4" /> Global Calendar
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight uppercase">
            My Calendar
          </h1>
          <p className="text-base font-bold text-slate-900/80 max-w-xl">
            Pantau semua deadline perlombaan, tugas kuliah, dan agenda penting kamu di satu tempat!
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Calendar Widget */}
        <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex-1 lg:max-w-md h-fit">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{
                hasEvent: eventDates
              }}
              modifiersClassNames={{
                hasEvent: "font-black text-[#ECA823] border-b-4 border-black bg-yellow-100"
              }}
              locale={id}
              className="bg-white text-black p-4 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full max-w-[350px]"
              classNames={{
                weekday: "text-slate-500 font-black text-sm uppercase tracking-wider pb-4",
                caption_label: "font-black text-xl tracking-wide uppercase",
                day: "h-10 w-10 text-center font-bold text-lg hover:bg-slate-100 rounded-lg cursor-pointer transition-colors flex items-center justify-center",
                selected: "bg-black text-white hover:bg-slate-800 focus:bg-black focus:text-white rounded-lg",
                today: "bg-slate-200 font-black rounded-lg",
              }}
            />
          </div>

          <div className="mt-8 pt-6 border-t-4 border-black border-dashed space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Legend</h3>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 border-2 border-black border-b-4 flex items-center justify-center">
                <span className="text-black text-sm font-black">15</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-black uppercase">Ada Agenda</p>
                <p className="text-[10px] text-slate-500 font-bold">Hari dengan deadline</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-black text-white border-2 border-black flex items-center justify-center">
                <span className="text-sm font-black">16</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-black uppercase">Hari Terpilih</p>
                <p className="text-[10px] text-slate-500 font-bold">Klik untuk melihat detail</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Events Panel */}
        <div className="bg-[#F4F4F0] border-4 border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex-[2] flex flex-col min-h-[500px]">
          <div className="mb-8 flex items-center justify-between border-b-4 border-black pb-4 border-dashed">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-wide text-black">
                {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: id }) : "Pilih Tanggal"}
              </h2>
              <p className="text-sm font-bold text-slate-500 mt-1">Agenda hari ini</p>
            </div>
            {selectedDate && (
              <Button 
                onClick={() => setSelectedDate(new Date())}
                variant="outline"
                className="border-2 border-black font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none"
              >
                Hari Ini
              </Button>
            )}
          </div>
          
          <div className="flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 h-full">
                <Clock className="w-12 h-12 animate-spin text-black mb-4" />
                <p className="font-black uppercase text-slate-500">Memuat Kalender...</p>
              </div>
            ) : selectedEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedEvents.map((ev, idx) => (
                  <div key={idx} className="bg-white border-4 border-black p-5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex gap-4 items-start transition-transform hover:-translate-y-1">
                    <div className={`p-3 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${ev.type === 'COMPETITION' ? 'bg-[#00FFFF]' : 'bg-[#00FF41]'}`}>
                      {ev.type === 'COMPETITION' ? (
                        <Trophy className="w-6 h-6 text-black" />
                      ) : (
                        <CheckSquare className="w-6 h-6 text-black" />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex gap-2 items-center mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border-2 border-black ${ev.type === 'COMPETITION' ? 'bg-[#00FFFF]/20 text-black' : 'bg-[#00FF41]/20 text-black'}`}>
                          {ev.type === 'COMPETITION' ? 'KOMPETISI' : 'TUGAS KULIAH'}
                        </span>
                        {ev.category && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-2 py-1 rounded-md border-2 border-slate-300">
                            {ev.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xl font-black text-black uppercase leading-tight mt-2">{ev.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 h-full text-center border-4 border-dashed border-slate-300 rounded-xl bg-white">
                <CalendarIcon className="w-16 h-16 text-slate-300 mb-4" />
                <p className="font-black text-xl uppercase text-slate-400">Tidak ada agenda</p>
                <p className="font-bold text-slate-500 mt-2">Bebas dari deadline! Waktunya bersantai atau cari proyek baru.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
