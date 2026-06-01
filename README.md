# Gianyar Web

Portal web Pemerintah Kabupaten Gianyar berbasis Next.js monorepo. Project ini memuat halaman layanan publik, pengajuan administrasi, cek status tiket, dashboard admin, penyimpanan dokumen, notifikasi, rate limiting, dan konfigurasi deployment lokal/produksi.

## Fitur Utama

- Portal informasi dan layanan publik Kabupaten Gianyar.
- Form pengajuan layanan dengan nomor tiket dan tracking token.
- Upload dokumen pengajuan ke storage privat atau MinIO.
- Dashboard admin untuk memantau dan memproses pengajuan.
- Integrasi PostgreSQL, Redis, MinIO, SMTP, dan worker notifikasi.
- Health check, logging internal, rate limiting, dan checklist keamanan.

## Struktur Repo

```text
apps/web/        Aplikasi Next.js utama
apps/api/        Service API pendukung
infra/docker/    Docker Compose lokal dan test
infra/db/        Skema database PostgreSQL
infra/nginx/     Konfigurasi Nginx
docs/            Dokumentasi operasi dan keamanan
scripts/         Script utilitas repo
```

## Prasyarat

- Node.js 20 atau lebih baru
- npm 10 atau lebih baru
- Docker dan Docker Compose
- Git

## Setup Cepat

Clone repo:

```sh
git clone https://github.com/darmayo/Gianyar_web.git
cd Gianyar_web
```

Install dependency:

```sh
npm install
```

Buat file environment lokal:

```sh
cp .env.example .env
```

Isi nilai rahasia di `.env`. Jangan commit file `.env`.

Untuk development lokal, jalankan service pendukung:

```sh
npm run docker:up
```

Apply skema database:

```sh
npm run db:apply
```

Jalankan aplikasi:

```sh
npm run dev
```

Aplikasi web berjalan di:

```text
http://localhost:3000
```

## Konfigurasi Environment

File `.env.example` berisi semua variabel yang dibutuhkan. Nilai yang perlu diganti minimal:

- `POSTGRES_PASSWORD`
- `DATABASE_URL`
- `REDIS_PASSWORD`
- `REDIS_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_SESSION_SECRET`
- `ADMIN_BOOTSTRAP_EMAIL`
- `ADMIN_BOOTSTRAP_PASSWORD`
- `JWT_SECRET`
- `MINIO_ACCESS_KEY`
- `MINIO_SECRET_KEY`
- `NIK_HASH_PEPPER`
- `NIK_ENCRYPTION_KEY`
- `LOG_SECRET`
- `LOG_INGEST_TOKEN`

Generate secret dengan contoh:

```sh
openssl rand -base64 32
openssl rand -hex 32
```

## Service Lokal

`npm run docker:up` menjalankan:

- PostgreSQL: `127.0.0.1:5432`
- Redis: `127.0.0.1:6379`
- MinIO API: `127.0.0.1:9000`
- MinIO Console: `127.0.0.1:9001`
- Mailhog SMTP: `127.0.0.1:1025`
- Mailhog UI: `127.0.0.1:8025`
- Adminer: `127.0.0.1:8080`

Matikan service:

```sh
npm run docker:down
```

Lihat log:

```sh
npm run docker:logs
```

## Script Penting

```sh
npm run dev                      # Jalankan development server
npm run build                    # Build production
npm run lint                     # Jalankan lint
npm run type-check               # Cek TypeScript
npm test                         # Jalankan test
npm run db:apply                 # Apply schema infra/db/schema.sql
npm run db:test:up               # Jalankan PostgreSQL khusus test
npm run db:test:down             # Matikan PostgreSQL test
npm run notifications:worker     # Jalankan worker notifikasi
npm run smoke:minio              # Smoke test MinIO
npm run smoke:smtp               # Smoke test SMTP
```

## Test

Test standar:

```sh
npm test
```

Test integrasi database:

```sh
npm run db:test:up
TEST_DATABASE_URL=postgres://gianyar_test:change-test-password@127.0.0.1:55432/gianyar_test npm test
npm run db:test:down
```

Di PowerShell:

```powershell
npm run db:test:up
$env:TEST_DATABASE_URL="postgres://gianyar_test:change-test-password@127.0.0.1:55432/gianyar_test"
npm test
npm run db:test:down
```

## Build Production

```sh
npm run build
npm --workspace web run start
```

Sebelum production, pastikan:

- Semua secret sudah digenerate ulang.
- `.env` production tidak masuk Git.
- Database schema sudah di-apply.
- Admin bootstrap password dirotasi setelah admin permanen dibuat.
- Storage dokumen tidak berada di folder public.
- Worker notifikasi sudah dijadwalkan.
- Backup dan monitoring sudah aktif.

Detail operasional ada di [docs/PRODUCTION_OPERATIONS.md](docs/PRODUCTION_OPERATIONS.md).

## Keamanan

Repo ini sengaja tidak menyimpan credential asli. `.env.example` hanya berisi placeholder.

Jangan commit:

- `.env`
- private key
- token API
- password database
- file dokumen warga
- backup database
- folder upload lokal

Checklist regression keamanan ada di [docs/SECURITY_REGRESSION_CHECKLIST.md](docs/SECURITY_REGRESSION_CHECKLIST.md).

## Troubleshooting

Jika `npm run db:apply` gagal, cek `DATABASE_URL` di `.env` dan pastikan PostgreSQL sudah berjalan.

Jika Redis gagal connect, cek `REDIS_PASSWORD` dan `REDIS_URL` harus memakai password yang sama.

Jika upload dokumen gagal, isi konfigurasi `PRIVATE_STORAGE_ROOT` atau grup `MINIO_*`.

Jika email tidak terkirim, gunakan Mailhog untuk development atau isi `SMTP_*` untuk SMTP sungguhan.

## Lisensi

Belum ditentukan.
