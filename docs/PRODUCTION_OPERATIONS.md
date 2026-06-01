# Production Operations

## Required Environment

Set these in production before starting the app:

- `DATABASE_URL`
- `ADMIN_SESSION_SECRET`
- `ADMIN_BOOTSTRAP_EMAIL`
- `ADMIN_BOOTSTRAP_PASSWORD`
- `NIK_HASH_PEPPER`
- `LOG_INGEST_TOKEN`
- `LOG_SECRET`
- `PRIVATE_STORAGE_ROOT` or the complete `MINIO_*` group
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM` if email delivery is enabled

Use generated high-entropy values for secrets. Do not reuse development credentials.

## Apply Database Schema

Run from the repository root:

```sh
npm run db:apply
```

The schema is idempotent and applies `infra/db/schema.sql`.

## Notification Worker

Run once:

```sh
npm run notifications:worker
```

Dry-run mode marks eligible email notifications as sent without SMTP delivery:

```sh
NOTIFICATION_DRY_RUN=true npm run notifications:worker
```

PM2 example:

```sh
pm2 start "npm run notifications:worker" --name gianyar-notification-worker --cron "*/5 * * * *" --no-autorestart
```

Cron example:

```cron
*/5 * * * * cd /opt/gianyar-web && /usr/bin/npm run notifications:worker >> /var/log/gianyar/notification-worker.log 2>&1
```

Use a systemd timer with the same production env file if systemd is the standard process manager.

## Backup

Database:

```sh
pg_dump "$DATABASE_URL" --format=custom --file="/backups/gianyar-$(date +%F).dump"
```

Restore rehearsal:

```sh
pg_restore --clean --if-exists --dbname "$DATABASE_URL" /backups/gianyar-YYYY-MM-DD.dump
```

Private disk storage:

```sh
rsync -a --delete "$PRIVATE_STORAGE_ROOT/" /backups/gianyar-private-storage/
```

MinIO:

```sh
mc mirror --overwrite minio/gianyar-documents /backups/gianyar-documents
```

Keep database and document backups encrypted and access-controlled.

## Retention

- Application logs: keep 30-90 days, rotate daily, redact secrets and personal data.
- Audit logs: keep at least 1 year or per local compliance policy.
- Documents: retain only as long as required for service processing and legal obligations.
- Failed notifications: review and purge stale rows after operational retention expires.

## Smoke Tests

PostgreSQL integration:

```sh
npm run db:test:up
TEST_DATABASE_URL=postgres://gianyar_test:change-test-password@127.0.0.1:55432/gianyar_test npm test
npm run db:test:down
```

MinIO:

```sh
npm run smoke:minio
```

SMTP:

```sh
npm run smoke:smtp
```

MinIO and SMTP smoke scripts skip safely when their env groups are incomplete.

## Deployment Checklist

- Build uses production env and passes `npm run build`.
- Database schema applied.
- Admin bootstrap credentials rotated after first login.
- Postgres, Redis, MinIO, Mailhog/Adminer are not exposed to `0.0.0.0`.
- `PRIVATE_STORAGE_ROOT` is outside the web/public directory or MinIO bucket is private.
- Notification worker scheduled.
- Backups configured and restore tested.
- Monitoring checks `/api/health`.
- `npm audit --json` residual findings reviewed and documented.
