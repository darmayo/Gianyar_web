// ============================================================
// Barrel export — import dari satu tempat
//
// import { logger, createLogger, logApiError, log404 } from '@/lib/logging'
// ============================================================

export {
  logger,
  createLogger,
  logApiError,
  log404,
  logRedirect,
  type LogLevel,
  type LogEntry,
} from './app-logger'

// Server-side logger (hanya untuk Server Components & API Routes)
// Import langsung dari './server-logger' untuk tree-shaking yang lebih baik
