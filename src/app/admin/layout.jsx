// src/app/admin/layout.jsx
import Link from 'next/link';
import { verifySession } from '@/library/session';
import LogoutButton from './components/LogoutButton';

export default async function AdminLayout({ children }) {
    const session = await verifySession();

    return (
        <div className="flex min-h-screen bg-[#141414] text-white font-sans relative">
            {/* Background Image with Overlay */}
            <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{ backgroundImage: 'url(/batik-bg.png)' }}
                />
            </div>

            {/* SIDEBAR PANEL KIRI */}
            <aside className="w-64 bg-[#2A2A2A] border-r border-[#D9A441]/20 flex flex-col justify-between shrink-0 hidden md:flex relative z-10">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-white/5">
                        <div className="mb-1">
                            <span className="text-[#D9A441] text-[9px] font-mono tracking-[0.2em] uppercase opacity-70">
                                Panel Pengelola
                            </span>
                        </div>
                        <h1 className="text-white text-lg font-bold tracking-tight">
                            Griya Batik
                        </h1>
                    </div>

                    {/* User Info */}
                    {session.isAuth && (
                        <div className="px-6 py-5 border-b border-white/5 bg-[#141414]/30">
                            <div className="space-y-1">
                                <p className="text-[9px] text-[#D9A441]/70 font-mono uppercase tracking-wider">
                                    Administrator
                                </p>
                                <p className="text-sm font-semibold text-white truncate">
                                    {session.user.name}
                                </p>
                                <p className="text-[11px] text-white/40 truncate">
                                    {session.user.email}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6">
                        <div className="space-y-1">
                            <Link
                                href="/admin"
                                className="block px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-[#D9A441]"
                            >
                                Data Pesanan
                            </Link>
                            <Link
                                href="/admin/statistik"
                                className="block px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-[#D9A441]"
                            >
                                Statistik
                            </Link>
                            <Link
                                href="/admin/produk"
                                className="block px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-[#D9A441]"
                            >
                                Kelola Produk
                            </Link>
                            <Link
                                href="/admin/kategori"
                                className="block px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-[#D9A441]"
                            >
                                Kelola Kategori
                            </Link>
                        </div>
                    </nav>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-white/5 space-y-2">
                        <Link
                            href="/"
                            className="block w-full py-2.5 px-4 text-center text-xs font-medium text-white/60 hover:text-white bg-[#141414] hover:bg-[#141414]/80 rounded-lg transition-all duration-200"
                        >
                            Kembali ke Toko
                        </Link>
                        <LogoutButton />
                    </div>
                </div>
            </aside>

            {/* AREA KONTEN UTAMA KANAN */}
            <main className="flex-1 p-6 md:p-10 overflow-x-auto relative z-10">
                {/* Navigasi Mobile Sederhana */}
                <div className="md:hidden mb-6 flex flex-wrap gap-2 pb-4 border-b border-white/10 text-xs font-bold">
                    <Link href="/admin" className="px-3 py-2 bg-[#2A2A2A] text-[#D9A441] rounded-lg">Pesanan</Link>
                    <Link href="/admin/statistik" className="px-3 py-2 bg-[#2A2A2A] text-[#D9A441] rounded-lg">Statistik</Link>
                    <Link href="/admin/produk" className="px-3 py-2 bg-[#2A2A2A] text-[#D9A441] rounded-lg">Produk</Link>
                    <Link href="/admin/kategori" className="px-3 py-2 bg-[#2A2A2A] text-[#D9A441] rounded-lg">Kategori</Link>
                    <Link href="/" className="px-3 py-2 bg-slate-800 text-white rounded-lg">Toko</Link>
                </div>

                {children}
            </main>

        </div>
    );
}