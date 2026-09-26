'use client';

export default function PeriodFilter({ period }) {
  return (
    <select
      onChange={(e) => {
        if (e.target.value === 'custom') return;
        const currentPath = window.location.pathname;
        window.location.href = e.target.value === 'all' ? currentPath : `${currentPath}?period=${e.target.value}`;
      }}
      value={period}
      className="px-4 py-2 bg-[#141414] text-white border border-white/10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D9A441] hover:border-[#D9A441]/50 transition min-w-[200px]"
    >
      <option value="all">Semua Waktu</option>
      <option value="today">Hari Ini</option>
      <option value="yesterday">Kemarin</option>
      <option value="week">7 Hari Terakhir</option>
      <option value="month">Bulan Ini</option>
      <option value="year">Tahun Ini</option>
      <option value="custom" disabled>Custom Range →</option>
    </select>
  );
}
