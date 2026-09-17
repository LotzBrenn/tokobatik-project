'use server';

import { db } from '@/library/db';
import { createSession, deleteSession } from '@/library/session';

export async function loginAction(formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
        return { success: false, message: 'Email dan password wajib diisi!' };
    }

    try {
        // Cari user berdasarkan email dan password
        const [rows] = await db.query(
            'SELECT id, name, email, role FROM users WHERE email = ? AND password = ?',
            [email, password]
        );

        if (rows.length === 0) {
            return { success: false, message: 'Email atau password salah!' };
        }

        const user = rows[0];

        // Hanya izinkan user dengan role 'admin'
        if (user.role !== 'admin') {
            return { success: false, message: 'Akses ditolak. Hanya admin yang dapat login.' };
        }

        // Buat session cookie yang aman
        await createSession(user.id, {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });

        return {
            success: true,
            message: 'Login berhasil!',
        };
    } catch (error) {
        console.error('Error saat login:', error);
        return { success: false, message: 'Terjadi kesalahan sistem.' };
    }
}

export async function logoutAction() {
    await deleteSession();
    return { success: true };
}