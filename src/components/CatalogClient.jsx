'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function KatalogClient({ initialProducts, categoriesList }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [sortBy, setSortBy] = useState('terbaru');
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

                                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] text-slate-400 block font-mono">HARGA</span>
                                        <span className="text-lg font-black text-[#D9A441]">
                                            Rp {Number(product.price).toLocaleString('id-ID')}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => addToCart(product, 'L')} // Default ukuran L
                                        className="px-3 py-1.5 bg-[#D9A441] text-[#141414] text-xs font-bold rounded-lg hover:bg-amber-400 transition"
                                    >
                                        + Keranjang
                                    </button>

                                    <Link
                                        href={`/produk/${product.id}`}
                                        className="px-4 py-2 bg-[#D9A441] text-[#141414] font-bold text-xs rounded-xl hover:bg-amber-400 transition"
                                    >
                                        Pesan Custom →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}