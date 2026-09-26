'use client';

export default function CategoryFilter({ category, categories, currentParams }) {
  return (
    <select
      onChange={(e) => {
        const params = new URLSearchParams(currentParams);
        if (e.target.value === 'all') {
          params.delete('category');
        } else {
          params.set('category', e.target.value);
        }
        const queryString = params.toString();
        const currentPath = window.location.pathname;
        window.location.href = queryString ? `${currentPath}?${queryString}` : currentPath;
      }}
      value={category || 'all'}
      className="px-4 py-2 bg-[#141414] text-white border border-white/10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D9A441] hover:border-[#D9A441]/50 transition min-w-[200px]"
    >
      <option value="all">Semua Kategori</option>
      {categories && categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
