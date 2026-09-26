'use client';

import { useState, useTransition } from 'react';
import { updateOrderStatus, getOrderDetails } from '@/app/actions/AdminAction';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Menunggu', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { value: 'processing', label: 'Diproses', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'completed', label: 'Selesai', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { value: 'cancelled', label: 'Dibatalkan', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
];

export default function OrderManagementTable({ orders, summary }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [lightboxImage, setLightboxImage] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (!result.success) {
        alert(result.message);
      }
    });
  };

  const handleViewDetail = async (order) => {
    setSelectedOrder(order);
    const result = await getOrderDetails(order.order_id);
    if (result.success) {
      setOrderDetails(result);
    } else {
      alert(result.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusConfig = (status) => {
    return STATUS_OPTIONS.find(opt => opt.value === status) || STATUS_OPTIONS[0];
  };

  return (
    <>
      <div className="bg-[#2A2A2A] rounded-lg border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Data Transaksi</h2>
          <p className="text-sm text-zinc-400 mt-1">{orders.length} transaksi ditemukan</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#141414] border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  ID Transaksi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Item Pesanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Total Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Bukti Bayar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length > 0 ? (
                orders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#D9A441]">
                        {order.order_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{order.customer_name}</div>
                        <div className="text-xs text-zinc-400">{order.customer_phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-200">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                            {order.item_count} item
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                        Rp {Number(order.total_amount).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                          disabled={isPending}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${statusConfig.color} bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D9A441] disabled:opacity-50`}
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-[#2A2A2A] text-white">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.payment_proof ? (
                          <button
                            onClick={() => setLightboxImage(order.payment_proof)}
                            className="relative group"
                          >
                            <img
                              src={order.payment_proof}
                              alt="Bukti Bayar"
                              className="w-10 h-10 object-cover rounded border border-green-500/30 cursor-pointer hover:border-green-500 transition"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'inline-flex';
                              }}
                            />
                            <span className="hidden px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-xs font-medium">
                              Lihat Bukti
                            </span>
                          </button>
                        ) : (
                          <span className="px-2 py-1 bg-zinc-500/20 text-zinc-400 border border-zinc-500/30 rounded text-xs font-medium">
                            Belum Upload
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-400">
                        {new Date(order.created_at).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewDetail(order)}
                          className="px-3 py-1.5 bg-[#D9A441] hover:bg-[#b88933] text-[#141414] text-xs font-bold rounded-lg transition"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-400">
                      <svg className="w-12 h-12 mb-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm font-medium">Tidak ada transaksi</p>
                      <p className="text-xs mt-1">Belum ada data transaksi untuk periode ini</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {orders.length > 0 && (
          <div className="px-6 py-4 bg-[#141414] border-t border-white/10">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Total {orders.length} transaksi</span>
              <span className="text-white font-semibold">
                Total Pendapatan: Rp {summary.totalRevenue.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        )}
      </div>

      {selectedOrder && orderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:bg-white">
          <div className="bg-[#2A2A2A] border border-white/10 w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto print:max-w-full print:border-0 print:shadow-none">
            <div className="p-6 print:p-8">
              <div className="flex justify-between items-start mb-6 print:mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white print:text-black">Detail Transaksi</h2>
                  <p className="text-sm text-zinc-400 mt-1 print:text-gray-600">
                    {selectedOrder.order_id}
                  </p>
                </div>
                <div className="flex gap-2 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition"
                  >
                    Cetak
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(null);
                      setOrderDetails(null);
                    }}
                    className="px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white text-sm font-bold rounded-lg transition"
                  >
                    Tutup
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#141414] p-4 rounded-lg border border-white/5 print:bg-gray-50 print:border-gray-200">
                    <p className="text-xs text-zinc-400 mb-1 print:text-gray-600">Nama Pelanggan</p>
                    <p className="text-white font-medium print:text-black">{orderDetails.order.customer_name}</p>
                  </div>
                  <div className="bg-[#141414] p-4 rounded-lg border border-white/5 print:bg-gray-50 print:border-gray-200">
                    <p className="text-xs text-zinc-400 mb-1 print:text-gray-600">No. WhatsApp</p>
                    <p className="text-white font-medium print:text-black">{orderDetails.order.customer_phone}</p>
                  </div>
                  <div className="bg-[#141414] p-4 rounded-lg border border-white/5 print:bg-gray-50 print:border-gray-200">
                    <p className="text-xs text-zinc-400 mb-1 print:text-gray-600">Status</p>
                    <p className="text-white font-medium print:text-black">
                      {getStatusConfig(orderDetails.order.status).label}
                    </p>
                  </div>
                  <div className="bg-[#141414] p-4 rounded-lg border border-white/5 print:bg-gray-50 print:border-gray-200">
                    <p className="text-xs text-zinc-400 mb-1 print:text-gray-600">Waktu Transaksi</p>
                    <p className="text-white font-medium print:text-black">
                      {new Date(orderDetails.order.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                {orderDetails.order.note && orderDetails.order.note !== '-' && (
                  <div className="bg-[#141414] p-4 rounded-lg border border-white/5 print:bg-gray-50 print:border-gray-200">
                    <p className="text-xs text-zinc-400 mb-2 print:text-gray-600">Catatan</p>
                    <p className="text-white text-sm print:text-black">{orderDetails.order.note}</p>
                  </div>
                )}

                <div className="bg-[#141414] p-4 rounded-lg border border-white/5 print:bg-gray-50 print:border-gray-200">
                  <p className="text-sm font-bold text-white mb-3 print:text-black">Item Pesanan</p>
                  <div className="space-y-2">
                    {orderDetails.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 print:border-gray-200"
                      >
                        <div>
                          <p className="text-white font-medium text-sm print:text-black">{item.product_name}</p>
                          <p className="text-xs text-zinc-400 print:text-gray-600">
                            Ukuran: {item.size} | Qty: {item.quantity} x Rp {Number(item.price).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <p className="text-white font-semibold print:text-black">
                          Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {orderDetails.order.payment_proof && (
                  <div className="bg-[#141414] p-4 rounded-lg border border-white/5 print:bg-gray-50 print:border-gray-200">
                    <p className="text-sm font-bold text-white mb-3 print:text-black">Bukti Pembayaran</p>
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={orderDetails.order.payment_proof}
                        alt="Bukti Pembayaran"
                        className="max-w-full h-auto max-h-96 rounded-lg border border-white/10 cursor-pointer hover:opacity-80 transition"
                        onClick={() => setLightboxImage(orderDetails.order.payment_proof)}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <p className="hidden text-sm text-red-400">
                        Gagal memuat gambar bukti pembayaran
                      </p>
                      <a
                        href={orderDetails.order.payment_proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition print:hidden"
                      >
                        Buka di Tab Baru
                      </a>
                    </div>
                  </div>
                )}

                <div className="bg-[#D9A441] p-4 rounded-lg print:bg-yellow-50 print:border print:border-yellow-200">
                  <div className="flex justify-between items-center">
                    <p className="text-[#141414] font-bold text-lg print:text-black">Total Pembayaran</p>
                    <p className="text-[#141414] font-bold text-2xl print:text-black">
                      Rp {Number(orderDetails.order.total_amount).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {lightboxImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition z-10"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={lightboxImage}
              alt="Bukti Pembayaran"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <p className="hidden text-white text-center">
              Gagal memuat gambar
            </p>
          </div>
        </div>
      )}
    </>
  );
}
