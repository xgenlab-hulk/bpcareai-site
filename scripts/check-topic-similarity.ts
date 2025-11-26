// 加载 .env 文件中的环境变量
import 'dotenv/config';

import { checkTopicDuplicate } from '../lib/embeddings/similarity';

/**
 * CLI 脚本：检查新选题与现有文章的相似度
 *
 * Usage:
 *   npm run debug:topic-similarity -- "Title" "Description" "Primary Keyword"
 *   npm run debug:topic-similarity -- "Title"
 */

function printUsage() {
  console.log(`
Usage:
  npm run debug:topic-similarity -- "Title" "Description (optional)" "Primary Keyword (optional)"

Examples:
  npm run debug:topic-similarity -- "Understanding Blood Sugar Levels"
  npm run debug:topic-similarity -- "Understanding Blood Sugar Levels" "A guide to reading your glucose numbers"
  npm run debug:topic-similarity -- "Understanding Blood Sugar Levels" "A guide to reading your glucose numbers" "blood sugar"

Arguments:
  - Title: Required, the title of the new article
  - Description: Optional, the description/summary
  - Primary Keyword: Optional, the main SEO keyword
`);
}

async function main() {
  const args = process.argv.slice(2);

  // 检查是否提供了 title
  if (args.length === 0) {
    console.error('❌ Error: Title is required\n');
    printUsage();
    process.exit(1);
  }

  const title = args[0];
  const description = args[1];
  const primaryKeyword = args[2];

  console.log('🔍 Checking topic similarity...\n');
  console.log(`📝 New topic:`);
  console.log(`   Title: ${title}`);
  if (description) console.log(`   Description: ${description}`);
  if (primaryKeyword) console.log(`   Primary Keyword: ${primaryKeyword}`);
  console.log('');

  try {
    // 调用查重函数
    const result = await checkTopicDuplicate({
      title,
      description,
      primaryKeyword,
      duplicateThreshold: 0.85,
    });

    // 输出结果
    if (result.isDuplicate) {
      console.log('🚨 Potential duplicate topic detected!\n');
      console.log(`   Max similarity: ${result.maxSimilarity.toFixed(2)}`);

      if (result.mostSimilar) {
        console.log(`\n📌 Most similar article:`);
        console.log(`   [${result.mostSimilar.similarity.toFixed(2)}] ${result.mostSimilar.slug}`);
        console.log(`   Title: "${result.mostSimilar.title}"`);
        if (result.mostSimilar.primaryKeyword) {
          console.log(`   Keyword: "${result.mostSimilar.primaryKeyword}"`);
        }
        console.log(`   Cluster: ${result.mostSimilar.topicCluster}`);
      }

      // 显示其他相似文章
      if (result.allSimilar.length > 1) {
        console.log(`\n📋 Other similar articles:`);
        result.allSimilar.slice(1, 5).forEach((article) => {
          console.log(
            `   [${article.similarity.toFixed(2)}] ${article.slug} - "${article.title}"`
          );
        });
      }

      console.log('\n⚠️  Recommendation: Consider a different angle or more specific focus.\n');
    } else {
      console.log('✅ Topic looks novel enough.\n');
      console.log(`   Max similarity: ${result.maxSimilarity.toFixed(2)}`);

      if (result.allSimilar.length > 0) {
        console.log(`\n📋 Top similar articles (for reference):`);
        result.allSimilar.slice(0, 5).forEach((article) => {
          console.log(
            `   [${article.similarity.toFixed(2)}] ${article.slug} - "${article.title}"`
          );
        });
        console.log(
          `\n💡 These articles could be good candidates for internal linking.\n`
        );
      } else {
        console.log(`\n💡 No significantly similar articles found. This is a unique topic!\n`);
      }
    }
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
