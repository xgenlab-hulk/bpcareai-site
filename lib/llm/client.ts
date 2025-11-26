/**
 * OpenAI SDK 客户端封装（兼容 DashScope/Qwen API）
 */

import OpenAI from 'openai';

// 检查 API Key 是否设置
if (!process.env.QWEN_API_KEY) {
  throw new Error(
    'QWEN_API_KEY is not set. Please set it in your .env file or environment variables.'
  );
}

/**
 * OpenAI 客户端实例，配置为使用阿里云 DashScope 兼容接口
 */
export const openai = new OpenAI({
  apiKey: process.env.QWEN_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
});
