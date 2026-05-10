import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Kebijakan Privasi Portal Kabupaten Gianyar — perlindungan data pribadi masyarakat sesuai UU PDP.',
}

export default function KebijakanPrivasiPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12 prose prose-gray prose-headings:text-blue-900">
      <h1>Kebijakan Privasi</h1>
      <p className="text-sm text-gray-500">Terakhir diperbarui: 1 April 2026</p>

      <p>
        Pemerintah Kabupaten Gianyar (&quot;<strong>kami</strong>&quot;) berkomitmen melindungi
        data pribadi Anda sesuai dengan <strong>Undang-Undang Nomor 27 Tahun 2022
        tentang Pelindungan Data Pribadi (UU PDP)</strong>. Kebijakan ini menjelaskan
        bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
      </p>

      <h2>1. Data yang Kami Kumpulkan</h2>
      <ul>
        <li><strong>Data Identitas:</strong> Nama lengkap, NIK (disimpan terenkripsi AES-256), tanggal lahir, alamat</li>
        <li><strong>Data Kontak:</strong> Nomor HP, alamat email</li>
        <li><strong>Data Layanan:</strong> Permohonan layanan publik, dokumen yang diunggah</li>
        <li><strong>Data Pengaduan:</strong> Isi laporan, foto/dokumen pendukung, lokasi kejadian</li>
        <li><strong>Data Teknis:</strong> Alamat IP, jenis perangkat, log akses (untuk keamanan sistem)</li>
      </ul>

      <h2>2. Tujuan Penggunaan Data</h2>
      <p>Data Anda digunakan <strong>semata-mata</strong> untuk:</p>
      <ul>
        <li>Memproses permohonan layanan publik (KTP, KK, perizinan, dll)</li>
        <li>Menindaklanjuti pengaduan masyarakat</li>
        <li>Mengirim notifikasi status layanan/pengaduan</li>
        <li>Meningkatkan kualitas layanan pemerintah</li>
        <li>Kepatuhan hukum dan audit pemerintahan</li>
      </ul>

      <h2>3. Perlindungan Data</h2>
      <ul>
        <li>NIK dan data sensitif dienkripsi menggunakan <strong>AES-256</strong></li>
        <li>Semua komunikasi dilindungi protokol <strong>HTTPS/TLS 1.3</strong></li>
        <li>Dokumen yang diunggah disimpan di server aman dengan akses terbatas</li>
        <li>Audit log dijalankan untuk setiap akses data sensitif</li>
        <li>Server berlokasi di Indonesia sesuai ketentuan UU PDP</li>
      </ul>

      <h2>4. Berbagi Data</h2>
      <p>
        Kami <strong>tidak menjual atau menyewakan</strong> data Anda kepada pihak ketiga.
        Data hanya dibagikan kepada:
      </p>
      <ul>
        <li>Instansi pemerintah terkait (Dukcapil, BPBD, Dinas terkait) untuk pemrosesan layanan</li>
        <li>Penegak hukum berdasarkan perintah pengadilan atau peraturan perundang-undangan</li>
      </ul>

      <h2>5. Hak Anda</h2>
      <p>Sesuai UU PDP, Anda berhak untuk:</p>
      <ul>
        <li><strong>Mengakses</strong> data pribadi yang kami simpan</li>
        <li><strong>Memperbaiki</strong> data yang tidak akurat</li>
        <li><strong>Menghapus</strong> data yang tidak lagi diperlukan</li>
        <li><strong>Menarik persetujuan</strong> penggunaan data kapan saja</li>
        <li><strong>Mengajukan keberatan</strong> atas pemrosesan data tertentu</li>
      </ul>
      <p>
        Untuk menggunakan hak Anda, hubungi: <a href="mailto:dpo@gianyarkab.go.id">dpo@gianyarkab.go.id</a>
      </p>

      <h2>6. Retensi Data</h2>
      <p>
        Data disimpan selama diperlukan untuk memenuhi tujuan pengumpulan, atau sesuai
        ketentuan hukum yang berlaku. Data layanan publik disimpan minimal 5 tahun
        sesuai ketentuan administrasi pemerintahan.
      </p>

      <h2>7. Cookie</h2>
      <p>
        Kami menggunakan cookie sesi untuk autentikasi (bukan untuk pelacakan iklan).
        Cookie dapat dinonaktifkan melalui pengaturan browser Anda.
      </p>

      <h2>8. Perubahan Kebijakan</h2>
      <p>
        Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan material akan
        diumumkan melalui banner di portal ini minimal 14 hari sebelum berlaku.
      </p>

      <h2>9. Kontak</h2>
      <address className="not-italic">
        <p><strong>Data Protection Officer (DPO)</strong><br />
        Dinas Komunikasi dan Informatika Kabupaten Gianyar<br />
        Jl. Ngurah Rai No. 1, Gianyar, Bali 80511<br />
        Email: <a href="mailto:dpo@gianyarkab.go.id">dpo@gianyarkab.go.id</a><br />
        Telp: (0361) 943049
        </p>
      </address>
    </article>
  )
}
