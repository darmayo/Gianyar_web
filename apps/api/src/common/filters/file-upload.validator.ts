// ============================================================
// File Upload Validator — OWASP A04: Insecure Design
// VibeSec: cegah malicious file upload
// ============================================================

import { BadRequestException } from '@nestjs/common'
import { createHash } from 'crypto'
import { readFileSync } from 'fs'

// Magic bytes untuk validasi tipe file nyata (bukan hanya MIME dari header)
const FILE_SIGNATURES: Record<string, Buffer[]> = {
  'image/jpeg': [Buffer.from([0xff, 0xd8, 0xff])],
  'image/png': [Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
  'image/webp': [Buffer.from('RIFF')],
  'application/pdf': [Buffer.from('%PDF')],
}

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export function validateFileUpload(file: Express.Multer.File): void {
  // 1. Cek ukuran file
  if (file.size > MAX_SIZE) {
    throw new BadRequestException('Ukuran file melebihi batas 10 MB')
  }

  // 2. Cek MIME type dari header
  if (!Object.keys(FILE_SIGNATURES).includes(file.mimetype)) {
    throw new BadRequestException(
      'Tipe file tidak diizinkan. Gunakan JPG, PNG, WebP, atau PDF'
    )
  }

  // 3. Validasi ekstensi file (lowercase)
  const ext = ('.' + file.originalname.split('.').pop()?.toLowerCase()) ?? ''
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new BadRequestException('Ekstensi file tidak diizinkan')
  }

  // 4. Validasi magic bytes — cek konten nyata file (cegah file spoofing)
  const buffer = file.buffer
  const allowedSignatures = FILE_SIGNATURES[file.mimetype]

  const isValidMagic = allowedSignatures.some((sig) =>
    buffer.subarray(0, sig.length).equals(sig)
  )

  if (!isValidMagic) {
    throw new BadRequestException(
      'Konten file tidak sesuai dengan tipe yang diklaim'
    )
  }

  // 5. Cek nama file — cegah path traversal & null byte injection
  const sanitizedName = file.originalname
    .replace(/[^a-zA-Z0-9._\-\s]/g, '') // hanya karakter aman
    .replace(/\.\./g, '')                  // hapus ..
    .replace(/\0/g, '')                    // hapus null byte

  if (sanitizedName !== file.originalname) {
    throw new BadRequestException('Nama file mengandung karakter tidak valid')
  }

  // 6. Cek ukuran nama file
  if (file.originalname.length > 255) {
    throw new BadRequestException('Nama file terlalu panjang')
  }
}

// Generate checksum untuk integritas file
export function generateFileChecksum(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex')
}

// Generate nama file aman untuk penyimpanan (UUID-based)
export function generateStorageFileName(originalName: string): string {
  const ext = originalName.split('.').pop()?.toLowerCase() ?? 'bin'
  const uuid = crypto.randomUUID()
  const timestamp = Date.now()
  return `${timestamp}_${uuid}.${ext}`
}
