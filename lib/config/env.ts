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
    get baseUrl(): string {
      if (typeof window !== 'undefined') {
        if ((window as any).__lunarActiveBaseUrl) {
          return (window as any).__lunarActiveBaseUrl
        }
        if ((window as any).lunarDesktop) {
          return ((window as any).lunarDesktop.backendUrl || 'http://127.0.0.1:5000').replace(/\/$/, '')
        }
      }
      const rawUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:5000'
      const normalized = rawUrl.replace(/\/$/, '')
      if (!/^https?:\/\//i.test(normalized)) {
        throw new Error('NEXT_PUBLIC_API_URL must use http:// or https://')
      }
      return normalized
    },
    get wsUrl(): string {
      if (typeof window !== 'undefined' && (window as any).lunarDesktop) {
        return 'ws://127.0.0.1:5000'
      }
      const rawWsUrl = process.env.NEXT_PUBLIC_WS_URL ?? ''
      if (rawWsUrl && !/^wss?:\/\//i.test(rawWsUrl)) {
        throw new Error('NEXT_PUBLIC_WS_URL must use ws:// or wss://')
      }
      return rawWsUrl
    },
    /** Use mock generators when backend is unavailable (dev only) */
    useMock: false,
    /** Request timeout in ms */
    timeoutMs: Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 5000),
    /** Max retry attempts for failed requests */
    maxRetries: Number(process.env.NEXT_PUBLIC_API_MAX_RETRIES ?? 1),
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
