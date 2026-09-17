// src/app/admin/kategori/page.jsx
import { db } from '@/library/db';
import Link from 'next/link';
import KategoriClient from '@/components/KategoriClient';

export const revalidate = 0;

export default async function AdminKategoriPage() {
    let categories = [];

    try {
        const [rows] = await db.query('SELECT * FROM categories ORDER BY id DESC');
        if (rows) categories = rows;
    } catch (error) {
        console.error('Gagal mengambil data kategori:', error);
    }

    return (
        <div className="bg-[#141414] text-white min-h-screen py-10 px-6 md:px-12 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* HEADER DASHBOARD */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#2A2A2A] p-6 rounded-2xl border border-white/10 shadow-xl">
                    <div>
                        <span className="text-[#D9A441] text-xs font-mono tracking-widest uppercase block">
                            Manajemen Data Master_
                        </span>
                        <h1 className="text-2xl md:text-3xl font-black text-white uppercase">
                            Kelola Kategori Produk
                        </h1>
                        <p className="text-slate-400 text-xs mt-1">
                            Tambah, ubah, atau hapus kategori batik pada database MySQL.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href="/admin"
                            className="px-4 py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-700 transition"
                        >
                            ← Data Pesanan
                        </Link>
                        <Link
                            href="/"
                            className="px-4 py-2.5 bg-[#D9A441] text-[#141414] font-bold text-xs rounded-xl hover:bg-amber-400 transition"
                        >
                            Katalog
                        </Link>
                    </div>
                </div>

                {/* INTERACTIVE CLIENT COMPONENT */}
                <KategoriClient categories={categories} />

            </div>
        </div>
    );
}