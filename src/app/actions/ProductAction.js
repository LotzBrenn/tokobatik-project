'use server';

import { db } from '@/library/db';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Helper Function: Simpan File ke /public/uploads
async function saveUploadedFile(file) {
    if (!file || typeof file === 'string' || file.size === 0) {
        return null;
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);
    return `/uploads/${filename}`;
}

// 1. TAMBAH PRODUK
export async function createProduct(formData) {
    const id = formData.get('id')?.trim();
    const name = formData.get('name')?.trim();
    const category = formData.get('category')?.trim() || formData.get('category_id')?.trim();
    const price = parseInt(formData.get('price'), 10);
    const description = formData.get('description')?.trim() || '';

    // Detail produk
    const details = {
        size_guide: formData.get('size_guide')?.trim() || '',
        fabric_type: formData.get('fabric_type')?.trim() || '',
        dye_type: formData.get('dye_type')?.trim() || '',
        technique_and_tools: formData.get('technique_and_tools')?.trim() || '',
        warning: formData.get('warning')?.trim() || ''
    };

    const imageFile = formData.get('image');
    let imagePath = '/uploads/default.jpg';

    try {
        if (imageFile && typeof imageFile === 'object' && imageFile.size > 0) {
            const savedPath = await saveUploadedFile(imageFile);
            if (savedPath) imagePath = savedPath;
        }

        if (!id || !name || !category || isNaN(price)) {
            return { error: 'Semua kolom wajib diisi dengan benar!' };
        }

        await db.query(
            `INSERT INTO products (id, name, category_id, price, image, description, details)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, name, category, price, imagePath, description, JSON.stringify(details)]
        );

        revalidatePath('/admin/produk');
        revalidatePath('/usaha');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Gagal menambah produk:', error);
        return { error: 'Gagal menyimpan produk. ID Produk mungkin sudah dipakai.' };
    }
}

// 2. UPDATE PRODUK
export async function updateProduct(formData) {
    const id = formData.get('id')?.trim();
    const name = formData.get('name')?.trim();
    const category = formData.get('category')?.trim() || formData.get('category_id')?.trim();
    const price = parseInt(formData.get('price'), 10);
    const description = formData.get('description')?.trim() || '';

    // Detail produk
    const details = {
        size_guide: formData.get('size_guide')?.trim() || '',
        fabric_type: formData.get('fabric_type')?.trim() || '',
        dye_type: formData.get('dye_type')?.trim() || '',
        technique_and_tools: formData.get('technique_and_tools')?.trim() || '',
        warning: formData.get('warning')?.trim() || ''
    };

    const imageFile = formData.get('image');

    try {
        let imagePath = null;
        if (imageFile && typeof imageFile === 'object' && imageFile.size > 0) {
            imagePath = await saveUploadedFile(imageFile);
        }

        if (imagePath) {
            // Jika memilih gambar baru, update lokasi gambar
            await db.query(
                `UPDATE products
                 SET name = ?, category_id = ?, price = ?, image = ?, description = ?, details = ?
                 WHERE id = ?`,
                [name, category, price, imagePath, description, JSON.stringify(details), id]
            );
        } else {
            // Jika tidak mengunggah gambar baru, pertahankan gambar lama
            await db.query(
                `UPDATE products
                 SET name = ?, category_id = ?, price = ?, description = ?, details = ?
                 WHERE id = ?`,
                [name, category, price, description, JSON.stringify(details), id]
            );
        }

        revalidatePath('/admin/produk');
        revalidatePath('/usaha');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Gagal memperbarui produk:', error);
        return { error: 'Gagal memperbarui data produk.' };
    }
}

// 3. HAPUS PRODUK
export async function deleteProduct(formData) {
    const id = formData.get('id');

    try {
        await db.query('DELETE FROM products WHERE id = ?', [id]);
        revalidatePath('/admin/produk');
        revalidatePath('/usaha');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Gagal menghapus produk:', error);
        return { error: 'Gagal menghapus produk.' };
    }
}