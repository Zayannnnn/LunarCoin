/**
 * Centralized environment configuration for LunarScan.
 */

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  },
  api: {
    baseUrl: (() => {
      const rawUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://lunar-backend-1mzo.onrender.com'
      const normalized = rawUrl.replace(/\/$/, '')
      if (!/^https:\/\//i.test(normalized)) {
        throw new Error('NEXT_PUBLIC_API_URL must use https://')
      }
      return normalized
    })(),
    wsUrl: (() => {
      const rawWsUrl = process.env.NEXT_PUBLIC_WS_URL ?? 'wss://lunar-backend-1mzo.onrender.com'
      if (!/^wss:\/\//i.test(rawWsUrl)) {
        throw new Error('NEXT_PUBLIC_WS_URL must use wss://')
      }
      return rawWsUrl
    })(),
    /** Use mock generators when backend is unavailable (dev only) */
    useMock: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true',
    /** Request timeout in ms */
    timeoutMs: Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 15000),
    /** Max retry attempts for failed requests */
    maxRetries: Number(process.env.NEXT_PUBLIC_API_MAX_RETRIES ?? 3),
    /** Base delay for exponential backoff (ms) */
    retryDelayMs: Number(process.env.NEXT_PUBLIC_API_RETRY_DELAY_MS ?? 1000),
  },
  auth: {
    redirectUrl:
      process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
      (process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')}/auth/callback`
        : typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : ''),
  },
} as const

export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabase.url && env.supabase.anonKey)
}

export function isApiConfigured(): boolean {
  return Boolean(env.api.baseUrl)
}

export function assertSupabaseEnv(): void {
  requireEnv('NEXT_PUBLIC_SUPABASE_URL', env.supabase.url)
  requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', env.supabase.anonKey)
}
