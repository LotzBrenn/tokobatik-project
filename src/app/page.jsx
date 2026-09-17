// src/app/page.jsx
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-between selection:bg-[#D9A441] selection:text-[#141414]">
      {/* Navbar Component */}
      <Navbar />

      {/* Main Hero Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 md:px-16 flex items-center py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">

          {/* Kolom Kiri: Teks & Tombol */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
              Griya Batik
            </h1>

            <h2 className="text-2xl md:text-3xl font-semibold text-[#D9A441]">
              Mahakarya Kain Batik Tradisional Khas Nusantara
            </h2>

            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
              Selamat datang di Griya Batik. Kami menyediakan koleksi kain batik tulis, cap, dan kombinasi dengan motif otentik karya pengrajin lokal. Temukan keindahan warisan budaya dengan sentuhan desain elegan.
            </p>

            <div className="pt-4">
              <Link
                href="/usaha"
                className="inline-block px-8 py-3.5 bg-[#D9A441] hover:bg-[#b88933] text-[#141414] font-bold rounded-2xl transition duration-200 shadow-lg shadow-[#D9A441]/10 text-sm md:text-base"
              >
                menuju ke katalog
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Frame Logo Hero */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px] rounded-full bg-[#D9A441] flex items-center justify-center p-4 shadow-2xl overflow-hidden">
            <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">

              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/dokumenter-batik-pendek.mp4" type="video/mp4" />
                Browser Anda tidak mendukung tag video.
              </video>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-zinc-500 border-t border-white/5">
        © 2026 Griya Batik — Latihan Sertifikasi Junior Web Developer
      </footer>
    </div>
  );
}