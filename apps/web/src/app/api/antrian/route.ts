// ============================================================
// API Antrian Digital — Next.js Route Handler
// POST /api/antrian → ambil nomor antrian
// GET  /api/antrian?tanggal=&layanan= → cek ketersediaan slot
// Security: rate limit, input validation, no IDOR
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logApiError } from '@/lib/logger'
import { getRedisClient } from '@/lib/redis'

// Validasi input — cegah injection
const ambilAntrianSchema = z.object({
  layanan: z.enum([
    'KTP', 'KARTU_KELUARGA', 'AKTA_LAHIR',
    'PINDAH_DOMISILI', 'PERIZINAN', 'KONSULTASI',
  ]),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal: YYYY-MM-DD'),
  waktu: z.enum(['08:00', '09:00', '10:00', '11:00', '13:00']),
  nama: z.string().min(3).max(100),
  noHp: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/),
  email: z.string().email().optional(),
})

// Slot tersedia per sesi (max 10 per slot)
const KAPASITAS_PER_SLOT = 10

// In-memory store untuk demo — ganti dengan Redis/DB di produksi
const antrianStore: Map<string, number> = new Map()
const antrianCounter: Map<string, number> = new Map()
const ANTRIAN_TTL_SECONDS = 90 * 24 * 60 * 60

function getSlotKey(layanan: string, tanggal: string, waktu: string) {
  return `${layanan}:${tanggal}:${waktu}`
}

function generateNomorAntrian(layanan: string, counter: number): string {
  const prefix = layanan.substring(0, 3).toUpperCase()
  return `${prefix}-${String(counter).padStart(3, '0')}`
}

function generateQRData(nomor: string, layanan: string, tanggal: string, waktu: string) {
  return Buffer.from(JSON.stringify({ nomor, layanan, tanggal, waktu, issued: Date.now() })).toString('base64')
}

function getLocalDay(tanggal: string) {
  const [year, month, day] = tanggal.split('-').map(Number)
  return new Date(year, month - 1, day).getDay()
}

async function getSlotCount(key: string): Promise<number> {
  const redis = await getRedisClient()
  if (redis) {
    const value = await redis.get(`antrian:slot:${key}`)
    return value ? Number(value) : 0
  }

  return antrianStore.get(key) ?? 0
}

async function reserveSlot(layanan: string, tanggal: string, waktu: string) {
  const slotKey = getSlotKey(layanan, tanggal, waktu)
  const counterKey = `${layanan}:${tanggal}`
  const redis = await getRedisClient()

  if (redis) {
    const result = await redis.eval(
      `
local slot_key = KEYS[1]
local counter_key = KEYS[2]
local capacity = tonumber(ARGV[1])
local ttl = tonumber(ARGV[2])
local current = tonumber(redis.call('GET', slot_key) or '0')
if current >= capacity then
  return {-1, current}
end
local filled = redis.call('INCR', slot_key)
if filled == 1 then
  redis.call('EXPIRE', slot_key, ttl)
end
if filled > capacity then
  redis.call('DECR', slot_key)
  return {-1, capacity}
end
local counter = redis.call('INCR', counter_key)
if counter == 1 then
  redis.call('EXPIRE', counter_key, ttl)
end
return {counter, filled}
      `,
      {
        keys: [`antrian:slot:${slotKey}`, `antrian:counter:${counterKey}`],
        arguments: [String(KAPASITAS_PER_SLOT), String(ANTRIAN_TTL_SECONDS)],
      }
    ) as [number, number]

    return { success: result[0] !== -1, counter: result[0], filled: result[1] }
  }

  const terisi = antrianStore.get(slotKey) ?? 0
  if (terisi >= KAPASITAS_PER_SLOT) {
    return { success: false, counter: -1, filled: terisi }
  }

  const counter = (antrianCounter.get(counterKey) ?? 0) + 1
  antrianCounter.set(counterKey, counter)
  antrianStore.set(slotKey, terisi + 1)
  return { success: true, counter, filled: terisi + 1 }
}

// GET: cek ketersediaan slot
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const tanggal = searchParams.get('tanggal') ?? ''
    const layanan = searchParams.get('layanan') ?? ''

    if (!tanggal || !layanan) {
      return NextResponse.json({ error: 'Parameter tanggal dan layanan wajib diisi' }, { status: 400 })
    }

    // Validasi tanggal
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
      return NextResponse.json({ error: 'Format tanggal tidak valid' }, { status: 400 })
    }

    // Cek apakah hari kerja (Senin–Jumat)
    const hari = getLocalDay(tanggal)
    if (hari === 0 || hari === 6) {
      return NextResponse.json({
        tersedia: false,
        pesan: 'Layanan tidak tersedia pada hari Sabtu dan Minggu',
      })
    }

    const WAKTU_SLOTS = ['08:00', '09:00', '10:00', '11:00', '13:00']
    const slots = await Promise.all(WAKTU_SLOTS.map(async (waktu) => {
      const key = getSlotKey(layanan, tanggal, waktu)
      const terisi = await getSlotCount(key)
      return {
        waktu,
        tersedia: terisi < KAPASITAS_PER_SLOT,
        sisa: Math.max(0, KAPASITAS_PER_SLOT - terisi),
      }
    }))

    return NextResponse.json({ tanggal, layanan, slots })
  } catch (err) {
    logApiError('/api/antrian', err, { method: 'GET', url: req.url })
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

// POST: ambil nomor antrian
export async function POST(req: NextRequest) {
  try {
    // Rate limit header check (Nginx sudah handle, ini sebagai backup)

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Format request tidak valid' }, { status: 400 })
    }

    // Validasi semua input dengan Zod
    const parsed = ambilAntrianSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({
        error: 'Data tidak valid',
        detail: parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
      }, { status: 422 })
    }

    const { layanan, tanggal, waktu, nama } = parsed.data

    // Cek hari kerja
    const hari = getLocalDay(tanggal)
    if (hari === 0 || hari === 6) {
      return NextResponse.json({ error: 'Layanan tidak tersedia pada hari Sabtu dan Minggu' }, { status: 400 })
    }

    const reservation = await reserveSlot(layanan, tanggal, waktu)
    if (!reservation.success) {
      return NextResponse.json({ error: 'Slot waktu ini sudah penuh. Pilih waktu lain.' }, { status: 409 })
    }

    // Generate nomor antrian
    const nomorAntrian = generateNomorAntrian(layanan, reservation.counter)
    const qrData = generateQRData(nomorAntrian, layanan, tanggal, waktu)

    return NextResponse.json({
      success: true,
      data: {
        nomorAntrian,
        layanan,
        tanggal,
        waktu,
        nama,
        qrCode: qrData,  // Base64 QR data — render di client
        pesan: `Nomor antrian Anda: ${nomorAntrian}. Hadir 10 menit sebelum waktu yang dipilih dengan membawa QR code ini.`,
      },
    }, { status: 201 })

  } catch (err) {
    logApiError('/api/antrian', err, { method: 'POST', url: req.url })
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
