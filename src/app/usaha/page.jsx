// src/app/usaha/page.jsx
import { db } from '@/library/db';
import KatalogClient from '@/components/CatalogClient';
import Navbar from '@/components/Navbar';

export const revalidate = 0;

export default async function TokoUsahaPage() {
    let products = [];
    let categories = [];

    try {
        // 1. Fetch Produk dengan JOIN ke Tabel Categories
        const [prodRows] = await db.query(`
      SELECT p.*, c.name AS category_name 
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);

        // 2. Fetch Daftar Kategori untuk Filter Bar Dynamic
        const [catRows] = await db.query('SELECT * FROM categories ORDER BY id ASC');

        if (prodRows) products = prodRows;
        if (catRows) categories = catRows;
    } catch (error) {
        console.error('Gagal mengambil data dari MySQL:', error);
    }

    return (
        <div className="min-h-screen bg-[#141414]">
            <Navbar />
            <main>
                <KatalogClient initialProducts={products} categoriesList={categories} />
            </main>
        </div>
    );
}