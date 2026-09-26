'use server';

import { db } from '@/library/db';

export async function createOrderAction(formData) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const customerName = formData.get('customerName');
    const customerPhone = formData.get('customerPhone');
    const note = formData.get('note') || '-';
    const totalAmount = parseInt(formData.get('totalPrice'), 10) || 0;
    const cartItemsJson = formData.get('cartItems');

    if (!cartItemsJson) {
      throw new Error('Cart items are required');
    }

    const cartItems = JSON.parse(cartItemsJson);

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('Cart must contain at least one item');
    }

    const duplicateCheck = `
      SELECT order_id, customer_name, customer_phone, total_amount, created_at
      FROM orders
      WHERE customer_phone = ?
        AND total_amount = ?
        AND created_at >= DATE_SUB(NOW(), INTERVAL 10 SECOND)
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const [existingOrders] = await connection.query(duplicateCheck, [
      customerPhone,
      totalAmount
    ]);

    if (existingOrders && existingOrders.length > 0) {
      const existing = existingOrders[0];
      await connection.commit();

      console.log('Duplicate order prevented:', existing.order_id);

      return {
        success: true,
        data: {
          orderId: existing.order_id,
          customerName: existing.customer_name,
          customerPhone: existing.customer_phone,
          totalAmount: existing.total_amount,
          status: 'Menunggu Konfirmasi',
        },
      };
    }

    // Check stock availability for all items with row locking
    for (const item of cartItems) {
      const [stockRows] = await connection.query(
        `SELECT stock FROM product_variants
         WHERE product_id = ? AND size = ?
         FOR UPDATE`,
        [item.id, item.size]
      );

      if (!stockRows || stockRows.length === 0) {
        throw new Error(`Varian produk ${item.name} ukuran ${item.size} tidak ditemukan`);
      }

      const availableStock = stockRows[0].stock;

      if (availableStock < item.qty) {
        throw new Error(
          `Stok untuk produk ${item.name} ukuran ${item.size} tidak mencukupi (Tersisa: ${availableStock})`
        );
      }
    }

    const orderId = `ORD-BTK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const insertOrderQuery = `
      INSERT INTO orders (order_id, customer_name, customer_phone, note, total_amount, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;

    await connection.query(insertOrderQuery, [
      orderId,
      customerName,
      customerPhone,
      note,
      totalAmount,
    ]);

    const insertItemQuery = `
      INSERT INTO order_items (order_id, product_id, product_name, size, quantity, price)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (const item of cartItems) {
      await connection.query(insertItemQuery, [
        orderId,
        item.id,
        item.name,
        item.size,
        item.qty,
        item.price,
      ]);

      // Deduct stock from product_variants
      await connection.query(
        `UPDATE product_variants
         SET stock = stock - ?
         WHERE product_id = ? AND size = ?`,
        [item.qty, item.id, item.size]
      );
    }

    await connection.commit();

    return {
      success: true,
      data: {
        orderId,
        customerName,
        customerPhone,
        totalAmount,
        itemCount: cartItems.length,
        status: 'Menunggu Konfirmasi',
      },
    };
  } catch (error) {
    await connection.rollback();
    console.error('Database Order Error:', error);
    return {
      success: false,
      message: 'Gagal menyimpan pesanan ke database MySQL.'
    };
  } finally {
    connection.release();
  }
}