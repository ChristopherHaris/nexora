import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Users, Search, Coffee, Briefcase, Zap, ShieldCheck, Sparkles, GraduationCap, Store } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getPayload } from "payload";
import config from "@payload-config";

export const metadata = {
  title: "NEXORA - Campus Super-App",
  description: "Bridging Technology and Students' Needs at Universitas Bunda Mulia.",
};

export default async function Home() {
  const payload = await getPayload({ config });
  const tenantsQuery = await payload.find({
    collection: "tenants",
    where: { isOpen: { equals: true } },
    limit: 4,
  });
  const publicTenants = tenantsQuery.docs;

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F0] font-sans selection:bg-[#ECA823] selection:text-slate-900 overflow-hidden">

      <section className="relative w-full pt-16 pb-24 lg:pt-32 lg:pb-40 border-b-4 border-border bg-[#ECA823] overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 2px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        {/* Floating Abstract Shapes */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary border-4 border-border rounded-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hidden lg:block animate-[bounce_5s_infinite]" />
        <div className="absolute bottom-10 left-20 w-24 h-24 bg-white border-4 border-border rounded-base shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-12 hidden lg:block" />

        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center text-center">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="inline-block bg-white px-4 py-2 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 transform -rotate-2">
              <span className="text-sm md:text-base font-black uppercase tracking-widest text-primary">INSPIRE 2026: INNOVATING BEYOND CODE</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight text-slate-900 mb-8 max-w-5xl leading-[1.1] uppercase">
              Satu Platform, <br className="hidden md:block" /> 
              <span className="bg-white px-4 border-4 border-border inline-block mt-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">Ribuan Peluang.</span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.4}>
            <p className="text-lg md:text-2xl text-slate-900 font-bold mb-12 max-w-3xl leading-relaxed bg-white/50 p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Super-App Ekosistem Kampus Terintegrasi. Menghubungkan logistik kantin, pencarian tim lomba, hingga navigasi karir dalam satu genggaman.
            </p>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.5}>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link href="/sign-up">
                <Button size="lg" className="h-16 px-10 text-xl font-black uppercase bg-primary hover:bg-green-700 text-white border-4 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-base flex items-center gap-3 group">
                  <GraduationCap className="w-6 h-6" /> Mulai Sekarang
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 bg-white border-b-4 border-border relative z-10">
        <div className="container mx-auto px-4 md:px-8">
          <ScrollReveal direction="up">
            <div className="text-center max-w-4xl mx-auto mb-20">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase">
                5 Pilar Ekosistem
              </h2>
              <div className="w-24 h-4 bg-primary border-2 border-border mx-auto mt-6" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="p-8 bg-[#F4F4F0] border-4 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all duration-300 rounded-base relative group">
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary border-4 border-border rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-12 transition-transform">
                  <Coffee className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 uppercase mb-4 mt-4">Smart Kantin</h4>
                <p className="text-slate-900 font-bold leading-relaxed">
                  Pesan makanan lebih cepat. Sistem antrean digital tanpa harus berdesakan di jam istirahat.
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 2 */}
            <ScrollReveal direction="up" delay={0.2}>
              <div className="p-8 bg-[#F4F4F0] border-4 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all duration-300 rounded-base relative group">
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#ECA823] border-4 border-border rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-12 transition-transform">
                  <Trophy className="w-8 h-8 text-slate-900" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 uppercase mb-4 mt-4">Event & Lomba</h4>
                <p className="text-slate-900 font-bold leading-relaxed">
                  Pusat informasi kegiatan. Daftar instan dan pantau jadwal kompetisi langsung dari kalender Anda.
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 3 */}
            <ScrollReveal direction="up" delay={0.3}>
              <div className="p-8 bg-[#F4F4F0] border-4 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all duration-300 rounded-base relative group">
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#BBE2EC] border-4 border-border rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-12 transition-transform">
                  <Users className="w-8 h-8 text-slate-900" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 uppercase mb-4 mt-4">Teammate Match</h4>
                <p className="text-slate-900 font-bold leading-relaxed">
                  Platform Tinder-style untuk cari anggota tim lomba berbasis kebutuhan skill (Programmer, Designer, dll).
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 4 */}
            <ScrollReveal direction="up" delay={0.4} className="lg:col-span-1">
              <div className="p-8 bg-[#F4F4F0] border-4 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all duration-300 rounded-base relative group h-full">
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-red-400 border-4 border-border rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-12 transition-transform">
                  <Search className="w-8 h-8 text-slate-900" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 uppercase mb-4 mt-4">Lost & Found</h4>
                <p className="text-slate-900 font-bold leading-relaxed">
                  Pusat pelaporan barang hilang. Pencocokan otomatis menggunakan AI Keyword Matching.
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 5 */}
            <ScrollReveal direction="up" delay={0.5} className="lg:col-span-2">
              <div className="p-8 bg-[#F4F4F0] border-4 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all duration-300 rounded-base relative group h-full">
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-green-300 border-4 border-border rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-12 transition-transform">
                  <Briefcase className="w-8 h-8 text-slate-900" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 uppercase mb-4 mt-4">Career Compass</h4>
                <p className="text-slate-900 font-bold leading-relaxed max-w-xl">
                  Navigasi kesiapan kerja berdasarkan metrik portofolio Anda. Rekomendasi karir terhubung langsung dengan jejak aktivitas lomba dan kepanitiaan Anda.
                </p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      <section className="py-24 bg-[#BBE2EC] border-b-4 border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <div className="inline-block bg-white px-3 py-1 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                <span className="text-sm font-black uppercase text-slate-900">Live Preview</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase leading-tight">
                Kantin Mitra Kami
              </h2>
            </div>
            <Link href="/sign-up">
              <Button className="h-12 px-6 text-sm font-black uppercase bg-white text-slate-900 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-base">
                Lihat Semua Kantin
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {publicTenants.map((tenant) => (
              <div key={tenant.id} className="bg-white border-4 border-border rounded-base p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform">
                <div className="w-16 h-16 bg-[#F4F4F0] border-2 border-border rounded-base flex items-center justify-center mb-6">
                  <Store className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-black uppercase text-slate-900 mb-2 truncate">{tenant.name}</h3>
                <p className="text-sm font-bold text-slate-600 mb-4 line-clamp-2">
                  {tenant.description || "Mitra resmi kampus terintegrasi dengan layanan NEXORA Smart Kantin."}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-black uppercase bg-green-100 text-green-800 px-2 py-1 border-2 border-border rounded-base">Aktif</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-[#F4F4F0] text-center px-4">
        <ScrollReveal direction="up" delay={0.2}>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase mb-8">
            SIAP MERUBAH <br /> <span className="text-primary">EKOSISTEM?</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.4}>
          <Link href="/sign-up">
            <Button size="lg" className="h-20 px-12 text-2xl font-black uppercase bg-[#ECA823] hover:bg-yellow-500 text-slate-900 border-4 border-border shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all rounded-base">
              GABUNG SEKARANG
            </Button>
          </Link>
        </ScrollReveal>
      </section>
      
    </div>
  );
}
