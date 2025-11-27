/**
 * OpenAI SDK 客户端封装（兼容 DashScope/Qwen API）
 */

import OpenAI from 'openai';

/**
 * Get OpenAI client instance (lazy initialization)
 * This allows the module to be imported even if QWEN_API_KEY is not set
 */
function getClient(): OpenAI {
  if (!process.env.QWEN_API_KEY) {
    throw new Error(
      'QWEN_API_KEY is not set. Please set it in your .env file or environment variables.'
    );
  }

  return new OpenAI({
    apiKey: process.env.QWEN_API_KEY,
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  });
}

// Singleton instance
let _openai: OpenAI | null = null;

/**
 * OpenAI 客户端实例，配置为使用阿里云 DashScope 兼容接口
 */
export const openai = new Proxy({} as OpenAI, {
  get: (target, prop) => {
    if (!_openai) {
      _openai = getClient();
    }
    return (_openai as any)[prop];
  }
});
