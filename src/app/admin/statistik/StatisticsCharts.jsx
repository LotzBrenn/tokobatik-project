'use client';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';

const COLORS = [
  '#D9A441',
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
  '#06B6D4',
  '#84CC16'
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#2A2A2A] border border-white/20 rounded-lg p-3 shadow-lg">
        <p className="text-white text-sm font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString('id-ID') : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#2A2A2A] border border-white/20 rounded-lg p-3 shadow-lg">
        <p className="text-white text-sm font-medium mb-1">{data.name}</p>
        <p className="text-xs text-zinc-300">
          Terjual: {data.value} unit
        </p>
        <p className="text-xs text-zinc-300">
          Persentase: {data.payload.percentage}%
        </p>
        <p className="text-xs text-zinc-300">
          Pendapatan: Rp {data.payload.revenue.toLocaleString('id-ID')}
        </p>
      </div>
    );
  }
  return null;
};

export default function StatisticsCharts({ topProducts, dailySales, totalOrders }) {
  const totalProductsSold = topProducts.reduce((sum, product) => sum + product.count, 0);

  const pieData = topProducts.map((product, index) => ({
    name: product.name,
    value: product.count,
    revenue: product.revenue,
    percentage: totalProductsSold > 0 ? ((product.count / totalProductsSold) * 100).toFixed(1) : '0'
  }));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
  };

  const dailyChartData = dailySales.map(sale => ({
    date: formatDate(sale.date),
    'Jumlah Transaksi': sale.count,
    'Pendapatan': sale.revenue
  }));

  return (
    <div className="space-y-6">

      {/* BEST SELLING PRODUCTS - PIE CHART */}
      <div className="bg-[#2A2A2A] rounded-lg border border-white/10 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">
            Produk Terlaris
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Persentase produk berdasarkan jumlah transaksi
          </p>
        </div>

        {pieData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${(entry.percent * 100).toFixed(1)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend & Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white mb-4">Detail Produk</h3>
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                {pieData.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[#141414] rounded-lg border border-white/5 hover:border-white/10 transition"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {product.value} transaksi ({product.percentage}%)
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-sm text-green-400 font-semibold">
                        Rp {product.revenue.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
            <svg className="w-16 h-16 mb-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm font-medium">Tidak ada data produk</p>
            <p className="text-xs mt-1">Belum ada transaksi untuk periode ini</p>
          </div>
        )}
      </div>

      {/* DAILY SALES - BAR CHART */}
      <div className="bg-[#2A2A2A] rounded-lg border border-white/10 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">
            Penjualan Harian
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Grafik jumlah transaksi dan pendapatan per hari
          </p>
        </div>

        {dailyChartData.length > 0 ? (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dailyChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  label={{ value: 'Jumlah Transaksi', angle: -90, position: 'insideLeft', fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  label={{ value: 'Pendapatan (Rp)', angle: 90, position: 'insideRight', fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="rect"
                />
                <Bar
                  yAxisId="left"
                  dataKey="Jumlah Transaksi"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="Pendapatan"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
            <svg className="w-16 h-16 mb-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <p className="text-sm font-medium">Tidak ada data penjualan</p>
            <p className="text-xs mt-1">Belum ada transaksi untuk periode ini</p>
          </div>
        )}
      </div>

      {/* DAILY SALES TREND - LINE CHART */}
      <div className="bg-[#2A2A2A] rounded-lg border border-white/10 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">
            Tren Penjualan
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Tren jumlah transaksi harian
          </p>
        </div>

        {dailyChartData.length > 0 ? (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  label={{ value: 'Jumlah Transaksi', angle: -90, position: 'insideLeft', fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="Jumlah Transaksi"
                  stroke="#D9A441"
                  strokeWidth={2}
                  dot={{ fill: '#D9A441', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
            <svg className="w-16 h-16 mb-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <p className="text-sm font-medium">Tidak ada data tren</p>
            <p className="text-xs mt-1">Belum ada transaksi untuk periode ini</p>
          </div>
        )}
      </div>

    </div>
  );
}
