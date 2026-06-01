const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'pdf'])
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export function validateClientDocuments(files: File[], maxFiles: number) {
  if (files.length > maxFiles) return `Maksimal ${maxFiles} file lampiran`

  for (const file of files) {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_MIME_TYPES.has(file.type)) {
      return 'Format dokumen tidak didukung'
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return 'Ukuran file maksimal 10 MB'
    }
  }

  return null
}

export async function uploadPengajuanDocuments(nomorTiket: string, trackingToken: string, files: File[]) {
  for (const file of files) {
    const body = new FormData()
    body.append('tiket', nomorTiket)
    body.append('file', file)

    const res = await fetch('/api/pengajuan/dokumen', {
      method: 'POST',
      headers: { 'x-tracking-token': trackingToken },
      body,
    })

    if (!res.ok) {
      const result = await res.json().catch(() => ({}))
      throw new Error(result.error ?? 'Upload dokumen gagal')
    }
  }
}
