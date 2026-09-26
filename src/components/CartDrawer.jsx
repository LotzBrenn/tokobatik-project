// src/components/CartDrawer.jsx
'use client';

import { useState, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { createOrderAction } from '@/app/actions/OrderAction';

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    setIsOpen,
    updateItemSize,
    updateItemQty,
    removeFromCart,
    clearCart
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const isSubmittingRef = useRef(false);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (!isOpen) return null;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    formData.append('cartItems', JSON.stringify(cart));
    formData.append('totalPrice', totalPrice.toString());

    try {
      const result = await createOrderAction(formData);

      if (result.success) {
        setSuccessData(result.data);
      } else {
        alert(result.message || 'Gagal memproses transaksi.');
        isSubmittingRef.current = false;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Terjadi kesalahan saat memproses pesanan.');
      isSubmittingRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDrawer = () => {
    if (loading) return;
    setIsOpen(false);
    setSuccessData(null);
    isSubmittingRef.current = false;
    if (successData) {
      clearCart();
    }
  };

  const isSubmitting = loading;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop Hitam */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={handleCloseDrawer}
      />

      {/* Panel Drawer Sisi Kanan */}
      <div className="relative w-full max-w-md bg-[#1A1A1A] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl z-10 text-white p-6 overflow-y-auto">
        
        {/* Header Drawer */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="text-lg font-bold text-[#D9A441] flex items-center gap-2">
            <span>🛒</span> Keranjang Belanja
          </h2>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleCloseDrawer}
            className="text-zinc-400 hover:text-white text-xl font-bold p-1 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* TAMPILAN JIKA TRANSAKSI SUKSES */}
        {successData ? (
          <div className="my-auto text-center space-y-4 bg-[#2A2A2A] p-6 rounded-2xl border border-[#D9A441]/30">
            <div className="w-12 h-12 bg-[#D9A441]/20 text-[#D9A441] rounded-full flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <h3 className="text-xl font-bold text-white">Pesanan Berhasil!</h3>
            <p className="text-xs text-zinc-400">
              ID Transaksi: <b className="text-[#D9A441] font-mono">{successData.orderId}</b>
            </p>
            <div className="text-left text-xs bg-[#141414] p-4 rounded-xl space-y-1.5 border border-white/5">
              <p><span className="text-zinc-400">Pemesan:</span> {successData.customerName}</p>
              <p><span className="text-zinc-400">No HP:</span> {successData.customerPhone}</p>
              <p><span className="text-zinc-400">Jumlah Item:</span> {successData.itemCount} item</p>
              <p><span className="text-zinc-400">Total:</span> <b className="text-emerald-400">Rp {Number(successData.totalAmount).toLocaleString('id-ID')}</b></p>
            </div>
            <button
              type="button"
              onClick={handleCloseDrawer}
              className="w-full py-3 bg-[#D9A441] text-[#141414] font-bold rounded-xl text-xs hover:bg-amber-400 transition"
            >
              Selesai & Kembali Belanja
            </button>
          </div>
        ) : cart.length === 0 ? (
          /* TAMPILAN KERANJANG KOSONG */
          <div className="my-auto text-center space-y-3 py-12">
            <p className="text-4xl">🛍️</p>
            <p className="text-zinc-400 text-sm">Keranjang belanja Anda masih kosong.</p>
          </div>
        ) : (
          /* TAMPILAN LIST ITEM & FORM CHECKOUT */
          <>
            {/* List Produk */}
            <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="bg-[#2A2A2A] p-3 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => removeFromCart(idx)}
                      className="text-[10px] text-rose-400 hover:text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded disabled:opacity-50"
                    >
                      Hapus
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    {/* Selector Ukuran */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-zinc-400">Ukuran:</span>
                      <select
                        disabled={isSubmitting}
                        value={item.size}
                        onChange={(e) => updateItemSize(idx, e.target.value)}
                        className="bg-[#141414] border border-white/10 text-[#D9A441] font-bold text-xs rounded px-1.5 py-0.5 focus:outline-none focus:border-[#D9A441] disabled:opacity-50"
                      >
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </select>
                    </div>

                    {/* Selector Jumlah (Qty) */}
                    <div className="flex items-center gap-2 border border-white/10 bg-[#141414] rounded-lg px-2 py-0.5">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => updateItemQty(idx, item.qty - 1)}
                        className="text-zinc-400 hover:text-white font-bold disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-white">{item.qty}</span>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => updateItemQty(idx, item.qty + 1)}
                        className="text-zinc-400 hover:text-white font-bold disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right text-xs font-semibold text-emerald-400">
                    Rp {(item.price * item.qty).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>

            {/* Form Checkout & Pemesanan */}
            <form onSubmit={handleCheckoutSubmit} className="border-t border-white/10 pt-4 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-zinc-300 font-medium">Nama Lengkap *</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  disabled={isSubmitting}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-[#141414] border border-white/10 p-2.5 rounded-xl text-white focus:outline-none focus:border-[#D9A441] disabled:opacity-50"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-300 font-medium">Nomor WhatsApp / HP *</label>
                <input
                  type="tel"
                  name="customerPhone"
                  required
                  disabled={isSubmitting}
                  placeholder="081234567890"
                  className="w-full bg-[#141414] border border-white/10 p-2.5 rounded-xl text-white focus:outline-none focus:border-[#D9A441] disabled:opacity-50"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-300 font-medium">Catatan Khusus (Opsional)</label>
                <textarea
                  name="note"
                  rows="2"
                  disabled={isSubmitting}
                  placeholder="Contoh: Minta dikirim kemeja lengan panjang"
                  className="w-full bg-[#141414] border border-white/10 p-2.5 rounded-xl text-white focus:outline-none focus:border-[#D9A441] disabled:opacity-50"
                ></textarea>
              </div>

              {/* Total & Submit */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-zinc-400 font-semibold">Total Pembayaran:</span>
                  <span className="text-base font-extrabold text-emerald-400">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#D9A441] hover:bg-[#b88933] text-[#141414] font-bold rounded-xl transition text-sm shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Memproses Transaksi...' : 'Proses Transaksi →'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}