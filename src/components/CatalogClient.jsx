'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function KatalogClient({ initialProducts, categoriesList }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [sortBy, setSortBy] = useState('terbaru');
    const [detailProduct, setDetailProduct] = useState(null);
    const { addToCart } = useCart();

    // Filter & Pengurutan Data berdasarkan category_name dari JOIN SQL
    const filteredProducts = (initialProducts || [])
        .filter((item) => {
            const matchesSearch =
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesCategory = selectedCategory === 'Semua' || item.category_name === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'harga-rendah') return a.price - b.price;
            if (sortBy === 'harga-tinggi') return b.price - a.price;
            return 0;
        });

    // Buka detail produk
    const handleOpenDetail = (product) => {
        setDetailProduct(product);
    };

    // Tutup detail produk
    const handleCloseDetail = () => {
        setDetailProduct(null);
    };

    return (
        <div className="bg-[#141414] text-white min-h-screen py-12 px-6 md:px-12 lg:px-16 font-sans">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* HERO HEADER */}
                <header className="text-center space-y-4 pt-6">
                    <span className="text-[#D9A441] text-xs font-mono tracking-widest uppercase block">
                        Pengrajin Batik Tulis & Cap Nusantara_
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
                        Griya Batik Nusantara
                    </h1>
                    <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        Galeri karya batik kustom berkualitas tinggi. Pilih motif favoritmu dan tentukan ukuran kemeja/kain secara kustom.
                    </p>
                </header>

                {/* CONTAINER FILTER & PENCARIAN */}
                <div id="katalog" className="bg-[#D9A441] p-5 md:p-6 rounded-2xl text-[#141414] shadow-2xl space-y-4">
                    <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                        <div className="relative w-full md:w-1/3">
                            <input
                                type="text"
                                placeholder="Cari motif batik..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#2A2A2A] text-white placeholder-slate-400 pl-4 pr-10 py-2.5 rounded-xl text-sm focus:outline-none"
                            />
                        </div>

                        <div className="flex flex-wrap md:flex-nowrap gap-2 w-full md:w-auto justify-end items-center">
                            {/* Dropdown Kategori Dinamis dari Tabel Categories */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-[#2A2A2A] text-white text-xs md:text-sm px-4 py-2.5 rounded-xl focus:outline-none"
                            >
                                <option value="Semua">Semua Kategori</option>
                                {categoriesList?.map((cat) => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-[#2A2A2A] text-white text-xs md:text-sm px-4 py-2.5 rounded-xl focus:outline-none"
                            >
                                <option value="terbaru">Urutkan: Terbaru</option>
                                <option value="harga-rendah">Harga: Termurah</option>
                                <option value="harga-tinggi">Harga: Tertinggi</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* GRID PRODUK */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-[#2A2A2A] rounded-3xl overflow-hidden shadow-xl border border-white/5 flex flex-col justify-between hover:border-[#D9A441]/50 transition duration-300 group"
                        >
                            <div className="relative w-full h-56 bg-black overflow-hidden">
                                <Image
                                    src={product.image || '/uploads/default-batik.jpg'}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition duration-500"
                                    unoptimized
                                />
                                <span className="absolute top-3 left-3 bg-[#141414]/90 text-[#D9A441] text-[10px] font-mono px-3 py-1 rounded-full border border-[#D9A441]/30 uppercase font-bold">
                                    {product.category_name}
                                </span>
                            </div>

                            <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-[#D9A441] transition line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-slate-400 text-xs mt-2 leading-relaxed line-clamp-2">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-white/10 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] text-slate-400 block font-mono">HARGA</span>
                                            <span className="text-lg font-black text-[#D9A441]">
                                                Rp {Number(product.price).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleOpenDetail(product)}
                                            className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-500/30 transition border border-blue-500/30"
                                        >
                                            Lihat Detail
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => addToCart(product, 'L')} // Default ukuran L
                                        className="w-full px-3 py-2 bg-[#D9A441] text-[#141414] text-xs font-bold rounded-lg hover:bg-amber-400 transition"
                                    >
                                        + Tambah ke Keranjang
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

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

                        {/* Tombol Aksi */}
                        <div className="flex justify-end pt-4 border-t border-white/10">
                            <button
                                onClick={() => {
                                    addToCart(detailProduct, 'L');
                                    handleCloseDetail();
                                }}
                                className="px-6 py-2.5 bg-[#D9A441] text-[#141414] font-bold rounded-xl hover:bg-amber-400 transition"
                            >
                                + Tambah ke Keranjang
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}