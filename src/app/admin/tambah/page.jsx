'use client';

import { useState } from 'react';
import { createProduct } from '@/app/actions/ProductAction';
import Link from 'next/link';

export default function TambahProdukPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [preview, setPreview] = useState(null);

    // Preview gambar saat file dipilih
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const result = await createProduct(formData);

        setLoading(false);

        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            e.target.reset();
            setPreview(null);
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    };

    return (
        <div className="min-h-screen bg-[#141414] text-white p-8 md:p-16">
            <div className="max-w-2xl mx-auto bg-[#2A2A2A] border border-[#D9A441]/30 p-8 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-[#D9A441]">Tambah Produk Batik</h1>
                    <Link href="/usaha/admin" className="text-sm text-gray-400 hover:text-white">
                        ← Kembali ke Dashboard
                    </Link>
                </div>

                {message && (
                    <div
                        className={`p-4 mb-6 rounded-lg text-sm ${message.type === 'success'
                            ? 'bg-green-900/50 border border-green-500 text-green-200'
                            : 'bg-red-900/50 border border-red-500 text-red-200'
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">ID Produk</label>
                        <input
                            type="text"
                            name="id"
                            placeholder="Contoh: BTK-07"
                            required
                            className="w-full bg-[#141414] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#D9A441]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Nama Produk</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Contoh: Batik Tulis Lasem"
                            required
                            className="w-full bg-[#141414] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#D9A441]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Kategori</label>
                            <select
                                name="category"
                                required
                                className="w-full bg-[#141414] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#D9A441]"
                            >
                                <option value="Batik Tulis">Batik Tulis</option>
                                <option value="Batik Cap">Batik Cap</option>
                                <option value="Batik Kombinasi">Batik Kombinasi</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Harga (Rp)</label>
                            <input
                                type="number"
                                name="price"
                                placeholder="350000"
                                required
                                className="w-full bg-[#141414] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#D9A441]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Deskripsi</label>
                        <textarea
                            name="description"
                            rows="3"
                            placeholder="Deskripsi singkat produk..."
                            required
                            className="w-full bg-[#141414] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#D9A441]"
                        ></textarea>
                    </div>

                    {/* Input Upload Gambar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Upload Gambar Produk</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                            className="w-full bg-[#141414] border border-gray-700 rounded p-2 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#D9A441] file:text-[#141414] hover:file:bg-[#b88933]"
                        />
                    </div>

                    {/* Preview Gambar */}
                    {preview && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-2">Preview Gambar:</p>
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded border border-[#D9A441]"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#D9A441] text-[#141414] font-bold rounded hover:bg-[#b88933] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Menyimpan & Mengunggah...' : 'Simpan Produk'}
                    </button>
                </form>
            </div>
        </div>
    );
}