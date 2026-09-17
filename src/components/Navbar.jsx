// src/components/Navbar.jsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { cart, setIsOpen } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className="px-6 md:px-16 py-5 flex justify-between items-center bg-[#1A1A1A] border-b border-white/5 sticky top-0 z-40 backdrop-blur-md">
      {/* Brand & Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#D9A441] group-hover:scale-105 transition">
          <Image
            src="/logo.png"
            alt="Griya Batik Logo"
            fill
            className="object-cover"
          />
        </div>
        <span className="text-lg font-bold tracking-wide text-white group-hover:text-[#D9A441] transition">
          Griya Batik
        </span>
      </Link>

      {/* Navigasi Links & Keranjang */}
      <nav className="flex items-center gap-5 text-xs font-semibold">
        <Link href="/" className="text-zinc-300 hover:text-[#D9A441] transition hidden sm:inline">
          Beranda
        </Link>
        <Link href="/usaha" className="text-zinc-300 hover:text-[#D9A441] transition">
          Katalog
        </Link>

        {/* Tombol Keranjang */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-2 bg-[#2A2A2A] border border-white/10 hover:border-[#D9A441] px-3.5 py-1.5 rounded-xl transition text-white"
        >
          <span>🛒</span>
          <span className="hidden sm:inline">Keranjang</span>
          {totalItems > 0 && (
            <span className="bg-[#D9A441] text-[#141414] font-bold text-[10px] px-1.5 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </button>


      </nav>
    </header>
  );
}