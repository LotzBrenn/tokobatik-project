// src/app/produk/[id]/page.jsx
import { db } from '@/library/db';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

export const revalidate = 0;

// Server Action untuk memproses simpan transaksi ke tabel 'orders'
async function handleCreateOrder(formData) {
  'use server';

  const customerName = formData.get('customerName');
  const customerPhone = formData.get('customerPhone');
  const productName = formData.get('productName');
  const size = formData.get('size');
  const note = formData.get('note') || '-';
  const totalPrice = parseInt(formData.get('totalPrice'), 10);

  // Buat Order ID unik
  const orderId = `ORD-BTK-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    await db.query(
      `INSERT INTO orders (order_id, customer_name, customer_phone, product_name, size, note, total_price)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, customerName, customerPhone, productName, size, note, totalPrice]
    );
  } catch (error) {
    console.error('Gagal menyimpan pesanan:', error);
    return;
  }

  // Setelah berhasil, redirect ke dashboard admin untuk melihat transaksi
  redirect('/admin');
}

export default async function DetailProdukPage({ params }) {
  const { id } = await params;

  // Query produk lengkap dengan nama kategori
  const [rows] = await db.query(
    `SELECT p.*, c.name AS category_name 
     FROM products p
     JOIN categories c ON p.category_id = c.id
     WHERE p.id = ?`,
    [id]
  );

  if (!rows || rows.length === 0) {
    notFound();
  }

  const product = rows[0];

  return (
    <div className="bg-[#141414] text-white min-h-screen py-12 px-6 md:px-12 lg:px-16 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Navigasi Kembali */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#D9A441] hover:underline"
          >
            ← Kembali ke Katalog Utama
          </Link>
        </div>

        {/* Container Utama Detail & Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-[#2A2A2A] rounded-3xl p-6 md:p-10 border border-white/5 shadow-2xl">

          {/* KOLOM KIRI: Visual Produk & Detail Info */}
          <div className="space-y-6">
            <div className="relative w-full h-80 bg-black rounded-2xl overflow-hidden border border-white/10">
              <Image
                src={product.image || '/uploads/default-batik.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
              <span className="absolute top-4 left-4 bg-[#141414]/90 text-[#D9A441] text-xs font-mono px-3 py-1 rounded-full border border-[#D9A441]/30 font-bold uppercase">
                {product.category_name}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-black text-white">{product.name}</h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                {product.description}
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-white/10">
                <span className="text-xs text-slate-400 font-mono">HARGA KAIN / POTONG</span>
                <span className="text-2xl font-black text-[#D9A441]">
                  Rp {Number(product.price).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Form Pemesanan Custom */}
          <div className="bg-[#141414] p-6 rounded-2xl border border-white/10 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#D9A441]">Form Pesanan Custom</h2>
              <p className="text-xs text-slate-400 mt-1">
                Isi data berikut untuk konfirmasi pemesanan kustom langsung ke database pengrajin.
              </p>
            </div>

            <form action={handleCreateOrder} className="space-y-4 text-xs">
              {/* Hidden Inputs */}
              <input type="hidden" name="productName" value={product.name} />
              <input type="hidden" name="totalPrice" value={product.price} />

              {/* Nama Pemesan */}
              <div className="space-y-1">
                <label className="block text-slate-300 font-bold">Nama Lengkap Pemesan *</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-[#2A2A2A] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#D9A441]"
                />
              </div>

              {/* Nomor HP / WhatsApp */}
              <div className="space-y-1">
                <label className="block text-slate-300 font-bold">Nomor WhatsApp / HP *</label>
                <input
                  type="tel"
                  name="customerPhone"
                  required
                  placeholder="Contoh: 081234567890"
                  className="w-full bg-[#2A2A2A] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#D9A441]"
                />
              </div>

              {/* Pilihan Ukuran Custom */}
              <div className="space-y-1">
                <label className="block text-slate-300 font-bold">Pilihan Ukuran / Jenis *</label>
                <select
                  name="size"
                  required
                  className="w-full bg-[#2A2A2A] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#D9A441]"
                >
                  <option value="S">S (Kemeja)</option>
                  <option value="M">M (Kemeja)</option>
                  <option value="L">L (Kemeja)</option>
                  <option value="XL">XL (Kemeja)</option>
                  <option value="XXL">XXL (Kemeja)</option>
                  <option value="Kain 2M">Bahan Kain Lembaran (2 Meter)</option>
                </select>
              </div>

              {/* Catatan Tambahan */}
              <div className="space-y-1">
                <label className="block text-slate-300 font-bold">Catatan Ukuran Custom / Catatan Khusus</label>
                <textarea
                  name="note"
                  rows="3"
                  placeholder="Contoh: Minta lengan panjang + furing katun halus..."
                  className="w-full bg-[#2A2A2A] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#D9A441]"
                ></textarea>
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-[#D9A441] text-[#141414] font-black text-sm rounded-xl hover:bg-amber-400 transition shadow-lg shadow-[#D9A441]/10 mt-2"
              >
                Kirim & Buat Pesanan Baru →
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}