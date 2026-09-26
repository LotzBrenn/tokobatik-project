import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';
import { db } from '@/library/db';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const orderId = formData.get('order_id');

    if (!file || !orderId) {
      return NextResponse.json(
        { success: false, message: 'File dan Order ID harus diisi' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'File harus berupa gambar' },
        { status: 400 }
      );
    }

    const [orderRows] = await db.query(
      'SELECT order_id FROM orders WHERE order_id = ?',
      [orderId]
    );

    if (!orderRows || orderRows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Pesanan tidak ditemukan' },
        { status: 404 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), 'public', 'payment-proofs');
    await mkdir(uploadDir, { recursive: true });

    const fileExtension = file.name.split('.').pop();
    const fileName = `${orderId}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const publicPath = `/payment-proofs/${fileName}`;

    try {
      await db.query(
        'UPDATE orders SET payment_proof = ?, status = ? WHERE order_id = ?',
        [publicPath, 'processing', orderId]
      );
    } catch (dbError) {
      console.warn('Could not update payment_proof column, file saved but DB not updated:', dbError.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Bukti pembayaran berhasil diupload',
      filePath: publicPath
    });

  } catch (error) {
    console.error('Error uploading payment proof:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengupload bukti pembayaran' },
      { status: 500 }
    );
  }
}
