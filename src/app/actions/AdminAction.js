'use server';

import { db } from '@/library/db';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId, newStatus) {
  try {
    await db.query(
      'UPDATE orders SET status = ? WHERE order_id = ?',
      [newStatus, orderId]
    );

    revalidatePath('/admin');

    return {
      success: true,
      message: 'Status berhasil diperbarui'
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      message: 'Gagal memperbarui status'
    };
  }
}

export async function getOrderDetails(orderId) {
  try {
    const [orderRows] = await db.query(
      `SELECT * FROM orders WHERE order_id = ?`,
      [orderId]
    );

    if (!orderRows || orderRows.length === 0) {
      return { success: false, message: 'Pesanan tidak ditemukan' };
    }

    const [itemRows] = await db.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    return {
      success: true,
      order: orderRows[0],
      items: itemRows || []
    };
  } catch (error) {
    console.error('Error fetching order details:', error);
    return {
      success: false,
      message: 'Gagal mengambil detail pesanan'
    };
  }
}
