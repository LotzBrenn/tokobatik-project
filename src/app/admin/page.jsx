// src/app/admin/page.jsx
import { db } from '@/library/db';
import Link from 'next/link';

// Mematikan caching agar data transaksi MySQL selalu diperbarui saat halaman dibuka
export const revalidate = 0;

export default async function AdminDashboardPage() {
  let orders = [];

  try {
    // Ambil seluruh data pesanan dari database MySQL, diurutkan dari yang terbaru
    const [rows] = await db.query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );
    if (rows) orders = rows;
  } catch (error) {
    console.error('Gagal mengambil data pesanan dari database:', error);
  }

  return (
    <div className="bg-[#141414] text-white min-h-screen py-10 px-6 md:px-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER DASHBOARD */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#2A2A2A] p-6 rounded-2xl border border-white/10 shadow-xl">
          <div>
            <span className="text-[#D9A441] text-xs font-mono tracking-widest uppercase block">
              Sistem Manajemen Pesanan_
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase">
              Dashboard CRM Admin
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Data transaksi pesanan batik kustom real-time dari database MySQL.
            </p>
          </div>

          <Link
            href="/"
            className="px-4 py-2.5 bg-[#D9A441] text-[#141414] font-bold text-xs rounded-xl hover:bg-amber-400 transition"
          >
            ← Kembali ke Katalog Utama
          </Link>
        </div>

        {/* TABEL DATA TRANSAKSI */}
        <div className="bg-[#2A2A2A] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#141414] text-[#D9A441] text-[11px] font-mono uppercase border-b border-white/10">
                <tr>
                  <th className="p-4">ID Transaksi</th>
                  <th className="p-4">Nama Pelanggan</th>
                  <th className="p-4">No. WhatsApp</th>
                  <th className="p-4">Produk Batik</th>
                  <th className="p-4">Ukuran</th>
                  <th className="p-4">Catatan Kustom</th>
                  <th className="p-4">Total Harga</th>
                  <th className="p-4">Waktu Transaksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition">
                      <td className="p-4 font-mono font-bold text-[#D9A441]">
                        {order.order_id}
                      </td>
                      <td className="p-4 font-bold text-white">
                        {order.customer_name}
                      </td>
                      <td className="p-4 font-mono text-slate-300">
                        {order.customer_phone}
                      </td>
                      <td className="p-4">{order.product_name}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-[#D9A441]/20 text-[#D9A441] rounded-md font-bold text-[10px]">
                          {order.size}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs truncate text-slate-400">
                        {order.note || '-'}
                      </td>
                      <td className="p-4 font-bold text-emerald-400 font-mono">
                        Rp {Number(order.total_price).toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 text-[10px] text-slate-400 font-mono">
                        {new Date(order.created_at).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-slate-400 italic">
                      Belum ada transaksi tersimpan di database MySQL.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}