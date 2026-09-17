// src/app/admin/produk/page.jsx
import { db } from '@/library/db';
import ProdukClient from '@/components/ProductClient';

export const revalidate = 0;

export default async function AdminProdukPage() {
    let products = [];
    let categories = [];

    try {
        const [prodRows] = await db.query(`
      SELECT p.*, c.name AS category_name 
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);

        const [catRows] = await db.query('SELECT * FROM categories ORDER BY name ASC');

        if (prodRows) products = prodRows;
        if (catRows) categories = catRows;
    } catch (error) {
        console.error('Gagal mengambil data:', error);
    }

    return (
        <div className="space-y-8">
            <div>
                <span className="text-[#D9A441] text-xs font-mono uppercase block">Data Master Produk_</span>
                <h1 className="text-3xl font-black text-white uppercase">Kelola Katalog Batik</h1>
                <p className="text-slate-400 text-xs mt-1">Tambah, edit, atau hapus produk batik beserta rute gambar /uploads/[cite: 2].</p>
            </div>

            <ProdukClient initialProducts={products} categoriesList={categories} />
        </div>
    );
}