"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Media } from "@/payload-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Timer, Ticket } from "lucide-react";

type Props = {
  eventId: string;
};

export const EventView = ({ eventId }: Props) => {
  const trpc = useTRPC();

  const { data: rawData } = useSuspenseQuery(
    trpc.events.getOne.queryOptions({ eventId })
  );
  const data = rawData as any;

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!data?.registrationDeadline) return;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const deadline = new Date(data.registrationDeadline!).getTime();
      const distance = deadline - now;
      
      if (distance < 0) {
        setTimeLeft("DITUTUP");
        clearInterval(interval);
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft(`${days}h ${hours}j ${minutes}m ${seconds}d`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [data?.registrationDeadline]);

  const { mutate, isPending } = useMutation(
    trpc.events.register.mutationOptions({

      onSuccess: (res) => {
        if (res.paymentUrl) {
          toast.success("Mengarahkan ke pembayaran...");
          router.push(res.paymentUrl);
        } else {
          toast.success("Berhasil mendaftar event!");
          router.push("/dashboard");
        }
      },
      onError: (err) => {
        if (err.message.includes("UNAUTHORIZED")) {
          router.push("/sign-in");
        } else {
          toast.error(err.message || "Gagal mendaftar");
        }
      }
    })
  );

  const poster = data?.poster as Media | null;
  if (!data) return <div>Event not found</div>;

  const isFull = (data.registeredCount || 0) >= (data.maxQuota || 1000000);
  const isClosed = timeLeft === "DITUTUP";

  return (
    <div className="px-4 lg:px-20 py-14 md:py-20 flex flex-col gap-10">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/3">
          <div className="rounded-base border-2 border-border overflow-hidden bg-pink-200">
            <Image
              src={poster?.url || ""}
              alt={data.name}
              width={1000}
              height={1000}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
        
        <div className="w-full md:w-2/3 flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{data.type}</Badge>
              <Badge variant="secondary">{data.scope}</Badge>
              {data.isOnline && <Badge variant="secondary">Online</Badge>}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold">{data.name}</h1>
          </div>

          <div className="bg-main border-2 border-border rounded-base p-6 shadow-shadow flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-600">Tanggal Pelaksanaan</span>
              <span className="text-xl font-semibold">
                {data.eventDate ? formatDate(data.eventDate) : "TBA"}
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-600">Batas Pendaftaran</span>
              <span className="text-xl font-semibold text-red-600 flex items-center gap-2">
                {data.registrationDeadline ? formatDate(data.registrationDeadline) : "TBA"}
                {timeLeft && timeLeft !== "DITUTUP" && (
                   <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-md border border-red-200 flex items-center gap-1">
                     <Timer className="w-3 h-3" /> {timeLeft}
                   </span>
                )}
                {isClosed && (
                   <span className="bg-slate-200 text-slate-500 text-sm px-2 py-1 rounded-md border border-slate-300">
                     Ditutup
                   </span>
                )}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-600">Lokasi</span>
              <span className="text-lg">{data.location || "Online"}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-600">Kuota Tersisa</span>
              <span className="text-lg">
                {data.maxQuota ? `${Math.max(0, data.maxQuota - (data.registeredCount || 0))} Orang` : "Unlimited"}
              </span>
            </div>
          </div>

          <div className="bg-white border-2 border-border rounded-base p-6 shadow-shadow mt-2">
            <h2 className="text-2xl font-bold mb-4">Deskripsi Event</h2>
            <div className="whitespace-pre-wrap text-justify leading-relaxed">
              {data.description}
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              size="lg" 
              onClick={() => {
                if (!isSignedIn) {
                  router.push("/sign-in");
                  return;
                }
                mutate({ eventId });
              }}
              disabled={isPending || isFull || isClosed}
              className={`w-full md:w-auto text-xl px-10 py-8 font-black uppercase tracking-wider border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all ${
                isFull || isClosed 
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
                  : "bg-primary text-slate-900 hover:bg-green-500 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              {isPending ? "Memproses..." : isClosed ? "Pendaftaran Ditutup" : isFull ? "Kuota Penuh" : (
                <span className="flex items-center gap-2">
                  <Ticket className="w-6 h-6 stroke-[3]" /> Daftar Sekarang
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
