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
        o.id,
        o.order_id,
        o.customer_name,
        o.customer_phone,
        o.note,
        o.total_amount,
        o.created_at,
        GROUP_CONCAT(CONCAT(oi.product_name, ' (', oi.size, ') x', oi.quantity) SEPARATOR ', ') as items_summary,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
    `;
    let whereClause = '';
    let periodLabel = 'Semua Waktu';
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (period === 'year') {
      whereClause = ` WHERE YEAR(o.created_at) = ${currentYear}`;
      periodLabel = `Tahun ${currentYear}`;
    } else if (period === 'month') {
      whereClause = ` WHERE YEAR(o.created_at) = ${currentYear} AND MONTH(o.created_at) = ${currentMonth}`;
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      periodLabel = `${monthNames[currentMonth - 1]} ${currentYear}`;
    } else if (period === 'week') {
      whereClause = ` WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`;
      periodLabel = '7 Hari Terakhir';
    } else if (period === 'today') {
      whereClause = ` WHERE DATE(o.created_at) = CURDATE()`;
      periodLabel = 'Hari Ini';
    } else if (period === 'yesterday') {
      whereClause = ` WHERE DATE(o.created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`;
      periodLabel = 'Kemarin';
    } else if (period === 'custom' && startDate && endDate) {
      whereClause = ` WHERE DATE(o.created_at) BETWEEN '${startDate}' AND '${endDate}'`;
      periodLabel = `${startDate} s/d ${endDate}`;
    }

    query += whereClause + ' GROUP BY o.id ORDER BY o.created_at DESC';

    const [rows] = await db.query(query);
    const orders = rows || [];

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
    const totalOrders = orders.length;

    const html = generatePrintableHTML(orders, periodLabel, totalOrders, totalRevenue);

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Gagal membuat laporan PDF' },
      { status: 500 }
    );
  }
}

function generatePrintableHTML(orders, periodLabel, totalOrders, totalRevenue) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Laporan Penjualan - ${periodLabel}</title>
  <style>
    @media print {
      @page {
        size: A4 landscape;
        margin: 1cm;
      }
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print {
        display: none;
      }
    }

    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: white;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }

    .header p {
      margin: 5px 0;
      color: #666;
      font-size: 14px;
    }

    .summary {
      display: flex;
      justify-content: space-around;
      margin-bottom: 30px;
      gap: 20px;
    }

    .summary-box {
      flex: 1;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      text-align: center;
    }

    .summary-box h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #666;
      font-weight: normal;
    }

    .summary-box p {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
      font-size: 12px;
    }

    th {
      background-color: #f5f5f5;
      font-weight: bold;
      color: #333;
    }

    tr:nth-child(even) {
      background-color: #fafafa;
    }

    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #333;
      text-align: right;
    }

    .footer-total {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      background-color: #333;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
    }

    .print-button:hover {
      background-color: #555;
    }
  </style>
</head>
<body>
  <button class="print-button no-print" onclick="window.print()">Cetak / Simpan PDF</button>

  <div class="header">
    <h1>LAPORAN PENJUALAN BATIK</h1>
    <p>Periode: ${periodLabel}</p>
    <p>Dicetak pada: ${currentDate}</p>
  </div>

  <div class="summary">
    <div class="summary-box">
      <h3>Total Transaksi</h3>
      <p>${totalOrders}</p>
    </div>
    <div class="summary-box">
      <h3>Total Pendapatan</h3>
      <p>Rp ${totalRevenue.toLocaleString('id-ID')}</p>
    </div>
    <div class="summary-box">
      <h3>Rata-rata per Transaksi</h3>
      <p>Rp ${totalOrders > 0 ? Math.round(totalRevenue / totalOrders).toLocaleString('id-ID') : '0'}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>No</th>
        <th>ID Transaksi</th>
        <th>Pelanggan</th>
        <th>No. WhatsApp</th>
        <th>Item Pesanan</th>
        <th>Total Harga</th>
        <th>Waktu Transaksi</th>
      </tr>
    </thead>
    <tbody>
      ${orders.length > 0 ? orders.map((order, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${order.order_id}</td>
          <td>${order.customer_name}</td>
          <td>${order.customer_phone}</td>
          <td>${order.item_count} item: ${order.items_summary}</td>
          <td>Rp ${Number(order.total_amount).toLocaleString('id-ID')}</td>
          <td>${new Date(order.created_at).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</td>
        </tr>
      `).join('') : `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px;">
            Tidak ada data transaksi untuk periode ini
          </td>
        </tr>
      `}
    </tbody>
  </table>

  <div class="footer">
    <div class="footer-total">
      Total Pendapatan: Rp ${totalRevenue.toLocaleString('id-ID')}
    </div>
    <p style="font-size: 12px; color: #666;">
      Laporan ini digenerate secara otomatis oleh Sistem Toko Batik
    </p>
  </div>
</body>
</html>`;
}
