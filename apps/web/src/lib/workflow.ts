export const PENGAJUAN_STATUSES = [
  'DIAJUKAN',
  'MENUNGGU_VERIFIKASI',
  'PERLU_REVISI',
  'DIPROSES',
  'SELESAI',
  'DITOLAK',
] as const

export type PengajuanStatus = typeof PENGAJUAN_STATUSES[number]

export const ROLE_PERMISSIONS = {
  ADMIN: ['users:manage', 'pengajuan:read', 'pengajuan:update', 'pengajuan:assign', 'comments:write', 'documents:read', 'reports:export'],
  OPERATOR: ['pengajuan:read', 'pengajuan:update', 'pengajuan:assign', 'comments:write', 'documents:read', 'reports:export'],
  VERIFIKATOR: ['pengajuan:read', 'pengajuan:update', 'comments:write', 'documents:read'],
  VIEWER: ['pengajuan:read', 'reports:export'],
} as const

export type RoleName = keyof typeof ROLE_PERMISSIONS
export type Permission = typeof ROLE_PERMISSIONS[RoleName][number]

export function hasPermission(role: RoleName, permission: Permission) {
  return (ROLE_PERMISSIONS[role] as readonly string[]).includes(permission)
}

export function mapLegacyStatus(status: string): PengajuanStatus {
  if (status === 'PENDING') return 'DIAJUKAN'
  if (status === 'DIVERIFIKASI') return 'MENUNGGU_VERIFIKASI'
  if (status === 'DIPROSES') return 'DIPROSES'
  if (status === 'SELESAI') return 'SELESAI'
  if (status === 'DITOLAK') return 'DITOLAK'
  return PENGAJUAN_STATUSES.includes(status as PengajuanStatus) ? status as PengajuanStatus : 'DIAJUKAN'
}
