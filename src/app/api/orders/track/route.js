import { db } from '@/library/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone_number, order_id } = body;

    if (!phone_number) {
      return NextResponse.json(
        { success: false, message: 'Nomor telepon harus diisi' },
        { status: 400 }
      );
    }

    let query = `
      SELECT
        o.id,
        o.order_id,
        o.customer_name,
        o.customer_phone,
        o.note,
        o.total_amount,
        o.status,
        o.created_at
      FROM orders o
      WHERE o.customer_phone = ?
    `;

    const params = [phone_number];

    if (order_id) {
      query += ' AND o.order_id = ?';
      params.push(order_id);
    }

    query += ' ORDER BY o.created_at DESC';

    const [orderRows] = await db.query(query, params);

    if (!orderRows || orderRows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Tidak ditemukan pesanan dengan nomor telepon tersebut'
      });
    }

    const ordersWithItems = await Promise.all(
      orderRows.map(async (order) => {
        const [itemRows] = await db.query(
          `SELECT
            id,
            product_id,
            product_name,
            size,
            quantity,
            price
          FROM order_items
          WHERE order_id = ?`,
          [order.order_id]
        );

        return {
          ...order,
          items: itemRows || []
        };
      })
    );

    return NextResponse.json({
      success: true,
      orders: ordersWithItems
    });

  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data pesanan' },
      { status: 500 }
    );
  }
}
