import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import pg from 'pg'

const databaseUrl = process.env.TEST_DATABASE_URL
const root = process.cwd()

test('postgres pengajuan persistence creates related operational rows', { skip: !databaseUrl }, async () => {
  const client = new pg.Client({ connectionString: databaseUrl })
  const ids = {
    pengajuan: randomUUID(),
    history: randomUUID(),
    audit: randomUUID(),
    uploadAudit: randomUUID(),
    downloadAudit: randomUUID(),
    dokumen: randomUUID(),
    notification: randomUUID(),
    failedNotification: randomUUID(),
    adminUser: randomUUID(),
    viewerUser: randomUUID(),
  }

  await client.connect()
  try {
    const schema = readFileSync(join(root, '../../infra/db/schema.sql'), 'utf8')
    await client.query(schema)

    await client.query('begin')
    const roles = await client.query('select id, name from roles')
    const roleId = new Map(roles.rows.map((row) => [row.name, row.id]))
    await client.query(
      `insert into users (id, email, name, password_hash, role_id)
       values ($1,'admin-test@example.invalid','Admin Test','pbkdf2_sha256$test$test',$2),
              ($3,'viewer-test@example.invalid','Viewer Test','pbkdf2_sha256$test$test',$4)`,
      [ids.adminUser, roleId.get('ADMIN'), ids.viewerUser, roleId.get('VIEWER')]
    )
    await client.query(
      `insert into pengajuan (
        id, nomor_tiket, tracking_token_hash, jenis_layanan, status,
        nama_submitter, kontak_submitter, data_formulir_masked, deadline_at
      ) values ($1,$2,$3,'KTP','DIAJUKAN','N***','081234567890',$4,now() + interval '5 days')`,
      [ids.pengajuan, `KTP-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`, 'hash-test', JSON.stringify({ namaLengkap: 'N***' })]
    )
    await client.query(
      `insert into status_history (id, pengajuan_id, from_status, to_status, note)
       values ($1,$2,null,'DIAJUKAN','Pengajuan diterima')`,
      [ids.history, ids.pengajuan]
    )
    await client.query(
      `insert into audit_logs (id, action, entity_type, entity_id, metadata)
       values ($1,'PENGAJUAN_CREATED','pengajuan',$2,$3)`,
      [ids.audit, ids.pengajuan, JSON.stringify({ test: true })]
    )
    await client.query(
      `insert into dokumen (id, pengajuan_id, original_name, storage_key, storage_provider, mime_type, size_bytes, checksum_sha256)
       values ($1,$2,'ktp.pdf',$3,'LOCAL','application/pdf',12,$4)`,
      [ids.dokumen, ids.pengajuan, `pengajuan/${ids.pengajuan}/ktp.pdf`, 'a'.repeat(64)]
    )
    await client.query(
      `insert into audit_logs (id, action, entity_type, entity_id, metadata)
       values ($1,'DOCUMENT_UPLOADED','dokumen',$2,$3),
              ($4,'DOCUMENT_OPENED','dokumen',$2,$5)`,
      [
        ids.uploadAudit,
        ids.dokumen,
        JSON.stringify({ pengajuanId: ids.pengajuan, mimeType: 'application/pdf', sizeBytes: 12 }),
        ids.downloadAudit,
        JSON.stringify({ provider: 'LOCAL', sizeBytes: 12 }),
      ]
    )
    await client.query(
      `insert into notifications (id, pengajuan_id, channel, recipient, subject, body, retry_count)
       values ($1,$2,'EMAIL','test@example.invalid','Subjek','Isi',0)`,
      [ids.notification, ids.pengajuan]
    )
    await client.query(
      `insert into notifications (id, pengajuan_id, channel, recipient, subject, body, retry_count)
       values ($1,$2,'WHATSAPP','628123456789','Subjek','Isi',0)`,
      [ids.failedNotification, ids.pengajuan]
    )

    const worker = spawnSync(process.execPath, ['scripts/notification-worker.mjs'], {
      cwd: root,
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
        NOTIFICATION_DRY_RUN: 'true',
        NOTIFICATION_WORKER_BATCH: '10',
      },
      encoding: 'utf8',
    })
    assert.equal(worker.status, 0, worker.stderr)

    const result = await client.query(
      `select
        (select count(*)::int from status_history where pengajuan_id = $1) as history_count,
        (select count(*)::int from audit_logs where entity_type = 'pengajuan' and entity_id = $1) as audit_count,
        (select count(*)::int from dokumen where pengajuan_id = $1) as document_count,
        (select count(*)::int from audit_logs where entity_type = 'dokumen' and entity_id = $2 and action = 'DOCUMENT_UPLOADED') as upload_audit_count,
        (select count(*)::int from audit_logs where entity_type = 'dokumen' and entity_id = $2 and action = 'DOCUMENT_OPENED') as download_audit_count,
        (select count(*)::int from notifications where pengajuan_id = $1) as notification_count,
        (select status from notifications where id = $3) as email_status,
        (select sent_at is not null from notifications where id = $3) as email_sent_at_set,
        (select status from notifications where id = $4) as failed_status,
        (select retry_count from notifications where id = $4) as failed_retry_count,
        (select last_error is not null from notifications where id = $4) as failed_last_error_set`,
      [ids.pengajuan, ids.dokumen, ids.notification, ids.failedNotification]
    )

    assert.equal(result.rows[0].history_count, 1)
    assert.equal(result.rows[0].audit_count, 1)
    assert.equal(result.rows[0].document_count, 1)
    assert.equal(result.rows[0].upload_audit_count, 1)
    assert.equal(result.rows[0].download_audit_count, 1)
    assert.equal(result.rows[0].notification_count, 2)
    assert.equal(result.rows[0].email_status, 'SENT')
    assert.equal(result.rows[0].email_sent_at_set, true)
    assert.equal(result.rows[0].failed_status, 'FAILED')
    assert.equal(result.rows[0].failed_retry_count, 1)
    assert.equal(result.rows[0].failed_last_error_set, true)
    await client.query('rollback')
  } finally {
    await client.end()
  }
})
