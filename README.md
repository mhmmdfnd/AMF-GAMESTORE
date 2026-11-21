# AMF GAMESTORE

Starter project website toko produk digital/game dengan tema Dark Navy Blue, Next.js App Router, Tailwind CSS, dan opsi integrasi Supabase.

## Persyaratan
- Node.js 20.9+
- Akun GitHub
- Akun Vercel
- (Opsional) Project Supabase

## Jalankan di komputer
1. Ekstrak ZIP.
2. Buka folder project di VS Code.
3. Jalankan `npm install`.
4. Salin `.env.local.example` menjadi `.env.local`.
5. Isi variabel Supabase dan nomor WhatsApp (format internasional tanpa `+`, contoh `62812...`).
6. Jalankan `npm run dev`.
7. Buka `http://localhost:3000`.

Website saat ini menggunakan katalog contoh lokal agar bisa langsung tampil tanpa database. Tombol pesan mengarahkan pembeli ke WhatsApp.

## Deploy ke Vercel
1. Buat repository GitHub baru, misalnya `amf-gamestore`.
2. Upload seluruh isi folder project (bukan folder ZIP).
3. Masuk Vercel → Add New → Project → Import repository.
4. Framework akan terdeteksi sebagai Next.js. Build command: `npm run build`.
5. Tambahkan Environment Variables:
   - `NEXT_PUBLIC_WHATSAPP` = nomor WhatsApp bisnis tanpa tanda `+`
   - `NEXT_PUBLIC_STORE_NAME` = `AMF GAMESTORE`
   - `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` jika memakai Supabase.
6. Klik Deploy. Setiap push ke branch production akan memicu deployment baru.

## Setup Supabase (opsional untuk tahap berikutnya)
1. Buat project di Supabase.
2. Buka SQL Editor dan jalankan isi `supabase/schema.sql`.
3. Salin Project URL dan anon/public key ke Environment Variables Vercel.
4. Jangan pernah memasukkan `service_role` key ke variabel berawalan `NEXT_PUBLIC_` atau ke kode browser.

## Catatan sebelum produksi
- Harga dan produk di homepage masih data contoh di `src/lib/products.ts`.
- Checkout saat ini diarahkan ke WhatsApp, belum membuat order di database.
- Belum ada payment gateway, panel admin, atau autentikasi pelanggan pada starter ini.
- Jangan mengklaim pembayaran otomatis sebelum gateway dan webhook diverifikasi.
- Untuk admin, buat API route server-side, verifikasi sesi pengguna, dan gunakan RLS. Service role key hanya boleh berada di server.
- Tambahkan kebijakan privasi, syarat layanan, dan informasi refund sebelum menerima transaksi nyata.
