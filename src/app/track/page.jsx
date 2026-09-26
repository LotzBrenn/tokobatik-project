'use client';

import { useState } from 'react';
import Link from 'next/link';
import OrderDetailModal from '@/components/OrderDetailModal';

const STATUS_CONFIG = {
  pending: { label: 'Menunggu', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  processing: { label: 'Diproses', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  completed: { label: 'Selesai', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
};

const ADMIN_WHATSAPP = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';

export default function TrackOrderPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrders([]);

    try {
      const response = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneNumber,
          order_id: orderId || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
        if (data.orders.length === 0) {
          setError('Tidak ditemukan pesanan dengan nomor tersebut');
        }
      } else {
        setError(data.message || 'Gagal mengambil data pesanan');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppLink = (order) => {
    const message = `Halo Admin, saya ingin bertanya tentang pesanan saya:%0A%0AID Pesanan: ${order.order_id}%0ANama: ${order.customer_name}%0ANo. HP: ${order.customer_phone}`;
    return `https://wa.me/${ADMIN_WHATSAPP}?text=${message}`;
  };

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="bg-[#141414] min-h-screen py-12 px-4 md:px-8 lg:px-16 relative">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0 opacity-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url(/batik-bg.png)' }}
        />
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">

        <div className="text-center space-y-4">
          <Link
            href="/"
            className="inline-block text-[#D9A441] hover:text-[#b88933] text-sm font-bold mb-4"
          >
            ← Kembali ke Beranda
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Cek Status Pesanan
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto">
            Masukkan nomor WhatsApp Anda untuk melihat riwayat pesanan dan status transaksi
          </p>
        </div>

        <div className="bg-[#2A2A2A] rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Nomor WhatsApp <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Contoh: 081234567890"
                required
                className="w-full px-4 py-3 bg-[#141414] text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9A441] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">
                ID Pesanan <span className="text-zinc-400 font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Contoh: ORD-BTK-1234567890-5678"
                className="w-full px-4 py-3 bg-[#141414] text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9A441] focus:border-transparent"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Kosongkan untuk melihat semua pesanan Anda
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#D9A441] hover:bg-[#b88933] text-[#141414] font-black rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Mencari...' : 'Cek Pesanan'}
            </button>
          </form>
        </div>

        {orders.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Riwayat Pesanan
              </h2>
              <span className="text-sm text-zinc-400">
                {orders.length} pesanan ditemukan
              </span>
            </div>

            {orders.map((order) => {
              const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

              return (
                <div
                  key={order.id}
                  className="bg-[#2A2A2A] rounded-2xl p-6 border border-white/10 shadow-xl space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <p className="text-xs text-zinc-400 mb-1">ID Pesanan</p>
                      <p className="text-[#D9A441] font-mono font-bold text-sm md:text-base">
                        {order.order_id}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-zinc-400 mb-2">Item Pesanan</p>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center bg-[#141414] p-3 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="text-white font-medium text-sm">
                                {item.product_name}
                              </p>
                              <p className="text-xs text-zinc-400 mt-0.5">
                                Ukuran: {item.size} | Qty: {item.quantity} x Rp {Number(item.price).toLocaleString('id-ID')}
                              </p>
                            </div>
                            <p className="text-white font-semibold text-sm ml-4">
                              Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.note && order.note !== '-' && (
                      <div className="bg-[#141414] p-3 rounded-lg">
                        <p className="text-xs text-zinc-400 mb-1">Catatan</p>
                        <p className="text-white text-sm">{order.note}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-xs text-zinc-400 mb-1">Total Pembayaran</p>
                      <p className="text-2xl font-black text-[#D9A441]">
                        Rp {Number(order.total_amount).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                      <button
                        onClick={() => handleShowDetails(order)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D9A441] hover:bg-[#b88933] text-[#141414] font-bold rounded-xl transition text-sm"
                      >
                        Lihat Detail & Bayar
                      </button>
                      <a
                        href={getWhatsAppLink(order)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition text-sm"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Hubungi Admin via WA
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showModal && selectedOrder && (
          <OrderDetailModal order={selectedOrder} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
}
