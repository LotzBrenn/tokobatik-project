// src/app/admin/layout.jsx
import Link from 'next/link';

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#141414] text-white font-sans">

            {/* SIDEBAR PANEL KIRI */}
            <aside className="w-64 bg-[#2A2A2A] border-r border-white/10 flex flex-col justify-between p-6 shrink-0 hidden md:flex">
                <div className="space-y-8">
                    <div>
                        <span className="text-[#D9A441] text-[10px] font-mono tracking-widest uppercase block">
                            Panel Pengelola_
                        </span>
                        <h2 className="text-xl font-black text-white uppercase tracking-wider mt-1">
                            Griya Batik Admin
                        </h2>
                    </div>

                    <nav className="space-y-2 text-xs font-bold">
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-[#D9A441] hover:text-[#141414] transition"
                        >
                            📊 Data Pesanan
                        </Link>
                        <Link
                            href="/admin/produk"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-[#D9A441] hover:text-[#141414] transition"
                        >
                            🏷️ Kelola Produk
                        </Link>
                        <Link
                            href="/admin/kategori"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-[#D9A441] hover:text-[#141414] transition"
                        >
                            📁 Kelola Kategori
                        </Link>
                    </nav>
                </div>

                <div className="pt-6 border-t border-white/10">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition"
                    >
                        ← Lihat Toko Utama
                    </Link>
                </div>
            </aside>

            {/* AREA KONTEN UTAMA KANAN */}
            <main className="flex-1 p-6 md:p-10 overflow-x-auto">
                {/* Navigasi Mobile Sederhana */}
                <div className="md:hidden mb-6 flex flex-wrap gap-2 pb-4 border-b border-white/10 text-xs font-bold">
                    <Link href="/admin" className="px-3 py-2 bg-[#2A2A2A] text-[#D9A441] rounded-lg">Pesanan</Link>
                    <Link href="/admin/produk" className="px-3 py-2 bg-[#2A2A2A] text-[#D9A441] rounded-lg">Produk</Link>
                    <Link href="/admin/kategori" className="px-3 py-2 bg-[#2A2A2A] text-[#D9A441] rounded-lg">Kategori</Link>
                    <Link href="/" className="px-3 py-2 bg-slate-800 text-white rounded-lg">Toko</Link>
                </div>

                {children}
            </main>

        </div>
    );
}