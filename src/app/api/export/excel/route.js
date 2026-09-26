import { db } from '@/library/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all';
    const startDate = searchParams.get('start') || '';
    const endDate = searchParams.get('end') || '';

    let query = `
      SELECT
        o.order_id,
        o.customer_name,
        o.customer_phone,
        o.note,
        o.total_amount,
        o.created_at,
        oi.product_name,
        oi.size,
        oi.quantity,
        oi.price
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
    `;
    let whereClause = '';
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (period === 'year') {
      whereClause = ` WHERE YEAR(o.created_at) = ${currentYear}`;
    } else if (period === 'month') {
      whereClause = ` WHERE YEAR(o.created_at) = ${currentYear} AND MONTH(o.created_at) = ${currentMonth}`;
    } else if (period === 'week') {
      whereClause = ` WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`;
    } else if (period === 'today') {
      whereClause = ` WHERE DATE(o.created_at) = CURDATE()`;
    } else if (period === 'yesterday') {
      whereClause = ` WHERE DATE(o.created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`;
    } else if (period === 'custom' && startDate && endDate) {
      whereClause = ` WHERE DATE(o.created_at) BETWEEN '${startDate}' AND '${endDate}'`;
    }

    query += whereClause + ' ORDER BY o.created_at DESC, oi.id ASC';

    const [rows] = await db.query(query);
    const orderItems = rows || [];

    const csv = generateCSV(orderItems);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="laporan-penjualan-${period}-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error generating CSV:', error);
    return NextResponse.json(
      { error: 'Gagal membuat file Excel' },
      { status: 500 }
    );
  }
}

function generateCSV(orderItems) {
  const headers = [
    'ID Transaksi',
    'Nama Pelanggan',
    'No. WhatsApp',
    'Produk',
    'Ukuran',
    'Quantity',
    'Harga Satuan',
    'Subtotal',
    'Catatan',
    'Waktu Transaksi'
  ];

  const uniqueOrders = new Set();
  let totalRevenue = 0;

  let csv = '﻿';
  csv += headers.join(',') + '\n';

  orderItems.forEach(item => {
    uniqueOrders.add(item.order_id);
    const subtotal = Number(item.quantity) * Number(item.price);
    totalRevenue += subtotal;

    const row = [
      `"${item.order_id}"`,
      `"${item.customer_name}"`,
      `"${item.customer_phone}"`,
      `"${item.product_name}"`,
      `"${item.size}"`,
      `"${item.quantity}"`,
      `"${Number(item.price)}"`,
      `"${subtotal}"`,
      `"${item.note || '-'}"`,
      `"${new Date(item.created_at).toLocaleString('id-ID')}"`
    ];
    csv += row.join(',') + '\n';
  });

  csv += '\n';
  csv += `"TOTAL TRANSAKSI","${uniqueOrders.size}"\n`;
  csv += `"TOTAL ITEM","${orderItems.length}"\n`;
  csv += `"TOTAL PENDAPATAN","${totalRevenue}"\n`;

  return csv;
}
