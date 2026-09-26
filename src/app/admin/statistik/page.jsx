// src/app/admin/statistik/page.jsx
import { db } from '@/library/db';
import PeriodFilter from '@/components/PeriodFilter';
import CategoryFilter from '@/components/CategoryFilter';
import StatisticsCharts from './StatisticsCharts';

export const revalidate = 0;

export default async function StatisticsPage({ searchParams }) {
  const params = await searchParams;
  const period = params?.period || 'all';
  const startDate = params?.start || '';
  const endDate = params?.end || '';
  const category = params?.category || 'all';

  let summary = {
    totalRevenue: 0,
    totalOrders: 0,
    periodLabel: 'Semua Waktu'
  };

  let topProducts = [];
  let dailySales = [];
  let categories = [];

  try {
    const [categoryRows] = await db.query('SELECT id, name FROM categories ORDER BY name ASC');
    if (categoryRows) {
      categories = categoryRows;
    }
  } catch (error) {
    console.error('Gagal mengambil data kategori:', error);
  }

  try {
    let baseQuery = 'FROM orders o LEFT JOIN order_items oi ON o.order_id = oi.order_id LEFT JOIN products p ON oi.product_id = p.id';
    let whereClause = '';
    const conditions = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (category && category !== 'all') {
      conditions.push(`p.category_id = ${category}`);
    }

    if (period === 'year') {
      conditions.push(`YEAR(o.created_at) = ${currentYear}`);
      summary.periodLabel = `Tahun ${currentYear}`;
    } else if (period === 'month') {
      conditions.push(`YEAR(o.created_at) = ${currentYear} AND MONTH(o.created_at) = ${currentMonth}`);
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      summary.periodLabel = `${monthNames[currentMonth - 1]} ${currentYear}`;
    } else if (period === 'week') {
      conditions.push(`o.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);
      summary.periodLabel = '7 Hari Terakhir';
    } else if (period === 'today') {
      conditions.push(`DATE(o.created_at) = CURDATE()`);
      summary.periodLabel = 'Hari Ini';
    } else if (period === 'yesterday') {
      conditions.push(`DATE(o.created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`);
      summary.periodLabel = 'Kemarin';
    } else if (period === 'custom' && startDate && endDate) {
      conditions.push(`DATE(o.created_at) BETWEEN '${startDate}' AND '${endDate}'`);
      summary.periodLabel = `${startDate} s/d ${endDate}`;
    }

    if (conditions.length > 0) {
      whereClause = ' WHERE ' + conditions.join(' AND ');
    }

    const [summaryRows] = await db.query(`
      SELECT
        COUNT(DISTINCT o.id) as totalOrders,
        COALESCE(SUM(o.total_amount), 0) as totalRevenue
      ${baseQuery}
      ${whereClause}
    `);

    if (summaryRows && summaryRows[0]) {
      summary.totalOrders = summaryRows[0].totalOrders;
      summary.totalRevenue = Number(summaryRows[0].totalRevenue);
    }

    const [topProductsRows] = await db.query(`
      SELECT
        oi.product_name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price) as total_revenue
      ${baseQuery}
      ${whereClause}
      GROUP BY oi.product_name
      ORDER BY total_sold DESC
      LIMIT 10
    `);

    if (topProductsRows) {
      topProducts = topProductsRows.map(row => ({
        name: row.product_name,
        count: Number(row.total_sold) || 0,
        revenue: Number(row.total_revenue) || 0
      }));
    }

    const [dailySalesRows] = await db.query(`
      SELECT
        DATE(o.created_at) as sale_date,
        COUNT(DISTINCT o.id) as order_count,
        SUM(o.total_amount) as daily_revenue
      ${baseQuery}
      ${whereClause}
      GROUP BY DATE(o.created_at)
      ORDER BY sale_date ASC
      LIMIT 90
    `);

    if (dailySalesRows) {
      dailySales = dailySalesRows.map(row => ({
        date: row.sale_date,
        count: row.order_count,
        revenue: Number(row.daily_revenue)
      }));
    }

  } catch (error) {
    console.error('Gagal mengambil data statistik:', error);
  }

  return (
    <div className="bg-[#141414] min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-[#2A2A2A] rounded-lg border border-white/10 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Statistik Penjualan
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Visualisasi data penjualan dalam bentuk diagram
              </p>
            </div>
          </div>
        </div>

        {/* FILTER */}
        <div className="bg-[#2A2A2A] rounded-lg border border-white/10 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">

            {/* Filter Kategori */}
            <div className="w-full lg:w-auto">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Filter Kategori
              </label>
              <CategoryFilter
                category={category}
                categories={categories}
                currentParams={{ period, start: startDate, end: endDate }}
              />
            </div>

            {/* Filter Periode */}
            <div className="w-full lg:w-auto">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Filter Periode
              </label>
              <PeriodFilter period={period} />
            </div>

            {/* Custom Range */}
            <div className="w-full lg:w-auto">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Custom Range
              </label>
              <form method="get" className="flex gap-2">
                <input
                  type="date"
                  name="start"
                  defaultValue={startDate}
                  className="px-3 py-2 bg-[#141414] text-white border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
                />
                <input
                  type="date"
                  name="end"
                  defaultValue={endDate}
                  className="px-3 py-2 bg-[#141414] text-white border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
                />
                <input type="hidden" name="period" value="custom" />
                {category !== 'all' && <input type="hidden" name="category" value={category} />}
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D9A441] hover:bg-[#b88933] text-[#141414] text-sm font-bold rounded-lg transition"
                >
                  Filter
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* SUMMARY STATS */}
        <div className="bg-[#2A2A2A] rounded-lg border border-white/10 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Ringkasan
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Periode: {summary.periodLabel}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#141414] p-5 rounded-lg border border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-400 font-medium mb-1">
                    Total Transaksi
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {summary.totalOrders}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-[#141414] p-5 rounded-lg border border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-400 font-medium mb-1">
                    Total Pendapatan
                  </p>
                  <p className="text-3xl font-bold text-white">
                    Rp {summary.totalRevenue.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHARTS */}
        <StatisticsCharts
          topProducts={topProducts}
          dailySales={dailySales}
          totalOrders={summary.totalOrders}
        />

      </div>
    </div>
  );
}
