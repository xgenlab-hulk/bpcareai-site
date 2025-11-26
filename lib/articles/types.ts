/**
 * 文章元数据接口
 */
export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  primaryKeyword: string;
  topicCluster: string;
  image: string;
  tags: string[];
  relatedSlugs: string[];
}

/**
 * 完整文章接口（包含内容）
 */
export interface ArticleFull extends ArticleMeta {
  content: string;
}
