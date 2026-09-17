'use server';

import { db } from '@/library/db';

export async function createOrderAction(formData) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const customerName = formData.get('customerName');
    const customerPhone = formData.get('customerPhone');
    const productName = formData.get('productName');
    const size = formData.get('size') || '-';
    const note = formData.get('note') || '-';
    const totalPrice = parseInt(formData.get('totalPrice'), 10) || 0;

    const duplicateCheck = `
      SELECT order_id, customer_name, customer_phone, product_name, total_price, created_at
      FROM orders
      WHERE customer_phone = ?
        AND product_name = ?
        AND total_price = ?
        AND created_at >= DATE_SUB(NOW(), INTERVAL 10 SECOND)
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const [existingOrders] = await connection.query(duplicateCheck, [
      customerPhone,
      productName,
      totalPrice
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
          productName: existing.product_name,
          size,
          note,
          totalPrice: existing.total_price,
          status: 'Menunggu Konfirmasi',
        },
      };
    }

    const orderId = `ORD-BTK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const insertQuery = `
      INSERT INTO orders (order_id, customer_name, customer_phone, product_name, size, note, total_price)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await connection.query(insertQuery, [
      orderId,
      customerName,
      customerPhone,
      productName,
      size,
      note,
      totalPrice,
    ]);

    await connection.commit();

    return {
      success: true,
      data: {
        orderId,
        customerName,
        customerPhone,
        productName,
        size,
        note,
        totalPrice,
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