// src/app/usaha/page.jsx
import { db } from '@/library/db';
import KatalogClient from '@/components/CatalogClient';
import Navbar from '@/components/Navbar';

export const revalidate = 0;

export default async function TokoUsahaPage() {
    let products = [];
    let categories = [];

    try {
        // 1. Fetch Produk dengan JOIN ke Tabel Categories dan Product Variants
        const [prodRows] = await db.query(`
      SELECT
        p.id,
        p.category_id,
        p.name,
        p.description,
        p.image,
        p.details,
        p.created_at,
        c.name AS category_name,
        MIN(pv.price) AS min_price,
        MAX(pv.price) AS max_price,
        GROUP_CONCAT(
          CONCAT(pv.size, ':', pv.price, ':', pv.stock)
          ORDER BY pv.price ASC
          SEPARATOR '|'
        ) AS variants
      FROM products p
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

        // 2. Fetch Daftar Kategori untuk Filter Bar Dynamic
        const [catRows] = await db.query('SELECT * FROM categories ORDER BY id ASC');

        if (prodRows) {
            products = prodRows.map(product => ({
                ...product,
                price: product.min_price,
                priceRange: product.min_price !== product.max_price
                    ? `Rp ${Number(product.min_price).toLocaleString('id-ID')} - Rp ${Number(product.max_price).toLocaleString('id-ID')}`
                    : `Rp ${Number(product.min_price).toLocaleString('id-ID')}`
            }));
        }
        if (catRows) categories = catRows;
    } catch (error) {
        console.error('Gagal mengambil data dari MySQL:', error);
    }

    return (
        <div className="min-h-screen bg-[#141414] relative">
            {/* Background Image with Overlay */}
            <div className="fixed inset-0 z-0 opacity-10">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{ backgroundImage: 'url(/batik-bg.png)' }}
                />
            </div>

            <div className="relative z-10">
                <Navbar />
                <main>
                    <KatalogClient initialProducts={products} categoriesList={categories} />
                </main>
            </div>
        </div>
    );
}