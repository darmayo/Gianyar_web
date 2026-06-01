import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const read = (path) => readFileSync(join(root, path), 'utf8')

test('pengajuan status requires tracking token header, not query string', () => {
  const api = read('src/app/api/pengajuan/route.ts')
  const page = read('src/app/pengaduan/cek/page.tsx')
  assert.match(api, /req\.headers\.get\('x-tracking-token'\)/)
  assert.doesNotMatch(api, /searchParams\.get\('token'\)/)
  assert.doesNotMatch(page, /token=/)
  assert.match(page, /'x-tracking-token': token/)
})

test('production NIK pepper does not fall back to encryption key', () => {
  for (const file of ['src/app/api/pengajuan/route.ts', 'src/app/api/cek-bansos/route.ts']) {
    const source = read(file)
    const productionBranch = source.slice(source.indexOf("process.env.NODE_ENV === 'production'"), source.indexOf('const pepper = process.env.NIK_HASH_PEPPER ?? process.env.NIK_ENCRYPTION_KEY'))
    assert.match(productionBranch, /process\.env\.NIK_HASH_PEPPER/)
    assert.doesNotMatch(productionBranch, /NIK_ENCRYPTION_KEY/)
  }
})

test('LOG_SECRET is accepted only through headers', () => {
  const logs = read('src/app/api/logs/route.ts')
  assert.match(logs, /x-log-read-token/)
  assert.match(logs, /getBearerToken/)
  assert.doesNotMatch(logs, /searchParams\.get\('secret'\)/)
})

test('workflow, audit, document validation, and role permissions exist', () => {
  const workflow = read('src/lib/workflow.ts')
  const adminRoute = read('src/app/api/admin/pengajuan/[id]/route.ts')
  const pengajuanRoute = read('src/app/api/pengajuan/route.ts')

  for (const status of ['DIAJUKAN', 'MENUNGGU_VERIFIKASI', 'PERLU_REVISI', 'DIPROSES', 'SELESAI', 'DITOLAK']) {
    assert.match(workflow, new RegExp(status))
  }
  for (const role of ['ADMIN', 'OPERATOR', 'VERIFIKATOR', 'VIEWER']) {
    assert.match(workflow, new RegExp(role))
  }
  assert.match(adminRoute, /insert into audit_logs/)
  assert.match(adminRoute, /insert into status_history/)
  assert.match(pengajuanRoute, /documentMetaSchema/)
})

test('private document upload and download controls are enforced', () => {
  const uploadRoute = read('src/app/api/pengajuan/dokumen/route.ts')
  const downloadRoute = read('src/app/api/admin/dokumen/[id]/route.ts')
  const storage = read('src/lib/storage.ts')
  const clientUpload = read('src/lib/document-upload-client.ts')

  assert.match(uploadRoute, /req\.headers\.get\('x-tracking-token'\)/)
  assert.doesNotMatch(uploadRoute, /searchParams\.get\('token'\)/)
  assert.match(uploadRoute, /insert into dokumen/)
  assert.match(uploadRoute, /DOCUMENT_UPLOADED/)
  assert.doesNotMatch(uploadRoute, /publicUrl|public_url/)
  assert.match(downloadRoute, /requireAdmin\(req, 'documents:read'\)/)
  assert.match(downloadRoute, /DOCUMENT_OPENED/)
  assert.match(downloadRoute, /readPrivateDocument/)
  assert.doesNotMatch(downloadRoute, /storage_key.*metadata/)
  assert.match(storage, /PRIVATE_STORAGE_ROOT is required in production/)
  assert.match(storage, /MINIO_BUCKET_DOCS/)
  assert.match(storage, /PutObjectCommand/)
  assert.match(storage, /GetObjectCommand/)
  assert.match(storage, /path\.isAbsolute/)
  assert.match(storage, /\.\./)
  assert.match(clientUpload, /FormData/)
  assert.match(clientUpload, /x-tracking-token/)
})

test('notification worker and deployment helper are wired', () => {
  const rootPackage = read('../../package.json')
  const worker = read('scripts/notification-worker.mjs')
  const schema = read('../../infra/db/schema.sql')
  const env = read('../../.env.example')
  const notes = read('../../SECURITY_NOTES.md')

  assert.match(rootPackage, /"db:apply"/)
  assert.match(rootPackage, /"notifications:worker"/)
  assert.match(worker, /retry_count/)
  assert.match(worker, /last_error/)
  assert.match(worker, /sent_at/)
  assert.doesNotMatch(worker, /console\.log\(.*recipient|console\.log\(.*body/)
  assert.match(schema, /retry_count/)
  assert.match(schema, /last_error/)
  assert.match(schema, /storage_provider/)
  assert.match(env, /SMTP_HOST/)
  assert.match(env, /PRIVATE_STORAGE_ROOT/)
  assert.match(notes, /npm run db:apply/)
})
