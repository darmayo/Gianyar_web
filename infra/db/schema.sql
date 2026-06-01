-- Production persistence schema for Gianyar Web.
-- Apply with: psql "$DATABASE_URL" -f infra/db/schema.sql

create table if not exists roles (
  id bigserial primary key,
  name text not null unique check (name in ('ADMIN', 'OPERATOR', 'VERIFIKATOR', 'VIEWER')),
  description text
);

insert into roles (name, description) values
  ('ADMIN', 'Kelola user dan seluruh data'),
  ('OPERATOR', 'Memproses pengajuan dan assign petugas'),
  ('VERIFIKATOR', 'Verifikasi berkas dan status'),
  ('VIEWER', 'Read-only audit dan laporan')
on conflict (name) do nothing;

create table if not exists users (
  id uuid primary key,
  email text not null unique,
  name text not null,
  password_hash text not null,
  role_id bigint not null references roles(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists pengajuan (
  id uuid primary key,
  nomor_tiket text not null unique,
  tracking_token_hash text not null,
  jenis_layanan text not null,
  status text not null check (status in ('DIAJUKAN', 'MENUNGGU_VERIFIKASI', 'PERLU_REVISI', 'DIPROSES', 'SELESAI', 'DITOLAK')),
  prioritas text not null default 'NORMAL' check (prioritas in ('RENDAH', 'NORMAL', 'TINGGI', 'DARURAT')),
  nama_submitter text not null,
  kontak_submitter text not null,
  data_formulir_masked jsonb not null default '{}'::jsonb,
  nik_hash text,
  deadline_at timestamptz not null,
  assigned_to uuid references users(id),
  rejection_reason text,
  revision_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists dokumen (
  id uuid primary key,
  pengajuan_id uuid not null references pengajuan(id) on delete cascade,
  original_name text not null,
  storage_key text not null,
  storage_provider text not null default 'LOCAL',
  mime_type text not null,
  size_bytes integer not null check (size_bytes > 0),
  checksum_sha256 text,
  uploaded_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table if not exists status_history (
  id uuid primary key,
  pengajuan_id uuid not null references pengajuan(id) on delete cascade,
  from_status text,
  to_status text not null,
  note text,
  actor_user_id uuid references users(id),
  created_at timestamptz not null default now()
);

create table if not exists internal_comments (
  id uuid primary key,
  pengajuan_id uuid not null references pengajuan(id) on delete cascade,
  actor_user_id uuid not null references users(id),
  comment text not null,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key,
  actor_user_id uuid references users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  ip_address text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key,
  pengajuan_id uuid references pengajuan(id) on delete cascade,
  channel text not null check (channel in ('EMAIL', 'WHATSAPP', 'IN_APP')),
  recipient text not null,
  subject text not null,
  body text not null,
  status text not null default 'PENDING' check (status in ('PENDING', 'SENT', 'FAILED')),
  error_message text,
  retry_count integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

alter table dokumen add column if not exists storage_provider text not null default 'LOCAL';
alter table dokumen add column if not exists checksum_sha256 text;
alter table notifications add column if not exists retry_count integer not null default 0;
alter table notifications add column if not exists last_error text;

create index if not exists idx_pengajuan_status on pengajuan(status);
create index if not exists idx_pengajuan_layanan on pengajuan(jenis_layanan);
create index if not exists idx_pengajuan_created_at on pengajuan(created_at);
create index if not exists idx_status_history_pengajuan on status_history(pengajuan_id, created_at desc);
create index if not exists idx_audit_logs_entity on audit_logs(entity_type, entity_id, created_at desc);
