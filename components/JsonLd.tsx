// JSON-LD 结构化数据组件

export const SITE_URL = 'https://bpcareai.com';
export const SITE_NAME = 'BPCare AI';
export const SITE_LOGO = `${SITE_URL}/icon.png`;

// 通用 JSON-LD 渲染组件
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Article JSON-LD 数据生成
export function generateArticleJsonLd({
  title,
  description,
  date,
  updated,
  slug,
  image,
}: {
  title: string;
  description: string;
  date: string;
  updated?: string;
  slug: string;
  image?: string;
}) {
  const isoDatePublished = new Date(date).toISOString();
  // 如果有 updated 字段则使用，否则使用 date
  const isoDateModified = updated ? new Date(updated).toISOString() : isoDatePublished;
  // 如果文章有 image 字段则使用，否则使用默认 icon
  const articleImage = image || SITE_LOGO;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: articleImage,
    datePublished: isoDatePublished,
    dateModified: isoDateModified,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: SITE_LOGO,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/articles/${slug}`,
    },
    inLanguage: 'en',
  };
}

// WebSite JSON-LD 数据
export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/articles?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

// Organization JSON-LD 数据
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: SITE_LOGO,
};
