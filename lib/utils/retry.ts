/**
 * 通用重试工具 — 指数退避，针对 API 限流和临时故障
 */

export interface RetryOptions {
  maxRetries?: number;       // 最大重试次数，默认 3
  baseDelayMs?: number;      // 基础延迟，默认 1000ms
  maxDelayMs?: number;       // 最大延迟，默认 15000ms
  retryOn?: (error: any) => boolean;  // 自定义判断是否应该重试
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 15000,
  retryOn: defaultShouldRetry,
};

/**
 * 默认重试判断：429 限流、5xx 服务端错误、网络错误
 */
function defaultShouldRetry(error: any): boolean {
  const message = (error?.message || '').toLowerCase();
  const status = error?.status || error?.statusCode || 0;

  // HTTP 429 (rate limit) or 5xx (server error)
  if (status === 429 || (status >= 500 && status < 600)) return true;

  // Fetch/network errors
  if (message.includes('fetch failed')) return true;
  if (message.includes('econnreset')) return true;
  if (message.includes('etimedout')) return true;
  if (message.includes('socket hang up')) return true;
  if (message.includes('network')) return true;

  // Qwen/DashScope specific
  if (message.includes('rate limit')) return true;
  if (message.includes('too many requests')) return true;
  if (message.includes('server error')) return true;
  if (message.includes('status 429')) return true;
  if (message.includes('status 500')) return true;
  if (message.includes('status 502')) return true;
  if (message.includes('status 503')) return true;
  if (message.includes('status 504')) return true;

  return false;
}

/**
 * 带指数退避的重试执行器
 *
 * Usage:
 *   const result = await withRetry(() => someApiCall(), { maxRetries: 3 });
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      if (attempt >= opts.maxRetries || !opts.retryOn(error)) {
        throw error;
      }

      // Exponential backoff with jitter
      const delay = Math.min(
        opts.baseDelayMs * Math.pow(2, attempt) + Math.random() * 500,
        opts.maxDelayMs
      );

      console.warn(
        `   ⚠️  Retry ${attempt + 1}/${opts.maxRetries} after ${Math.round(delay)}ms: ${error.message?.substring(0, 80) || 'Unknown error'}`
      );

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
