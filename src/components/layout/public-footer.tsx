import Link from "next/link";

export const PublicFooter = () => {
  return (
    <footer className="w-full bg-slate-950 text-white py-12">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-extrabold text-primary mb-4">NEXORA</h2>
          <p className="text-gray-400 max-w-sm">
            Bridging Technology and Students&apos; Needs. Super-App terintegrasi untuk mendukung operasional dan pengembangan diri mahasiswa Fakultas Teknologi dan Desain, Universitas Bunda Mulia.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Menu Utama</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/" className="hover:text-primary transition-colors">Beranda</Link></li>
            <li><Link href="/events" className="hover:text-primary transition-colors">Event & Lomba</Link></li>
            <li><Link href="/teams" className="hover:text-primary transition-colors">Teammate Matcher</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Informasi</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="#" className="hover:text-primary transition-colors">Tentang NEXORA</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Panduan Penggunaan</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Hubungi Kami</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} NEXORA Team (Josia Given Santoso & Christopher Haris). INSPIRE 2026. Universitas Bunda Mulia.</p>
      </div>
    </footer>
  );
};
