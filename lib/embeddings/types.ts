/**
 * 文章 Embedding 接口
 *
 * 注意：embedding 字段是基于「title + description + primaryKeyword」生成的
 * **选题/主题级 embedding**（topic embedding），用于：
 * - 选题查重（检测新文章主题是否与现有文章重复）
 * - 查找相似主题的文章（用于 internal linking 推荐）
 *
 * 目前不包含正文/段落级 embedding，后续按需扩展
 */
export interface ArticleEmbedding {
  slug: string;
  title: string;
  primaryKeyword: string;
  topicCluster: string;
  /**
   * Topic-level embedding vector (1024 dimensions)
   * Generated from: title + description + primaryKeyword
   */
  embedding: number[];
}
