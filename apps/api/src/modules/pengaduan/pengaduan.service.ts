// ============================================================
// Pengaduan Service — Business Logic
// Security: IDOR check, rate limiting, audit log
// ============================================================

import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { NotifikasiService } from '../notifikasi/notifikasi.service'
import { AuditService } from '../../common/audit/audit.service'
import { TiketService } from '../../common/tiket/tiket.service'
import { StatusPengaduan, KategoriPengaduan, PrioritasPengaduan } from '@prisma/client'

const SLA_HARI: Record<KategoriPengaduan, number> = {
  INFRASTRUKTUR: 14,
  PELAYANAN_PUBLIK: 7,
  LINGKUNGAN: 10,
  KEAMANAN: 3,
  KESEHATAN: 5,
  PENDIDIKAN: 10,
  LAINNYA: 14,
}

@Injectable()
export class PengaduanService {
  constructor(
    private prisma: PrismaService,
    private notifikasi: NotifikasiService,
    private audit: AuditService,
    private tiket: TiketService,
  ) {}

  async create(userId: string, data: {
    judul: string
    deskripsi: string
    kategori: KategoriPengaduan
    lokasi?: string
    isAnonim?: boolean
    noHpPelapor?: string
  }, ipAddress: string) {
    const nomorTiket = await this.tiket.generateTiket('ADU')
    const deadlineAt = this.hitungDeadline(data.kategori)

    const pengaduan = await this.prisma.pengaduan.create({
      data: {
        nomorTiket,
        userId,
        judul: data.judul,
        deskripsi: data.deskripsi,
        kategori: data.kategori,
        lokasi: data.lokasi,
        isAnonim: data.isAnonim ?? false,
        status: StatusPengaduan.DITERIMA,
        prioritas: this.tentukaPrioritas(data.kategori),
        deadlineAt,
        riwayat: {
          create: {
            statusLama: StatusPengaduan.DITERIMA,
            statusBaru: StatusPengaduan.DITERIMA,
            catatan: 'Pengaduan berhasil diterima oleh sistem',
            isPublic: true,
          }
        }
      },
      include: { riwayat: true }
    })

    // Audit log
    await this.audit.log({
      userId,
      action: 'CREATE_PENGADUAN',
      resource: 'pengaduan',
      resourceId: pengaduan.id,
      ipAddress,
      metadata: { nomorTiket, kategori: data.kategori },
    })

    // Kirim notifikasi konfirmasi
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (user && !data.isAnonim) {
      await this.notifikasi.kirimKonfirmasiPengaduan({
        pengaduanId: pengaduan.id,
        nomorTiket,
        email: user.email,
        noHp: data.noHpPelapor ?? user.noHp ?? undefined,
        judul: data.judul,
        deadlineAt,
      })
    }

    return pengaduan
  }

  async findByTiket(nomorTiket: string) {
    const pengaduan = await this.prisma.pengaduan.findUnique({
      where: { nomorTiket },
      include: {
        riwayat: {
          where: { isPublic: true },
          orderBy: { createdAt: 'asc' },
        },
        dokumen: {
          select: {
            id: true,
            namaFile: true,
            mimeType: true,
            ukuranBytes: true,
            createdAt: true,
            // JANGAN expose namaFileStorage ke publik
          }
        }
      }
    })

    if (!pengaduan) throw new NotFoundException('Nomor tiket tidak ditemukan')

    // Sembunyikan data identitas jika anonim
    if (pengaduan.isAnonim) {
      return {
        ...pengaduan,
        userId: null,
        user: null,
      }
    }

    return pengaduan
  }

  // IDOR Protection: pastikan user hanya bisa akses pengaduan miliknya
  async findByUser(userId: string, page: number, limit: number) {
    const [data, total] = await Promise.all([
      this.prisma.pengaduan.findMany({
        where: { userId }, // filter by userId — mencegah IDOR
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          riwayat: {
            where: { isPublic: true },
            take: 1,
            orderBy: { createdAt: 'desc' },
          }
        }
      }),
      this.prisma.pengaduan.count({ where: { userId } }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  // Operator: update status pengaduan
  async updateStatus(
    pengaduanId: string,
    operatorId: string,
    statusBaru: StatusPengaduan,
    catatan?: string,
    ipAddress?: string,
  ) {
    const pengaduan = await this.prisma.pengaduan.findUnique({
      where: { id: pengaduanId },
      include: { user: true }
    })

    if (!pengaduan) throw new NotFoundException('Pengaduan tidak ditemukan')

    const statusLama = pengaduan.status

    const updated = await this.prisma.pengaduan.update({
      where: { id: pengaduanId },
      data: {
        status: statusBaru,
        operatorId,
        selesaiAt: statusBaru === StatusPengaduan.SELESAI ? new Date() : undefined,
        riwayat: {
          create: {
            statusLama,
            statusBaru,
            catatan: catatan ?? `Status diperbarui oleh petugas`,
            operatorId,
            isPublic: true,
          }
        }
      }
    })

    // Audit log
    await this.audit.log({
      userId: operatorId,
      action: 'UPDATE_STATUS_PENGADUAN',
      resource: 'pengaduan',
      resourceId: pengaduanId,
      ipAddress,
      metadata: { statusLama, statusBaru, catatan },
    })

    // Notifikasi ke warga
    if (pengaduan.user && !pengaduan.isAnonim) {
      await this.notifikasi.kirimUpdatePengaduan({
        pengaduanId,
        email: pengaduan.user.email,
        noHp: pengaduan.user.noHp ?? undefined,
        nomorTiket: pengaduan.nomorTiket,
        statusBaru,
        catatan,
      })
    }

    return updated
  }

  // Dashboard publik — statistik anonim
  async getStatistikPublik() {
    const [total, selesai, diproses, perKategori] = await Promise.all([
      this.prisma.pengaduan.count(),
      this.prisma.pengaduan.count({ where: { status: StatusPengaduan.SELESAI } }),
      this.prisma.pengaduan.count({
        where: {
          status: { in: [StatusPengaduan.DIPROSES, StatusPengaduan.DIVERIFIKASI] }
        }
      }),
      this.prisma.pengaduan.groupBy({
        by: ['kategori'],
        _count: { _all: true },
        orderBy: { _count: { kategori: 'desc' } },
      }),
    ])

    const rataWaktuSelesai = await this.prisma.$queryRaw<[{ avg_hari: number }]>`
      SELECT AVG(EXTRACT(EPOCH FROM (selesai_at - created_at)) / 86400)::numeric(10,1) as avg_hari
      FROM pengaduan
      WHERE selesai_at IS NOT NULL AND status = 'SELESAI'
    `

    return {
      total,
      selesai,
      diproses,
      tingkatPenyelesaian: total > 0 ? Math.round((selesai / total) * 100) : 0,
      rataWaktuSelesaiHari: rataWaktuSelesai[0]?.avg_hari ?? 0,
      perKategori,
    }
  }

  private hitungDeadline(kategori: KategoriPengaduan): Date {
    const hari = SLA_HARI[kategori]
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + hari)
    return deadline
  }

  private tentukaPrioritas(kategori: KategoriPengaduan): PrioritasPengaduan {
    if (kategori === 'KEAMANAN') return PrioritasPengaduan.KRITIS
    if (kategori === 'KESEHATAN') return PrioritasPengaduan.TINGGI
    if (kategori === 'PELAYANAN_PUBLIK') return PrioritasPengaduan.TINGGI
    return PrioritasPengaduan.SEDANG
  }
}
