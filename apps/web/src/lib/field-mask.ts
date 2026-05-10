// ============================================================
// Field Masker — lindungi data sensitif sebelum dikirim ke klien
//
// SECURITY: Kolom JSONB dataFormulir di tabel Pengajuan bisa
// mengandung NIK, nomor KK, atau data pribadi lain. Fungsi ini
// memastikan data tersebut tidak bocor ke response publik.
//
// Gunakan maskFormData() di SETIAP API handler sebelum JSON.stringify.
// ============================================================

/** Field yang wajib dimask sebelum dikembalikan ke klien */
const SENSITIVE_KEYS = new Set([
  'nik',
  'nikKepalaKeluarga',
  'nikAyah',
  'nikIbu',
  'nikAnak',
  'noKK',
  'nomorKK',
])

/** Field yang harus dihapus total (tidak dikembalikan sama sekali) */
const REDACTED_KEYS = new Set([
  'password',
  'passwordHash',
  'nikEncrypted',
  'accessToken',
  'refreshToken',
])

/**
 * Mask nilai NIK: tampilkan 4 digit awal + ×× + 2 digit akhir
 * Contoh: "3171022101xxxxxx" → "3171××××××××××xx"  (16 digit)
 */
function maskNik(value: string): string {
  if (value.length < 6) return '×'.repeat(value.length)
  const visible = 4
  const tail = 2
  return value.slice(0, visible) + '×'.repeat(value.length - visible - tail) + value.slice(-tail)
}

/**
 * Rekursif — handle nested objects dan arrays
 */
export function maskFormData(
  data: unknown,
  isOwner = false // pemilik data bisa lihat lebih banyak (tapi NIK tetap di-mask)
): unknown {
  if (data === null || data === undefined) return data
  if (Array.isArray(data)) return data.map((item) => maskFormData(item, isOwner))
  if (typeof data !== 'object') return data

  const obj = data as Record<string, unknown>
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    // Hapus total field terlarang
    if (REDACTED_KEYS.has(key)) continue

    // Mask NIK dan sejenisnya
    if (SENSITIVE_KEYS.has(key) && typeof value === 'string') {
      result[key] = maskNik(value)
      continue
    }

    // Rekursif untuk nested object
    result[key] = maskFormData(value, isOwner)
  }

  return result
}

/**
 * Khusus untuk data JSONB Pengajuan.
 * Petugas/admin bisa lihat data lebih lengkap tapi NIK tetap di-mask.
 */
export function maskPengajuanData(
  dataFormulir: Record<string, unknown>,
  _role: 'PUBLIC' | 'OWNER' | 'OPERATOR' | 'ADMIN'
): Record<string, unknown> {
  // Semua role tetap kena mask NIK — tidak ada pengecualian
  return maskFormData(dataFormulir) as Record<string, unknown>
}
