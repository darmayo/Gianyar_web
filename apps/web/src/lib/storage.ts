import { createHash, randomUUID } from 'crypto'
import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const ALLOWED_TYPES = new Map([
  ['image/jpeg', ['.jpg', '.jpeg']],
  ['image/png', ['.png']],
  ['image/webp', ['.webp']],
  ['application/pdf', ['.pdf']],
])

export interface StoredDocument {
  originalName: string
  storageKey: string
  storageProvider: StorageProvider
  mimeType: string
  sizeBytes: number
  checksumSha256: string
}

export type StorageProvider = 'LOCAL' | 'MINIO'

type MinioConfig = {
  endpoint: string
  bucket: string
  accessKeyId: string
  secretAccessKey: string
  region: string
}

function normalizeEndpoint(endpoint: string) {
  const withScheme = /^https?:\/\//.test(endpoint) ? endpoint : `http://${endpoint}`
  const url = new URL(withScheme)
  if (!url.port && process.env.MINIO_PORT) url.port = process.env.MINIO_PORT
  return url.toString().replace(/\/$/, '')
}

function getMinioConfig(): MinioConfig | null {
  const endpoint = process.env.MINIO_ENDPOINT ?? process.env.S3_ENDPOINT
  const bucket = process.env.MINIO_BUCKET ?? process.env.MINIO_BUCKET_DOCS ?? process.env.S3_BUCKET
  const accessKeyId = process.env.MINIO_ACCESS_KEY ?? process.env.S3_ACCESS_KEY_ID
  const secretAccessKey = process.env.MINIO_SECRET_KEY ?? process.env.S3_SECRET_ACCESS_KEY
  const region = process.env.MINIO_REGION ?? process.env.S3_REGION ?? 'us-east-1'
  const provided = [endpoint, bucket, accessKeyId, secretAccessKey].filter(Boolean).length

  if (provided === 0) return null
  if (provided !== 4) throw new Error('Konfigurasi MinIO storage belum lengkap')

  return { endpoint: normalizeEndpoint(endpoint!), bucket: bucket!, accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey!, region }
}

function minioClient(config: MinioConfig) {
  return new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })
}

export function getStorageProvider(): StorageProvider {
  return getMinioConfig() ? 'MINIO' : 'LOCAL'
}

export function getPrivateStorageRoot() {
  const root = process.env.PRIVATE_STORAGE_ROOT
  if (root) return root
  if (process.env.NODE_ENV === 'production') {
    throw new Error('PRIVATE_STORAGE_ROOT is required in production')
  }
  return path.join(process.cwd(), '.data', 'private-storage')
}

export function sanitizeFileName(name: string) {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120)
  return base || 'document'
}

export function validateDocumentMeta(name: string, type: string, size: number) {
  const ext = path.extname(name).toLowerCase()
  const allowedExt = ALLOWED_TYPES.get(type)
  if (!allowedExt || !allowedExt.includes(ext)) {
    throw new Error('Tipe atau ekstensi file tidak diizinkan')
  }
  if (!Number.isFinite(size) || size <= 0 || size > MAX_FILE_SIZE) {
    throw new Error('Ukuran file tidak valid')
  }
}

function assertMagic(buffer: Buffer, type: string) {
  if (type === 'application/pdf' && buffer.subarray(0, 4).toString('ascii') !== '%PDF') {
    throw new Error('Signature PDF tidak valid')
  }
  if (type === 'image/png' && buffer.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    throw new Error('Signature PNG tidak valid')
  }
  if (type === 'image/jpeg' && !(buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff)) {
    throw new Error('Signature JPEG tidak valid')
  }
  if (type === 'image/webp' && !(buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP')) {
    throw new Error('Signature WebP tidak valid')
  }
}

function validateStorageKey(storageKey: string) {
  if (storageKey.includes('..') || storageKey.startsWith('/') || storageKey.startsWith('\\') || path.isAbsolute(storageKey)) {
    throw new Error('Storage key tidak valid')
  }
}

export function resolveStoragePath(storageKey: string) {
  validateStorageKey(storageKey)
  const root = path.resolve(getPrivateStorageRoot())
  const fullPath = path.resolve(root, storageKey)
  if (!fullPath.startsWith(root + path.sep)) {
    throw new Error('Storage key tidak valid')
  }
  return fullPath
}

export async function storePrivateDocument(file: File, pengajuanId: string): Promise<StoredDocument> {
  validateDocumentMeta(file.name, file.type, file.size)
  const buffer = Buffer.from(await file.arrayBuffer())
  assertMagic(buffer, file.type)

  const safeName = sanitizeFileName(file.name)
  const storageKey = path.posix.join('pengajuan', pengajuanId, `${randomUUID()}-${safeName}`)
  const checksumSha256 = createHash('sha256').update(buffer).digest('hex')
  const minio = getMinioConfig()

  if (minio) {
    validateStorageKey(storageKey)
    await minioClient(minio).send(new PutObjectCommand({
      Bucket: minio.bucket,
      Key: storageKey,
      Body: buffer,
      ContentType: file.type,
    }))

    return {
      originalName: safeName,
      storageKey,
      storageProvider: 'MINIO',
      mimeType: file.type,
      sizeBytes: file.size,
      checksumSha256,
    }
  }

  const fullPath = resolveStoragePath(storageKey)
  await mkdir(path.dirname(fullPath), { recursive: true })
  await writeFile(fullPath, buffer, { flag: 'wx' })

  return {
    originalName: safeName,
    storageKey,
    storageProvider: 'LOCAL',
    mimeType: file.type,
    sizeBytes: file.size,
    checksumSha256,
  }
}

export async function readPrivateDocument(storageKey: string, storageProvider: StorageProvider = getStorageProvider()) {
  if (storageProvider === 'MINIO') {
    const minio = getMinioConfig()
    if (!minio) throw new Error('Konfigurasi MinIO storage belum lengkap')
    validateStorageKey(storageKey)
    const response = await minioClient(minio).send(new GetObjectCommand({
      Bucket: minio.bucket,
      Key: storageKey,
    }))
    if (!response.Body) throw new Error('File dokumen tidak tersedia')
    const body = response.Body as { transformToByteArray?: () => Promise<Uint8Array> } & AsyncIterable<Uint8Array>
    if (body.transformToByteArray) return Buffer.from(await body.transformToByteArray())
    const chunks: Uint8Array[] = []
    for await (const chunk of body) chunks.push(chunk)
    return Buffer.concat(chunks)
  }
  return readFile(resolveStoragePath(storageKey))
}

export async function checkPrivateStorageHealth() {
  const minio = getMinioConfig()
  if (minio) {
    await minioClient(minio).send(new PutObjectCommand({
      Bucket: minio.bucket,
      Key: '.healthcheck',
      Body: Buffer.from('ok'),
      ContentType: 'text/plain',
    }))
    return { provider: 'MINIO' as const }
  }

  const root = getPrivateStorageRoot()
  await mkdir(root, { recursive: true })
  const marker = path.join(root, '.storage-health')
  await readFile(marker).catch(async () => {
    await writeFile(marker, 'ok')
  })
  return { provider: 'LOCAL' as const }
}
