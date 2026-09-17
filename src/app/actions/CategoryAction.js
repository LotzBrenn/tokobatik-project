// src/app/actions/categoryActions.js
'use server';

import { db } from '@/library/db';
import { revalidatePath } from 'next/cache';

// 1. TAMBAH KATEGORI (CREATE)
export async function createCategory(formData) {
    const name = formData.get('name')?.trim();

    if (!name) {
        return { error: 'Nama kategori wajib diisi!' };
    }

    try {
        await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
        revalidatePath('/admin/kategori');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Gagal menambah kategori:', error);
        return { error: 'Gagal menyimpan kategori. Kemungkinan nama kategori sudah ada.' };
    }
}

// 2. EDIT / UPDATE KATEGORI
export async function updateCategory(formData) {
    const id = formData.get('id');
    const name = formData.get('name')?.trim();

    if (!id || !name) {
        return { error: 'ID dan Nama kategori wajib diisi!' };
    }

    try {
        await db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
        revalidatePath('/admin/kategori');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Gagal memperbarui kategori:', error);
        return { error: 'Gagal memperbarui kategori.' };
    }
}

// 3. HAPUS KATEGORI (DELETE)
export async function deleteCategory(formData) {
    const id = formData.get('id');

    if (!id) {
        return { error: 'ID Kategori tidak ditemukan!' };
    }

    try {
        await db.query('DELETE FROM categories WHERE id = ?', [id]);
        revalidatePath('/admin/kategori');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Gagal menghapus kategori:', error);
        return { error: 'Gagal menghapus kategori.' };
    }
}