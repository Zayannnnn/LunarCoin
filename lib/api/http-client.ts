import { env } from '@/lib/config/env'
import { ApiError } from '@/lib/api/errors'

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>
  timeoutMs?: number
  retries?: number
  retryDelayMs?: number
}

function buildUrl(path: string, params?: RequestOptions['params']): string {
  const base = env.api.baseUrl
  const url = path.startsWith('http') ? path : `${base}${path}`
  if (!params) return url

  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      search.set(key, String(value))
    }
  }
  const qs = search.toString()
  return qs ? `${url}?${qs}` : url
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function parseErrorResponse(response: Response): Promise<ApiError> {
  let message = `Request failed with status ${response.status}`
  let details: unknown

  try {
    const body = await response.json()
    message = body.message ?? body.error ?? message
    details = body
  } catch {
    try {
      message = await response.text()
    } catch {
      /* ignore */
    }
  }

  return new ApiError(message, {
    status: response.status,
    code: response.status === 404 ? 'NOT_FOUND' : 'HTTP_ERROR',
    details,
  })
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    params,
    timeoutMs = env.api.timeoutMs,
    retries = env.api.maxRetries,
    retryDelayMs = env.api.retryDelayMs,
    headers,
    ...init
  } = options

  const url = buildUrl(path, params)
  let lastError: ApiError | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await parseErrorResponse(response)
        if (error.isRetryable && attempt < retries) {
          lastError = error
          await sleep(retryDelayMs * Math.pow(2, attempt))
          continue
        }
        throw error
      }

      if (response.status === 204) {
        return undefined as T
      }

      return (await response.json()) as T
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiError) {
        if (error.isRetryable && attempt < retries) {
          lastError = error
          await sleep(retryDelayMs * Math.pow(2, attempt))
          continue
        }
        throw error
      }

      const isAbort = error instanceof DOMException && error.name === 'AbortError'
      const apiError = new ApiError(
        isAbort ? 'Request timed out' : 'Network request failed',
        { status: 0, code: isAbort ? 'TIMEOUT' : 'NETWORK_ERROR', details: error }
      )

      if (attempt < retries) {
        lastError = apiError
        await sleep(retryDelayMs * Math.pow(2, attempt))
        continue
      }

      if (env.api.useMock) {
        // Backend appears unavailable — fall back to mock API consumers.
        console.warn('Backend unavailable — using mock API')
        return null as unknown as T
      }

      throw apiError
    }
  }

  throw lastError ?? new ApiError('Request failed after retries')
}

export function apiGet<T>(path: string, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...options, method: 'GET' })
}
