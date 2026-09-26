'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';

const STATUS_CONFIG = {
  pending: { label: 'Menunggu', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  processing: { label: 'Diproses', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  completed: { label: 'Selesai', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
};

const BANK_INFO = {
  bankName: 'Bank BCA',
  accountNumber: '1234567890',
  accountName: 'Griya Batik'
};

export default function OrderDetailModal({ order, onClose }) {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  const paymentInfo = `Bank: ${BANK_INFO.bankName}
Rekening: ${BANK_INFO.accountNumber}
A/N: ${BANK_INFO.accountName}
Jumlah: Rp ${Number(order.total_amount).toLocaleString('id-ID')}
ID Pesanan: ${order.order_id}`;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('File harus berupa gambar');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Ukuran file maksimal 5MB');
        return;
      }
      setSelectedFile(file);
      setUploadError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Pilih file terlebih dahulu');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('order_id', order.order_id);

      const response = await fetch('/api/orders/upload-payment', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setUploadSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setUploadError(data.message || 'Gagal mengupload bukti pembayaran');
      }
    } catch (error) {
      setUploadError('Terjadi kesalahan saat mengupload');
    } finally {
      setUploading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto print:bg-white print:block print:relative print:z-auto">
      <div className="bg-[#2A2A2A] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl print:max-w-full print:border-0 print:shadow-none print:max-h-none print:bg-white">
        <div className="sticky top-0 bg-[#2A2A2A] border-b border-white/10 p-6 flex items-center justify-between z-10 print:bg-white print:border-gray-200">
          <h2 className="text-2xl font-bold text-white print:text-black">Detail Pesanan</h2>
          <div className="flex gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition"
            >
              Cetak
            </button>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-[#141414] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400 mb-1">ID Pesanan</p>
                <p className="text-[#D9A441] font-mono font-bold text-sm">
                  {order.order_id}
                </p>
              </div>
              <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
              <div>
                <p className="text-xs text-zinc-400 mb-1">Nama Pelanggan</p>
                <p className="text-white font-medium text-sm">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 mb-1">No. WhatsApp</p>
                <p className="text-white font-medium text-sm">{order.customer_phone}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 mb-1">Tanggal Order</p>
                <p className="text-white font-medium text-sm">
                  {new Date(order.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 mb-1">Total Pembayaran</p>
                <p className="text-[#D9A441] font-bold text-lg">
                  Rp {Number(order.total_amount).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-3">Item Pesanan</h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-[#141414] p-3 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{item.product_name}</p>
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
            <div className="bg-[#141414] rounded-lg p-4">
              <p className="text-xs text-zinc-400 mb-1">Catatan</p>
              <p className="text-white text-sm">{order.note}</p>
            </div>
          )}

          {order.payment_proof && (
            <div className="bg-[#141414] rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Bukti Pembayaran</h3>
              <div className="flex flex-col items-center gap-3">
                <img
                  src={order.payment_proof}
                  alt="Bukti Pembayaran"
                  className="max-w-full h-auto max-h-80 rounded-lg border border-white/10 cursor-pointer hover:opacity-80 transition"
                  onClick={() => setLightboxImage(order.payment_proof)}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <p className="hidden text-sm text-red-400">
                  Gagal memuat gambar bukti pembayaran
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLightboxImage(order.payment_proof)}
                    className="px-4 py-2 bg-[#D9A441] hover:bg-[#b88933] text-[#141414] text-xs font-bold rounded-lg transition"
                  >
                    Perbesar Gambar
                  </button>
                  <a
                    href={order.payment_proof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition"
                  >
                    Buka di Tab Baru
                  </a>
                </div>
                {order.status === 'pending' && (
                  <p className="text-xs text-zinc-400 text-center">
                    Bukti pembayaran Anda sedang diverifikasi oleh admin
                  </p>
                )}
                {order.status === 'processing' && (
                  <p className="text-xs text-green-400 text-center">
                    ✓ Pembayaran telah diverifikasi, pesanan sedang diproses
                  </p>
                )}
              </div>
            </div>
          )}

          {order.status === 'pending' && (
            <>
              <div className="bg-[#141414] rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white">Informasi Pembayaran</h3>

                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCode value={paymentInfo} size={200} />
                  </div>

                  <div className="w-full space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Bank</span>
                      <span className="text-white font-medium">{BANK_INFO.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">No. Rekening</span>
                      <span className="text-white font-medium font-mono">{BANK_INFO.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Atas Nama</span>
                      <span className="text-white font-medium">{BANK_INFO.accountName}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/10">
                      <span className="text-zinc-400">Total Transfer</span>
                      <span className="text-[#D9A441] font-bold">
                        Rp {Number(order.total_amount).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 text-center">
                    Scan QR code atau catat informasi rekening di atas untuk melakukan pembayaran
                  </p>
                </div>
              </div>

              <div className="bg-[#141414] rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white">Upload Bukti Pembayaran</h3>

                {uploadSuccess ? (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                    <svg className="w-12 h-12 text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-400 font-medium">Bukti pembayaran berhasil diupload!</p>
                    <p className="text-xs text-zinc-400 mt-1">Pesanan Anda akan segera diproses</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 bg-[#2A2A2A] text-white border border-white/10 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#D9A441] file:text-[#141414] file:font-bold hover:file:bg-[#b88933] file:cursor-pointer cursor-pointer"
                    />

                    {selectedFile && (
                      <p className="text-xs text-zinc-400">
                        File terpilih: {selectedFile.name}
                      </p>
                    )}

                    {uploadError && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                        <p className="text-red-400 text-sm">{uploadError}</p>
                      </div>
                    )}

                    <button
                      onClick={handleUpload}
                      disabled={uploading || !selectedFile}
                      className="w-full py-3 bg-[#D9A441] hover:bg-[#b88933] text-[#141414] font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? 'Mengupload...' : 'Upload Bukti Pembayaran'}
                    </button>

                    <p className="text-xs text-zinc-500 text-center">
                      Format: JPG, PNG, JPEG (Max. 5MB)
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

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
    </div>
  );
}
