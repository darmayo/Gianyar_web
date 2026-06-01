import { randomUUID } from 'node:crypto'
import process from 'node:process'
import {
  DeleteObjectCommand,
  GetBucketPolicyStatusCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

const endpoint = process.env.MINIO_ENDPOINT ?? process.env.S3_ENDPOINT
const bucket = process.env.MINIO_BUCKET ?? process.env.MINIO_BUCKET_DOCS ?? process.env.S3_BUCKET
const accessKeyId = process.env.MINIO_ACCESS_KEY ?? process.env.S3_ACCESS_KEY_ID
const secretAccessKey = process.env.MINIO_SECRET_KEY ?? process.env.S3_SECRET_ACCESS_KEY
const region = process.env.MINIO_REGION ?? process.env.S3_REGION ?? 'us-east-1'

function normalizeEndpoint(value) {
  const withScheme = /^https?:\/\//.test(value) ? value : `http://${value}`
  const url = new URL(withScheme)
  if (!url.port && process.env.MINIO_PORT) url.port = process.env.MINIO_PORT
  return url.toString().replace(/\/$/, '')
}

function assertSafeStorageKey(key) {
  if (key.includes('..') || key.startsWith('/') || key.startsWith('\\')) {
    throw new Error('unsafe storage key rejected')
  }
}

if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
  console.log('[minio-smoke] skipped: MINIO/S3 env is not complete')
  process.exit(0)
}

const client = new S3Client({
  endpoint: normalizeEndpoint(endpoint),
  region,
  forcePathStyle: true,
  credentials: { accessKeyId, secretAccessKey },
})

const key = `smoke/${randomUUID()}.txt`
assertSafeStorageKey(key)

try {
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: Buffer.from('ok'),
    ContentType: 'text/plain',
  }))
  await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
  const object = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
  const bytes = await object.Body.transformToByteArray()
  if (Buffer.from(bytes).toString('utf8') !== 'ok') throw new Error('downloaded object mismatch')

  let publicStatus = 'unknown'
  try {
    const policy = await client.send(new GetBucketPolicyStatusCommand({ Bucket: bucket }))
    publicStatus = policy.PolicyStatus?.IsPublic ? 'public' : 'private'
  } catch {
    publicStatus = 'not-public-by-policy-status-unavailable'
  }

  if (publicStatus === 'public') throw new Error('bucket policy is public')
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
  console.log(`[minio-smoke] ok provider=MINIO bucketPolicy=${publicStatus}`)
} catch (err) {
  try {
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
  } catch {}
  console.error('[minio-smoke] failed:', err instanceof Error ? err.message : 'unknown error')
  process.exit(1)
}
