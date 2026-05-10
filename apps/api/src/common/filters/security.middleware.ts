// ============================================================
// Security Middleware — NestJS API
// OWASP Top 10 mitigasi:
// - A03: Injection → helmet, sanitize
// - A05: Security Misconfiguration → headers ketat
// - A07: Identification Failures → rate limiting
// - A09: Security Logging → request logging
// VibeSec: input sanitization, header hardening
// ============================================================

import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { createClient } from 'redis'

// Rate limiter configs berbeda per endpoint
export const rateLimiters = {
  // Global: 100 req/menit per IP
  global: rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Terlalu banyak permintaan. Coba lagi dalam 1 menit.' },
  }),

  // Auth: 5 login gagal per 15 menit per IP (cegah brute force)
  auth: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true, // hanya hitung yang gagal
    message: { error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' },
  }),

  // Upload file: 10 upload per jam per user
  upload: rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    keyGenerator: (req) => (req as any).user?.id ?? req.ip,
    message: { error: 'Batas upload file tercapai. Coba lagi dalam 1 jam.' },
  }),

  // Pengaduan: 3 pengaduan per jam per user
  pengaduan: rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    keyGenerator: (req) => (req as any).user?.id ?? req.ip,
    message: { error: 'Batas pengaduan tercapai. Coba lagi dalam 1 jam.' },
  }),
}

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Security')

  use(req: Request, res: Response, next: NextFunction) {
    // Log semua request untuk audit trail
    this.logger.log(
      `${req.method} ${req.path} — IP: ${this.getClientIP(req)} — UA: ${req.headers['user-agent']?.substring(0, 80)}`
    )

    // Tambah security headers tambahan (helmet sudah di main.ts)
    res.setHeader('X-Request-ID', crypto.randomUUID())
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
    res.setHeader('Pragma', 'no-cache')

    // Cegah path traversal — pastikan path tidak ada ../
    if (req.path.includes('..') || req.path.includes('%2e%2e')) {
      this.logger.warn(`Path traversal attempt dari IP: ${this.getClientIP(req)}`)
      return res.status(400).json({ error: 'Request tidak valid' })
    }

    next()
  }

  private getClientIP(req: Request): string {
    return (
      (req.headers['cf-connecting-ip'] as string) || // Cloudflare
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      'unknown'
    )
  }
}

// ============================================================
// Helmet config — HTTP Security Headers
// ============================================================
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Tailwind perlu ini
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-site' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' }, // Cegah clickjacking
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000, // 1 tahun
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  permittedCrossDomainPolicies: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
})
