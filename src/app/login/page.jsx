'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/app/actions/UserAction';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await loginAction(formData);

        if (result.success) {
            // Simpan session admin di LocalStorage / Cookies
            localStorage.setItem('admin_user', JSON.stringify(result.user));
            router.push('/admin'); // Navigasi ke Dashboard Admin
        } else {
            setError(result.message);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#141414] flex items-center justify-center p-4 selection:bg-[#D9A441] selection:text-[#141414]">
            {/* Container Utama dengan Efek Offset Layer Warna Brass (#D9A441) Sesuai Wireframe */}
            <div className="relative w-full max-w-sm">

                {/* Layer Belakang (Kuning / Brass Offset ke Kanan Atas) */}
                <div className="absolute inset-0 bg-[#D9A441] rounded-xl translate-x-6 -translate-y-6" />

                {/* Form Card Depan (#2A2A2A) */}
                <div className="relative bg-[#2A2A2A] p-8 rounded-xl shadow-2xl border border-white/5">
                    <h1 className="text-3xl font-black text-white text-center tracking-widest mb-8">
                        LOGIN_
                    </h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-300 text-xs text-center rounded-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="email"
                                required
                                className="w-full px-5 py-3 bg-[#BDC6CF] text-slate-900 placeholder-slate-600 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D9A441] transition"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="password"
                                required
                                className="w-full px-5 py-3 bg-[#BDC6CF] text-slate-900 placeholder-slate-600 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D9A441] transition"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-[#D9A441] hover:bg-[#c29135] text-slate-950 font-bold rounded-full text-sm transition shadow-md disabled:opacity-50"
                            >
                                {loading ? 'Memproses...' : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}