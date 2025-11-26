/**
 * Qwen text-embedding-v4 API 封装
 * 文档: https://help.aliyun.com/zh/model-studio/text-embedding-synchronous-api
 */

const QWEN_API_ENDPOINT = 'https://dashscope.aliyuncs.com/compatible-mode/v1/embeddings';
const QWEN_MODEL = 'text-embedding-v4';
const EMBEDDING_DIMENSIONS = 1024;

/**
 * 获取 API Key，未设置时抛出错误
 */
function getApiKey(): string {
  const apiKey = process.env.QWEN_API_KEY;
  if (!apiKey) {
    throw new Error(
      'QWEN_API_KEY is not set. Please set it in your .env file or environment variables.'
    );
  }
  return apiKey;
}

/**
 * Qwen API 响应格式
 */
interface QwenEmbeddingResponse {
  data: Array<{
    embedding: number[];
    index: number;
    object: string;
  }>;
  model: string;
  object: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

/**
 * 为单条文本生成 embedding
 * @param text 输入文本
 * @returns embedding 向量（number[]）
 */
export async function generateEmbeddingForText(text: string): Promise<number[]> {
  // 检查文本是否为空
  if (!text || text.trim().length === 0) {
    throw new Error('Input text cannot be empty');
  }

  const apiKey = getApiKey();

  const response = await fetch(QWEN_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: QWEN_MODEL,
      input: text,
      dimensions: EMBEDDING_DIMENSIONS,
      encoding_format: 'float',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Qwen API request failed with status ${response.status}: ${errorText}`
    );
  }

  const data: QwenEmbeddingResponse = await response.json();

  if (!data.data || data.data.length === 0) {
    throw new Error('Qwen API returned empty data');
  }

  return data.data[0].embedding;
}

/**
 * 批量生成 embedding（最多 10 条文本）
 * @param texts 输入文本数组
 * @returns embedding 向量数组
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }

  if (texts.length > 10) {
    throw new Error('Qwen API supports max 10 texts per batch request');
  }

  // 检查是否有空文本
  texts.forEach((text, index) => {
    if (!text || text.trim().length === 0) {
      throw new Error(`Text at index ${index} is empty`);
    }
  });

  const apiKey = getApiKey();

  const response = await fetch(QWEN_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: QWEN_MODEL,
      input: texts,
      dimensions: EMBEDDING_DIMENSIONS,
      encoding_format: 'float',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Qwen API batch request failed with status ${response.status}: ${errorText}`
    );
  }

  const data: QwenEmbeddingResponse = await response.json();

  if (!data.data || data.data.length === 0) {
    throw new Error('Qwen API returned empty data');
  }

  // 按 index 排序确保顺序正确
  const sortedData = data.data.sort((a, b) => a.index - b.index);
  return sortedData.map((item) => item.embedding);
}
