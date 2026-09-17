'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createProduct, updateProduct, deleteProduct } from '@/app/actions/ProductAction';
export default function ProdukClient({ initialProducts, categoriesList }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [detailProduct, setDetailProduct] = useState(null);

    // Buka modal untuk tambah
    const handleOpenAddModal = () => {
        setEditProduct(null);
        setPreviewImage(null);
        setIsModalOpen(true);
    };

    // Buka modal untuk edit
    const handleOpenEditModal = (product) => {
        setEditProduct(product);
        setPreviewImage(product.image || null);
        setIsModalOpen(true);
    };

    // Tutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditProduct(null);
        setPreviewImage(null);
    };

    // Buka detail produk
    const handleOpenDetail = (product) => {
        setDetailProduct(product);
    };

    // Tutup detail produk
    const handleCloseDetail = () => {
        setDetailProduct(null);
    };

    // Handle preview saat pilih file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    return (
        <div className="space-y-6">
            {/* HEADER & TOMBOL TRIGGER MODAL */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#2A2A2A] p-5 rounded-2xl border border-white/10 shadow-lg">
                <div>
                    <h2 className="text-lg font-bold text-white">Daftar Katalog Produk</h2>
                    <p className="text-slate-400 text-xs mt-0.5">
                        Total {initialProducts.length} produk tersimpan.
                    </p>
                </div>

                <button
                    onClick={handleOpenAddModal}
                    className="px-5 py-2.5 bg-[#D9A441] text-[#141414] font-bold text-xs rounded-xl hover:bg-amber-400 transition shadow-lg flex items-center gap-2"
                >
                    <span className="text-base font-black">+</span> Tambah Produk Baru
                </button>
            </div>

            {/* TABEL LIST PRODUK (PENUH 100% LEBAR) */}
            <div className="bg-[#2A2A2A] rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-[#141414] text-[#D9A441] text-[11px] font-mono uppercase border-b border-white/10">
                            <tr>
                                <th className="p-4">Foto</th>
                                <th className="p-4">ID & Nama Produk</th>
                                <th className="p-4">Kategori</th>
                                <th className="p-4">Harga</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {initialProducts.length > 0 ? (
                                initialProducts.map((prod) => (
                                    <tr key={prod.id} className="hover:bg-white/5 transition">
                                        <td className="p-4">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black">
                                                <Image
                                                    src={prod.image || '/uploads/default.jpg'}
                                                    alt={prod.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-mono text-[#D9A441] font-bold block">{prod.id}</span>
                                            <span className="font-bold text-white block">{prod.name}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 bg-[#D9A441]/20 text-[#D9A441] rounded-md font-bold text-[10px]">
                                                {prod.category_name || prod.category}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-emerald-400 font-mono">
                                            Rp {Number(prod.price).toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleOpenDetail(prod)}
                                                className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg font-bold hover:bg-blue-500/30 transition"
                                            >
                                                Lihat Detail
                                            </button>
                                            <button
                                                onClick={() => handleOpenEditModal(prod)}
                                                className="px-3 py-1 bg-amber-500/20 text-[#D9A441] rounded-lg font-bold hover:bg-amber-500/30 transition"
                                            >
                                                Edit
                                            </button>
                                            <form action={deleteProduct} className="inline-block">
                                                <input type="hidden" name="id" value={prod.id} />
                                                <button
                                                    type="submit"
                                                    onClick={(e) => {
                                                        if (!confirm(`Yakin hapus produk "${prod.name}"?`)) e.preventDefault();
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
                                    <td colSpan="5" className="p-8 text-center text-slate-400 italic">
                                        Belum ada produk tersimpan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL POPUP (OVERLAY) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#2A2A2A] border border-white/10 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">

                        {/* Header Modal */}
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                            <h3 className="text-lg font-bold text-[#D9A441] uppercase">
                                {editProduct ? 'Ubah Data Produk' : 'Tambah Produk Baru'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 font-bold flex items-center justify-center transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form Upload */}
                        <form
                            action={editProduct ? updateProduct : createProduct}
                            onSubmit={handleCloseModal}
                            className="space-y-4 text-xs"
                        >
                            <div>
                                <label className="block text-slate-300 font-bold mb-1">ID Produk *</label>
                                <input
                                    type="text"
                                    name="id"
                                    readOnly={!!editProduct}
                                    defaultValue={editProduct?.id || ''}
                                    placeholder="Contoh: BTK-07"
                                    required
                                    className={`w-full p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#D9A441] ${editProduct ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-[#141414] text-white'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 font-bold mb-1">Nama Produk *</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={editProduct?.name || ''}
                                    placeholder="Nama produk..."
                                    required
                                    className="w-full bg-[#141414] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#D9A441]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 font-bold mb-1">Kategori *</label>
                                    <select
                                        name="category"
                                        defaultValue={editProduct?.category || (categoriesList[0]?.id ?? '')}
                                        required
                                        className="w-full bg-[#141414] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#D9A441]"
                                    >
                                        {categoriesList.map((cat) => (
                                            <option key={cat.id || cat.name} value={cat.id || cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-bold mb-1">Harga (Rp) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        defaultValue={editProduct?.price || ''}
                                        placeholder="350000"
                                        required
                                        className="w-full bg-[#141414] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#D9A441]"
                                    />
                                </div>
                            </div>

                            {/* Input File Gambar */}
                            <div>
                                <label className="block text-slate-300 font-bold mb-1">Gambar Produk</label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required={!editProduct} // Wajib diisi jika tambah baru
                                    className="w-full bg-[#141414] text-slate-400 p-2 rounded-xl border border-white/10 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#D9A441] file:text-[#141414] file:font-bold hover:file:bg-amber-400 cursor-pointer"
                                />
                            </div>

                            {/* Pratinjau Gambar */}
                            {previewImage && (
                                <div className="mt-2">
                                    <p className="text-[10px] text-slate-400 mb-1">Preview Gambar:</p>
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded-xl border border-[#D9A441]"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-slate-300 font-bold mb-1">Deskripsi</label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    defaultValue={editProduct?.description || ''}
                                    placeholder="Deskripsi singkat produk..."
                                    className="w-full bg-[#141414] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#D9A441]"
                                ></textarea>
                            </div>

                            {/* Detail Produk Section */}
                            <div className="border-t border-white/10 pt-4 space-y-4">
                                <h4 className="text-sm font-bold text-[#D9A441]">Detail Produk Batik</h4>

                                <div>
                                    <label className="block text-slate-300 font-bold mb-1">Panduan Ukuran</label>
                                    <input
                                        type="text"
                                        name="size_guide"
                                        defaultValue={editProduct?.details ? (typeof editProduct.details === 'string' ? JSON.parse(editProduct.details).size_guide : editProduct.details.size_guide) : ''}
                                        placeholder="Contoh: S, M, L, XL, XXL"
                                        className="w-full bg-[#141414] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#D9A441]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-bold mb-1">Jenis Bahan Kain</label>
                                    <input
                                        type="text"
                                        name="fabric_type"
                                        defaultValue={editProduct?.details ? (typeof editProduct.details === 'string' ? JSON.parse(editProduct.details).fabric_type : editProduct.details.fabric_type) : ''}
                                        placeholder="Contoh: Katun Prima, Sutra, Rayon"
                                        className="w-full bg-[#141414] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#D9A441]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-bold mb-1">Jenis Pewarna</label>
                                    <input
                                        type="text"
                                        name="dye_type"
                                        defaultValue={editProduct?.details ? (typeof editProduct.details === 'string' ? JSON.parse(editProduct.details).dye_type : editProduct.details.dye_type) : ''}
                                        placeholder="Contoh: Pewarna Alami, Pewarna Sintetis"
                                        className="w-full bg-[#141414] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#D9A441]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-bold mb-1">Teknik & Alat Pembuatan</label>
                                    <textarea
                                        name="technique_and_tools"
                                        rows="2"
                                        defaultValue={editProduct?.details ? (typeof editProduct.details === 'string' ? JSON.parse(editProduct.details).technique_and_tools : editProduct.details.technique_and_tools) : ''}
                                        placeholder="Contoh: Teknik cap menggunakan canting dan malam"
                                        className="w-full bg-[#141414] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#D9A441]"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-bold mb-1">Peringatan Perawatan</label>
                                    <textarea
                                        name="warning"
                                        rows="2"
                                        defaultValue={editProduct?.details ? (typeof editProduct.details === 'string' ? JSON.parse(editProduct.details).warning : editProduct.details.warning) : ''}
                                        placeholder="Contoh: Cuci dengan tangan, jangan gunakan pemutih"
                                        className="w-full bg-[#141414] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#D9A441]"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-[#D9A441] text-[#141414] font-bold rounded-xl hover:bg-amber-400 transition"
                                >
                                    {editProduct ? 'Simpan Perubahan' : 'Simpan Produk'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DETAIL PRODUK */}
            {detailProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#2A2A2A] border border-white/10 w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">

                        {/* Header Detail */}
                        <div className="flex justify-between items-start border-b border-white/10 pb-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-[#D9A441] uppercase">{detailProduct.name}</h3>
                                <p className="text-slate-400 text-xs mt-1 font-mono">{detailProduct.id}</p>
                            </div>
                            <button
                                onClick={handleCloseDetail}
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 font-bold flex items-center justify-center transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Gambar Produk */}
                        <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-white/10 bg-black">
                            <Image
                                src={detailProduct.image || '/uploads/default.jpg'}
                                alt={detailProduct.name}
                                fill
                                className="object-contain"
                                unoptimized
                            />
                        </div>

                        {/* Info Dasar */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#141414] p-4 rounded-xl border border-white/10">
                                <p className="text-slate-400 text-xs mb-1">Kategori</p>
                                <p className="text-[#D9A441] font-bold">{detailProduct.category_name || detailProduct.category}</p>
                            </div>
                            <div className="bg-[#141414] p-4 rounded-xl border border-white/10">
                                <p className="text-slate-400 text-xs mb-1">Harga</p>
                                <p className="text-emerald-400 font-bold font-mono">Rp {Number(detailProduct.price).toLocaleString('id-ID')}</p>
                            </div>
                        </div>

                        {/* Deskripsi */}
                        {detailProduct.description && (
                            <div className="bg-[#141414] p-4 rounded-xl border border-white/10">
                                <p className="text-slate-400 text-xs font-bold mb-2">Deskripsi</p>
                                <p className="text-slate-300 text-sm leading-relaxed">{detailProduct.description}</p>
                            </div>
                        )}

                        {/* Detail Produk Batik */}
                        {detailProduct.details && (() => {
                            const details = typeof detailProduct.details === 'string'
                                ? JSON.parse(detailProduct.details)
                                : detailProduct.details;

                            const hasAnyDetail = details?.size_guide || details?.fabric_type || details?.dye_type || details?.technique_and_tools || details?.warning;

                            return hasAnyDetail ? (
                                <div className="bg-[#141414] p-4 rounded-xl border border-white/10 space-y-4">
                                    <h4 className="text-sm font-bold text-[#D9A441] mb-3">Detail Produk Batik</h4>

                                    {details?.size_guide && (
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold mb-1">Panduan Ukuran</p>
                                            <p className="text-slate-300 text-sm">{details.size_guide}</p>
                                        </div>
                                    )}

                                    {details?.fabric_type && (
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold mb-1">Bahan Kain</p>
                                            <p className="text-slate-300 text-sm">{details.fabric_type}</p>
                                        </div>
                                    )}

                                    {details?.dye_type && (
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold mb-1">Pewarna</p>
                                            <p className="text-slate-300 text-sm">{details.dye_type}</p>
                                        </div>
                                    )}

                                    {details?.technique_and_tools && (
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold mb-1">Teknik & Alat</p>
                                            <p className="text-slate-300 text-sm">{details.technique_and_tools}</p>
                                        </div>
                                    )}

                                    {details?.warning && (
                                        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
                                            <p className="text-amber-400 text-xs font-bold mb-1">⚠️ Peringatan Perawatan</p>
                                            <p className="text-amber-300 text-sm">{details.warning}</p>
                                        </div>
                                    )}
                                </div>
                            ) : null;
                        })()}

                        {/* Tombol Tutup */}
                        <div className="flex justify-end pt-4 border-t border-white/10">
                            <button
                                onClick={handleCloseDetail}
                                className="px-6 py-2.5 bg-[#D9A441] text-[#141414] font-bold rounded-xl hover:bg-amber-400 transition"
                            >
                                Tutup
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}