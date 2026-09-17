'use client';

import { useState } from 'react';
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/CategoryAction';

export default function KategoriClient({ categories }) {
    const [editCategory, setEditCategory] = useState(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* FORM TAMBAH / EDIT KATEGORI */}
            <div className="bg-[#2A2A2A] p-6 rounded-2xl border border-white/10 h-fit space-y-4">
                <h2 className="text-lg font-bold text-[#D9A441]">
                    {editCategory ? 'Ubah Kategori' : 'Tambah Kategori Baru'}
                </h2>

                {editCategory ? (
                    /* FORM EDIT */
                    <form action={updateCategory} onSubmit={() => setEditCategory(null)} className="space-y-4 text-xs">
                        <input type="hidden" name="id" value={editCategory.id} />
                        <div className="space-y-1">
                            <label className="block text-slate-300 font-bold">Nama Kategori *</label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={editCategory.name}
                                required
                                className="w-full bg-[#141414] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#D9A441]"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 py-2.5 bg-[#D9A441] text-[#141414] font-bold rounded-xl hover:bg-amber-400 transition"
                            >
                                Simpan Perubahan
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditCategory(null)}
                                className="px-4 py-2.5 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                ) : (
                    /* FORM TAMBAH */
                    <form action={createCategory} className="space-y-4 text-xs">
                        <div className="space-y-1">
                            <label className="block text-slate-300 font-bold">Nama Kategori Baru *</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Contoh: Batik Printing"
                                required
                                className="w-full bg-[#141414] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#D9A441]"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2.5 bg-[#D9A441] text-[#141414] font-bold rounded-xl hover:bg-amber-400 transition"
                        >
                            + Tambah Kategori
                        </button>
                    </form>
                )}
            </div>

            {/* TABEL DATA KATEGORI */}
            <div className="md:col-span-2 bg-[#2A2A2A] rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#141414] text-[#D9A441] text-[11px] font-mono uppercase border-b border-white/10">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Nama Kategori</th>
                            <th className="p-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-white/5 transition">
                                    <td className="p-4 font-mono font-bold text-slate-400">#{cat.id}</td>
                                    <td className="p-4 font-bold text-white">{cat.name}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => setEditCategory(cat)}
                                            className="px-3 py-1 bg-amber-500/20 text-[#D9A441] rounded-lg font-bold hover:bg-amber-500/30 transition"
                                        >
                                            Edit
                                        </button>
                                        <form action={deleteCategory} className="inline-block">
                                            <input type="hidden" name="id" value={cat.id} />
                                            <button
                                                type="submit"
                                                onClick={(e) => {
                                                    if (!confirm(`Yakin ingin menghapus kategori "${cat.name}"?`)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-lg font-bold hover:bg-rose-500/30 transition"
                                            >
                                                Hapus
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="p-8 text-center text-slate-400 italic">
                                    Belum ada kategori tersimpan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}