# Security Notes

## npm audit status

- `tmp` path traversal advisory is mitigated with the root `overrides.tmp = 0.2.6`; this updates the `patch-package` transitive dependency without changing application behavior.
- The remaining audit finding is `postcss < 8.5.10` through `next@16.2.6`. The latest stable Next package currently pins `postcss@8.4.31`; npm's suggested fix downgrades Next to an incompatible major version, so it is not applied.
- Mitigation while waiting for a patched stable Next release: the app does not expose an API that stringifies attacker-controlled CSS, CSP has been tightened for production by removing `unsafe-eval`, and custom inline bootstrap JavaScript was moved to `/js/bootstrap.js`.

Review this note when upgrading Next. If a patched stable Next release is available, prefer that over a canary release for production.

## CSP status

- Production CSP does not allow `unsafe-eval`.
- The remaining inline script is static JSON-LD in the root layout. It contains only hard-coded organization metadata, not user input. A nonce/hash-based CSP for this JSON-LD would require request-scoped header plumbing, so it is documented as residual low risk for now rather than patched in this small security pass.

## Operations checklist

- Apply `infra/db/schema.sql` before enabling production traffic.
- Run `npm run db:apply` with `DATABASE_URL` set during deployment to apply the idempotent schema.
- For local PostgreSQL integration checks, run `npm run db:test:up`, set `TEST_DATABASE_URL=postgres://gianyar_test:change-test-password@127.0.0.1:55432/gianyar_test`, then run `npm test`. Stop it with `npm run db:test:down`.
- Set `DATABASE_URL`, `ADMIN_SESSION_SECRET`, `ADMIN_BOOTSTRAP_EMAIL`, and `ADMIN_BOOTSTRAP_PASSWORD`; remove or rotate the bootstrap password after creating named admin users.
- Back up PostgreSQL at least daily with point-in-time recovery where available. Keep restore tests on the release checklist.
- Keep private documents outside `public/` and never return direct public URLs. Use `PRIVATE_STORAGE_ROOT` for local private disk, or set the full `MINIO_*` env group for S3-compatible private object storage. Document access must go through authenticated admin routes so `DOCUMENT_OPENED` audit logs are written.
- Retain application logs for 90 days unless legal requirements demand longer retention. Do not log NIK, tracking tokens, cookies, authorization headers, or document contents.
- Notification rows in `notifications` are a durable outbox. A separate worker can send email/WhatsApp and update `status` to `SENT` or `FAILED`.
- Run `npm run notifications:worker` on a schedule. Without SMTP env it marks rows as `FAILED` with a non-sensitive `last_error`; with SMTP env it sends email and sets `sent_at`.
- See `docs/PRODUCTION_OPERATIONS.md` for deployment, backup, worker scheduling, retention, and smoke-test procedures.
- See `docs/SECURITY_REGRESSION_CHECKLIST.md` before each demo, staging, or production release.
