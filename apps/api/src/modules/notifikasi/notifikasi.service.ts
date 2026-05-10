// ============================================================
// Notifikasi Service — Email + WhatsApp
// ============================================================

import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { StatusPengaduan } from '@prisma/client'
import * as nodemailer from 'nodemailer'
import axios from 'axios'

const STATUS_LABEL: Record<StatusPengaduan, string> = {
  DITERIMA: 'Diterima',
  DIVERIFIKASI: 'Sedang Diverifikasi',
  DIPROSES: 'Sedang Diproses',
  ESKALASI: 'Dieskalasi',
  SELESAI: 'Selesai',
  DITUTUP: 'Ditutup',
}

@Injectable()
export class NotifikasiService {
  private readonly logger = new Logger(NotifikasiService.name)
  private transporter: nodemailer.Transporter

  constructor(private prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  async kirimKonfirmasiPengaduan(data: {
    pengaduanId: string
    nomorTiket: string
    email: string
    noHp?: string
    judul: string
    deadlineAt: Date
  }) {
    const pesan = this.templateKonfirmasiPengaduan(data)

    await Promise.allSettled([
      this.kirimEmail({
        pengaduanId: data.pengaduanId,
        tujuan: data.email,
        judul: `[${data.nomorTiket}] Pengaduan Anda Telah Diterima`,
        pesanHtml: pesan.html,
        pesanTeks: pesan.teks,
      }),
      data.noHp
        ? this.kirimWhatsApp({
            pengaduanId: data.pengaduanId,
            tujuan: data.noHp,
            pesan: pesan.teks,
          })
        : Promise.resolve(),
    ])
  }

  async kirimUpdatePengaduan(data: {
    pengaduanId: string
    email: string
    noHp?: string
    nomorTiket: string
    statusBaru: StatusPengaduan
    catatan?: string
  }) {
    const statusLabel = STATUS_LABEL[data.statusBaru]
    const judul = `[${data.nomorTiket}] Status Pengaduan: ${statusLabel}`
    const pesanTeks = [
      `Yth. Warga Kabupaten Gianyar,`,
      ``,
      `Pengaduan Anda dengan nomor tiket ${data.nomorTiket} telah diperbarui.`,
      `Status terbaru: ${statusLabel}`,
      data.catatan ? `Catatan petugas: ${data.catatan}` : '',
      ``,
      `Pantau status pengaduan di:`,
      `${process.env.APP_URL}/pengaduan/cek?tiket=${data.nomorTiket}`,
      ``,
      `Terima kasih,`,
      `Tim Pelayanan Kabupaten Gianyar`,
    ].filter(Boolean).join('\n')

    await Promise.allSettled([
      this.kirimEmail({
        pengaduanId: data.pengaduanId,
        tujuan: data.email,
        judul,
        pesanHtml: `<pre style="font-family:sans-serif">${pesanTeks}</pre>`,
        pesanTeks,
      }),
      data.noHp
        ? this.kirimWhatsApp({
            pengaduanId: data.pengaduanId,
            tujuan: data.noHp,
            pesan: pesanTeks,
          })
        : Promise.resolve(),
    ])
  }

  private async kirimEmail(data: {
    pengaduanId?: string
    layananId?: string
    tujuan: string
    judul: string
    pesanHtml: string
    pesanTeks: string
  }) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: data.tujuan,
        subject: data.judul,
        text: data.pesanTeks,
        html: data.pesanHtml,
      })

      await this.prisma.notifikasi.create({
        data: {
          pengaduanId: data.pengaduanId,
          layananId: data.layananId,
          channel: 'email',
          tujuan: data.tujuan,
          judul: data.judul,
          pesan: data.pesanTeks,
          isSent: true,
          sentAt: new Date(),
        }
      })
    } catch (err) {
      this.logger.error(`Gagal kirim email ke ${data.tujuan}: ${err.message}`)
      await this.prisma.notifikasi.create({
        data: {
          pengaduanId: data.pengaduanId,
          layananId: data.layananId,
          channel: 'email',
          tujuan: data.tujuan,
          judul: data.judul,
          pesan: data.pesanTeks,
          isSent: false,
          errorMsg: err.message,
        }
      })
    }
  }

  private async kirimWhatsApp(data: {
    pengaduanId?: string
    layananId?: string
    tujuan: string
    pesan: string
  }) {
    try {
      await axios.post(
        process.env.WA_API_URL!,
        { target: data.tujuan, message: data.pesan },
        {
          headers: {
            Authorization: process.env.WA_API_TOKEN!,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      )

      await this.prisma.notifikasi.create({
        data: {
          pengaduanId: data.pengaduanId,
          channel: 'whatsapp',
          tujuan: data.tujuan,
          judul: 'Update Status',
          pesan: data.pesan,
          isSent: true,
          sentAt: new Date(),
        }
      })
    } catch (err) {
      this.logger.error(`Gagal kirim WA ke ${data.tujuan}: ${err.message}`)
    }
  }

  private templateKonfirmasiPengaduan(data: {
    nomorTiket: string
    judul: string
    deadlineAt: Date
  }) {
    const deadline = data.deadlineAt.toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })

    const teks = [
      `Yth. Warga Kabupaten Gianyar,`,
      ``,
      `Pengaduan Anda telah DITERIMA dengan detail:`,
      `Nomor Tiket : ${data.nomorTiket}`,
      `Judul       : ${data.judul}`,
      `Batas Waktu : ${deadline}`,
      ``,
      `Pantau status di:`,
      `${process.env.APP_URL}/pengaduan/cek?tiket=${data.nomorTiket}`,
      ``,
      `Hormat kami,`,
      `Pemerintah Kabupaten Gianyar`,
    ].join('\n')

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1a5276;color:white;padding:20px;text-align:center">
          <h2>Portal Kabupaten Gianyar</h2>
        </div>
        <div style="padding:20px;background:#f9f9f9">
          <p>Yth. Warga Kabupaten Gianyar,</p>
          <p>Pengaduan Anda telah <strong>DITERIMA</strong> oleh sistem kami.</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0">
            <tr style="background:#eee">
              <td style="padding:8px;border:1px solid #ddd"><strong>Nomor Tiket</strong></td>
              <td style="padding:8px;border:1px solid #ddd;font-weight:bold;color:#1a5276">${data.nomorTiket}</td>
            </tr>
            <tr>
              <td style="padding:8px;border:1px solid #ddd"><strong>Judul</strong></td>
              <td style="padding:8px;border:1px solid #ddd">${data.judul}</td>
            </tr>
            <tr style="background:#eee">
              <td style="padding:8px;border:1px solid #ddd"><strong>Batas Penyelesaian</strong></td>
              <td style="padding:8px;border:1px solid #ddd">${deadline}</td>
            </tr>
          </table>
          <div style="text-align:center;margin:20px 0">
            <a href="${process.env.APP_URL}/pengaduan/cek?tiket=${data.nomorTiket}"
               style="background:#1a5276;color:white;padding:12px 24px;text-decoration:none;border-radius:4px">
              Pantau Status Pengaduan
            </a>
          </div>
        </div>
        <div style="padding:10px;text-align:center;color:#888;font-size:12px">
          Pemerintah Kabupaten Gianyar — Bali
        </div>
      </div>
    `

    return { teks, html }
  }
}
