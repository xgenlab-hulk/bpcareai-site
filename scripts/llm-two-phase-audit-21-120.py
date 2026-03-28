#!/usr/bin/env python3
"""
两阶段审计和优化：文章21-120（共100篇）

Phase 1: Metadata审计和优化
Phase 2: 内容质量审计

使用Claude LLM技能文件进行智能评估和优化
"""

import json
import os
import sys
from pathlib import Path
from anthropic import Anthropic

# 初始化
WORK_DIR = Path("/Users/hulksi/Desktop/IOS_APPS/bpcareai-site")
CONTENT_DIR = WORK_DIR / "content" / "articles"
DATA_DIR = WORK_DIR / "data"
SKILLS_DIR = WORK_DIR / ".claude" / "skills"

# API密钥
client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY") or "default_key")
MODEL = "claude-sonnet-4-20250514"

# 读取技能文件
def load_skill(skill_name):
    """加载技能文件内容"""
    skill_path = SKILLS_DIR / skill_name
    with open(skill_path, "r", encoding="utf-8") as f:
        return f.read()

# 技能文件
AUDIT_SKILL = load_skill("llm-article-audit-comprehensive.md")
OPTIMIZATION_SKILL = load_skill("llm-article-optimization-comprehensive.md")
CONTENT_AUDIT_SKILL = load_skill("article-content-quality-audit.md")

def audit_article_metadata(article):
    """Phase 1 Audit: 评估文章metadata质量"""

    prompt = f"""{AUDIT_SKILL}

---

Please audit this article's metadata:

```json
{json.dumps(article, indent=2, ensure_ascii=False)}
```

Provide your assessment in JSON format exactly as specified in the skill file.
Focus on: slug, title, description, primaryKeyword quality and consistency.
"""

    try:
        message = client.messages.create(
            model=MODEL,
            max_tokens=4000,
            temperature=0.3,
            messages=[{"role": "user", "content": prompt}]
        )

        response_text = message.content[0].text

        # 提取JSON
        if "```json" in response_text:
            json_start = response_text.find("```json") + 7
            json_end = response_text.find("```", json_start)
            json_str = response_text[json_start:json_end].strip()
        else:
            json_str = response_text.strip()

        result = json.loads(json_str)
        return result

    except Exception as e:
        print(f"  ❌ Audit error for {article['slug'][:50]}: {e}")
        return {
            "slug": article["slug"],
            "overall_score": 50,
            "needs_optimization": True,
            "error": str(e)
        }

def optimize_article_metadata(article, audit_result):
    """Phase 1 Optimization: 优化文章metadata"""

    combined_data = {
        **article,
        "audit_results": audit_result
    }

    prompt = f"""{OPTIMIZATION_SKILL}

---

Please optimize this article's metadata based on the audit results:

```json
{json.dumps(combined_data, indent=2, ensure_ascii=False)}
```

Provide optimized metadata in JSON format exactly as specified in the skill file.
Ensure ALL element scores are ≥85 after optimization.
"""

    max_attempts = 3

    for attempt in range(1, max_attempts + 1):
        try:
            message = client.messages.create(
                model=MODEL,
                max_tokens=4000,
                temperature=0.3,
                messages=[{"role": "user", "content": prompt}]
            )

            response_text = message.content[0].text

            # 提取JSON
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                json_str = response_text[json_start:json_end].strip()
            else:
                json_str = response_text.strip()

            result = json.loads(json_str)

            # 验证所有评分 ≥85
            quality_scores = result.get("quality_scores", {})
            all_good = all(
                score.get("score", 0) >= 85
                for key, score in quality_scores.items()
                if key != "overall" and isinstance(score, dict)
            )

            if all_good:
                return result
            else:
                print(f"  ⚠️  Attempt {attempt}: Some scores <85, retrying...")
                if attempt < max_attempts:
                    prompt += f"\n\nPrevious attempt had scores <85. Please improve further. All scores must be ≥85."

        except Exception as e:
            print(f"  ❌ Optimization error (attempt {attempt}): {e}")
            if attempt == max_attempts:
                return {
                    "slug": article["slug"],
                    "optimization_attempted": True,
                    "optimization_successful": False,
                    "error": str(e)
                }

    return result

def audit_article_content(slug, markdown_content):
    """Phase 1 Content Audit: 审计文章内容质量"""

    # 截断过长的内容（保留前20000字符用于审计）
    if len(markdown_content) > 20000:
        markdown_sample = markdown_content[:20000] + "\n\n[... content truncated for audit ...]"
    else:
        markdown_sample = markdown_content

    prompt = f"""{CONTENT_AUDIT_SKILL}

---

Please audit the content quality of this article:

**Article slug**: {slug}

**Markdown content**:
```markdown
{markdown_sample}
```

Provide your content audit in JSON format exactly as specified in the skill file.
Evaluate all 6 criteria: H1 title, structure, FAQ, technical language, fact density, user value.
Score 0-100. Flag if <85 for content optimization.
"""

    try:
        message = client.messages.create(
            model=MODEL,
            max_tokens=4000,
            temperature=0.3,
            messages=[{"role": "user", "content": prompt}]
        )

        response_text = message.content[0].text

        # 提取JSON
        if "```json" in response_text:
            json_start = response_text.find("```json") + 7
            json_end = response_text.find("```", json_start)
            json_str = response_text[json_start:json_end].strip()
        else:
            json_str = response_text.strip()

        result = json.loads(json_str)
        return result

    except Exception as e:
        print(f"  ❌ Content audit error for {slug[:50]}: {e}")
        return {
            "slug": slug,
            "content_quality_score": 50,
            "needs_content_optimization": True,
            "error": str(e)
        }

def process_article(article, index):
    """处理单篇文章：metadata审计+优化 + 内容审计"""

    slug = article["slug"]
    print(f"\n{'='*80}")
    print(f"[{index}/120] Processing: {slug[:60]}")
    print(f"{'='*80}")

    # Phase 1 Part A: Metadata Audit
    print(f"  📊 Phase 1A: Auditing metadata...")
    audit_result = audit_article_metadata(article)

    original_score = audit_result.get("overall_score", 0)
    needs_opt = audit_result.get("needs_optimization", True)

    print(f"  ✅ Audit score: {original_score}/100")

    # Phase 1 Part B: Metadata Optimization (if needed)
    optimization_result = None
    final_score = original_score

    if needs_opt and original_score < 85:
        print(f"  🔧 Phase 1B: Optimizing metadata (score <85)...")
        optimization_result = optimize_article_metadata(article, audit_result)
        final_score = optimization_result.get("quality_scores", {}).get("overall", original_score)
        print(f"  ✅ Optimized score: {final_score}/100")
    else:
        print(f"  ✓ Metadata already good (≥85), skipping optimization")

    # Phase 1 Part C: Content Audit
    print(f"  📄 Phase 1C: Auditing content quality...")

    markdown_path = CONTENT_DIR / f"{slug}.md"
    content_audit_result = None

    if markdown_path.exists():
        try:
            with open(markdown_path, "r", encoding="utf-8") as f:
                markdown_content = f.read()

            content_audit_result = audit_article_content(slug, markdown_content)
            content_score = content_audit_result.get("content_quality_score", 0)
            needs_content_opt = content_audit_result.get("needs_content_optimization", True)

            print(f"  ✅ Content score: {content_score}/100 {'❗(needs Phase 2)' if needs_content_opt else '✓'}")

        except Exception as e:
            print(f"  ❌ Error reading content: {e}")
            content_audit_result = {
                "slug": slug,
                "error": f"Failed to read markdown: {e}",
                "needs_content_optimization": True
            }
    else:
        print(f"  ⚠️  Markdown file not found: {markdown_path}")
        content_audit_result = {
            "slug": slug,
            "error": "Markdown file not found",
            "needs_content_optimization": True
        }

    return {
        "slug": slug,
        "audit_result": audit_result,
        "optimization_result": optimization_result,
        "content_audit_result": content_audit_result
    }

def main():
    """主流程"""

    print("\n" + "="*80)
    print("🚀 Starting Two-Phase Audit & Optimization: Articles 21-120")
    print("="*80)

    # 读取文章索引
    index_path = DATA_DIR / "articles-index.json"
    with open(index_path, "r", encoding="utf-8") as f:
        all_articles = json.load(f)

    # 提取第21-120篇（索引20-119）
    articles = all_articles[20:120]

    print(f"\n📚 Loaded {len(articles)} articles (index 20-119)")
    print(f"   First: {articles[0]['slug'][:60]}")
    print(f"   Last:  {articles[-1]['slug'][:60]}")

    # 处理所有文章
    results = {
        "batch_info": {
            "range": "21-120",
            "total_articles": len(articles),
            "processing_date": "2026-03-16"
        },
        "phase1_metadata": {
            "audit_results": [],
            "optimization_results": []
        },
        "phase1_content_audit": {
            "content_audit_results": []
        }
    }

    processed_count = 0
    error_count = 0

    for i, article in enumerate(articles, start=21):
        try:
            result = process_article(article, i)

            # 保存结果
            results["phase1_metadata"]["audit_results"].append(result["audit_result"])

            if result["optimization_result"]:
                results["phase1_metadata"]["optimization_results"].append(result["optimization_result"])

            results["phase1_content_audit"]["content_audit_results"].append(result["content_audit_result"])

            processed_count += 1

        except Exception as e:
            print(f"\n❌ Failed to process article {i}: {e}")
            error_count += 1
            continue

    # 计算统计信息
    print("\n" + "="*80)
    print("📊 Calculating statistics...")
    print("="*80)

    # Metadata统计
    audit_scores = [r.get("overall_score", 0) for r in results["phase1_metadata"]["audit_results"]]
    optimized_scores = [
        r.get("quality_scores", {}).get("overall", 0)
        for r in results["phase1_metadata"]["optimization_results"]
    ]

    avg_original = sum(audit_scores) / len(audit_scores) if audit_scores else 0
    avg_optimized = sum(optimized_scores) / len(optimized_scores) if optimized_scores else 0

    # Content统计
    content_scores = [
        r.get("content_quality_score", 0)
        for r in results["phase1_content_audit"]["content_audit_results"]
        if "error" not in r
    ]

    content_needs_phase2 = [
        r["slug"]
        for r in results["phase1_content_audit"]["content_audit_results"]
        if r.get("needs_content_optimization", True)
    ]

    avg_content = sum(content_scores) / len(content_scores) if content_scores else 0

    results["summary"] = {
        "metadata_statistics": {
            "articles_optimized": len(results["phase1_metadata"]["optimization_results"]),
            "average_original_score": round(avg_original, 1),
            "average_optimized_score": round(avg_optimized, 1) if optimized_scores else "N/A"
        },
        "content_statistics": {
            "average_content_score": round(avg_content, 1),
            "articles_needing_content_optimization": len(content_needs_phase2),
            "articles_with_excellent_content": len([s for s in content_scores if s >= 85])
        },
        "articles_needing_phase2": content_needs_phase2[:20],  # 只保存前20个，避免太长
        "processing_summary": {
            "total_attempted": len(articles),
            "successfully_processed": processed_count,
            "errors": error_count
        }
    }

    # 保存结果
    output_path = DATA_DIR / "llm-two-phase-batch-21-120.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Results saved to: {output_path}")

    # 打印摘要
    print("\n" + "="*80)
    print("📈 SUMMARY")
    print("="*80)
    print(f"\n✅ Successfully processed: {processed_count}/100 articles")
    print(f"❌ Errors: {error_count}")

    print(f"\n📊 Metadata Statistics:")
    print(f"   - Articles optimized: {results['summary']['metadata_statistics']['articles_optimized']}")
    print(f"   - Average original score: {results['summary']['metadata_statistics']['average_original_score']}")
    print(f"   - Average optimized score: {results['summary']['metadata_statistics']['average_optimized_score']}")

    print(f"\n📄 Content Statistics:")
    print(f"   - Average content score: {results['summary']['content_statistics']['average_content_score']}")
    print(f"   - Articles needing Phase 2: {results['summary']['content_statistics']['articles_needing_content_optimization']}")
    print(f"   - Articles with excellent content (≥85): {results['summary']['content_statistics']['articles_with_excellent_content']}")

    print("\n✅ All done!")

if __name__ == "__main__":
    main()
