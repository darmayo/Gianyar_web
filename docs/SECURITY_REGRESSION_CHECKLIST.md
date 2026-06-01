# Security Regression Checklist

Use this before demo, staging, or production release.

- Tracking token is never placed in URL, query string, browser history, or logs.
- Status lookup requires ticket number and `x-tracking-token`.
- Tracking token is stored only as a hash and is shown once to the applicant.
- Documents are never returned with public URLs.
- Document upload validates MIME type, extension, size, and magic bytes.
- Document `storage_key` rejects absolute paths and `..` traversal.
- Document download requires admin/petugas permission `documents:read`.
- Every document upload/download writes `audit_logs`.
- Admin session cookie is `HttpOnly`, `SameSite=Lax`, and `Secure` in production.
- Role permissions are enforced for admin, operator, verifier, and viewer.
- Sensitive endpoints have rate limits: logs, pengajuan, status check, and document upload.
- `LOG_INGEST_TOKEN`, `LOG_SECRET`, `NIK_HASH_PEPPER`, and `ADMIN_SESSION_SECRET` are required in production.
- `/api/logs` read secret is accepted only through `x-log-read-token` or bearer authorization.
- NIK hash uses HMAC-SHA256 with `NIK_HASH_PEPPER`, not plain SHA-256.
- CSP production does not use `unsafe-eval`.
- SMTP worker does not log email body, NIK, tracking token, cookies, or secrets.
- `npm audit --json` residual Next/PostCSS finding is documented when no safe patch exists.
