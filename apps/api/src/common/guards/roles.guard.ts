// ============================================================
// RBAC Guard — Role-Based Access Control
// OWASP A01: Broken Access Control — Mitigasi
// ============================================================

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '@prisma/client'

export const ROLES_KEY = 'roles'

const ROLE_HIERARCHY: Record<Role, number> = {
  WARGA: 0,
  OPERATOR: 1,
  ADMIN: 2,
  SUPER: 3,
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles || requiredRoles.length === 0) return true

    const { user } = context.switchToHttp().getRequest()

    if (!user) throw new ForbiddenException('Akses ditolak')

    const userLevel = ROLE_HIERARCHY[user.role as Role] ?? -1
    const requiredLevel = Math.min(...requiredRoles.map((r) => ROLE_HIERARCHY[r]))

    if (userLevel < requiredLevel) {
      throw new ForbiddenException(
        `Akses ditolak. Diperlukan role: ${requiredRoles.join(' atau ')}`
      )
    }

    return true
  }
}
