#!/usr/bin/env python3
"""
Two-Phase Article Audit and Optimization - Batch 21-40
Processes articles 21-40 with comprehensive metadata audit, optimization, and content quality audit.
"""

import json
import os
import sys
from typing import Dict, List, Any

# Paths
BASE_DIR = "/Users/hulksi/Desktop/IOS_APPS/bpcareai-site"
ARTICLES_INDEX = f"{BASE_DIR}/data/articles-index.json"
CONTENT_DIR = f"{BASE_DIR}/content/articles"
OUTPUT_FILE = f"{BASE_DIR}/data/llm-two-phase-batch-21-40.json"

# Load skills
with open(f"{BASE_DIR}/.claude/skills/llm-article-audit-comprehensive.md", 'r') as f:
    AUDIT_SKILL = f.read()

with open(f"{BASE_DIR}/.claude/skills/llm-article-optimization-comprehensive.md", 'r') as f:
    OPTIMIZATION_SKILL = f.read()

with open(f"{BASE_DIR}/.claude/skills/article-content-quality-audit.md", 'r') as f:
    CONTENT_AUDIT_SKILL = f.read()


def call_claude(prompt: str) -> str:
    """Call Claude API using Anthropic Python SDK."""
    try:
        from anthropic import Anthropic

        client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}]
        )

        return response.content[0].text

    except Exception as e:
        print(f"    ERROR calling Claude API: {e}")
        return None


def audit_metadata(article: Dict[str, Any]) -> Dict[str, Any]:
    """Phase 1: Audit article metadata using LLM."""
    print(f"  [Metadata Audit] {article['slug']}")

    article_data = {
        "slug": article["slug"],
        "title": article["title"],
        "description": article["description"],
        "primaryKeyword": article["primaryKeyword"],
        "topicCluster": article["topicCluster"]
    }

    prompt = f"""{AUDIT_SKILL}

---

Please audit this article:

```json
{json.dumps(article_data, indent=2)}
```

Provide your audit in the exact JSON format specified in the skill."""

    response = call_claude(prompt)

    if response:
        try:
            # Extract JSON from response
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            if json_start != -1 and json_end > json_start:
                audit_result = json.loads(response[json_start:json_end])
                return audit_result
            else:
                print(f"    WARNING: Could not parse JSON from audit response")
                return None
        except json.JSONDecodeError as e:
            print(f"    WARNING: JSON decode error in audit: {e}")
            return None

    return None


def optimize_metadata(article: Dict[str, Any], audit_results: Dict[str, Any]) -> Dict[str, Any]:
    """Optimize article metadata if score < 85."""
    print(f"  [Metadata Optimization] {article['slug']}")

    article_data = {
        "slug": article["slug"],
        "title": article["title"],
        "description": article["description"],
        "primaryKeyword": article["primaryKeyword"],
        "topicCluster": article["topicCluster"],
        "audit_results": audit_results
    }

    prompt = f"""{OPTIMIZATION_SKILL}

---

Please optimize this article:

```json
{json.dumps(article_data, indent=2)}
```

Provide your optimization in the exact JSON format specified in the skill.
Ensure all quality scores are above 85."""

    response = call_claude(prompt)

    if response:
        try:
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            if json_start != -1 and json_end > json_start:
                optimization_result = json.loads(response[json_start:json_end])
                return optimization_result
            else:
                print(f"    WARNING: Could not parse JSON from optimization response")
                return None
        except json.JSONDecodeError as e:
            print(f"    WARNING: JSON decode error in optimization: {e}")
            return None

    return None


def audit_content(slug: str) -> Dict[str, Any]:
    """Phase 1: Audit article content quality."""
    print(f"  [Content Audit] {slug}")

    content_path = f"{CONTENT_DIR}/{slug}.md"

    if not os.path.exists(content_path):
        print(f"    WARNING: Content file not found: {content_path}")
        return None

    # Read content
    with open(content_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Limit content size for API (first 50KB)
    if len(content) > 50000:
        content = content[:50000] + "\n\n[... content truncated for analysis ...]"

    prompt = f"""{CONTENT_AUDIT_SKILL}

---

Please audit the content quality of this article:

**Slug**: {slug}

**Content**:
```markdown
{content}
```

Provide your audit in the exact JSON format specified in the skill."""

    response = call_claude(prompt)

    if response:
        try:
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            if json_start != -1 and json_end > json_start:
                content_audit_result = json.loads(response[json_start:json_end])
                return content_audit_result
            else:
                print(f"    WARNING: Could not parse JSON from content audit response")
                return None
        except json.JSONDecodeError as e:
            print(f"    WARNING: JSON decode error in content audit: {e}")
            return None

    return None


def process_article(article: Dict[str, Any], index: int) -> Dict[str, Any]:
    """Process a single article through both phases."""
    print(f"\n[{index}] Processing: {article['slug']}")

    result = {
        "index": index,
        "slug": article["slug"],
        "phase1_metadata": {
            "audit_results": None,
            "optimization_results": None
        },
        "phase1_content_audit": None
    }

    # Phase 1: Metadata Audit
    audit_results = audit_metadata(article)
    if not audit_results:
        print(f"  ERROR: Metadata audit failed")
        return result

    result["phase1_metadata"]["audit_results"] = audit_results

    # Check if optimization needed
    overall_score = audit_results.get("overall_score", 0)
    needs_optimization = audit_results.get("needs_optimization", True)

    if overall_score < 85 or needs_optimization:
        print(f"  Score: {overall_score} - Optimization needed")
        optimization_results = optimize_metadata(article, audit_results)
        if optimization_results:
            result["phase1_metadata"]["optimization_results"] = optimization_results
            # Update article with optimized values
            if optimization_results.get("optimization_successful"):
                optimizations = optimization_results.get("optimizations", {})
                for field in ["primaryKeyword", "slug", "title", "description"]:
                    if field in optimizations and optimizations[field].get("changed"):
                        article[field] = optimizations[field]["optimized"]
        else:
            print(f"  WARNING: Metadata optimization failed")
    else:
        print(f"  Score: {overall_score} - No optimization needed")

    # Phase 1: Content Audit
    content_audit_results = audit_content(article["slug"])
    if content_audit_results:
        result["phase1_content_audit"] = content_audit_results
    else:
        print(f"  WARNING: Content audit failed")

    return result


def main():
    """Main processing function."""
    print("=" * 80)
    print("Two-Phase Article Audit & Optimization - Batch 21-40")
    print("=" * 80)

    # Load articles
    print(f"\nLoading articles from: {ARTICLES_INDEX}")
    with open(ARTICLES_INDEX, 'r') as f:
        all_articles = json.load(f)

    print(f"Total articles in index: {len(all_articles)}")

    # Extract articles 21-40 (indices 20-39)
    batch_articles = all_articles[20:40]
    print(f"Processing articles 21-40: {len(batch_articles)} articles")

    # Process each article
    results = []
    stats = {
        "total_processed": 0,
        "metadata_audits_completed": 0,
        "metadata_optimizations_performed": 0,
        "metadata_optimizations_successful": 0,
        "content_audits_completed": 0,
        "articles_needing_phase2": 0,
        "metadata_score_distribution": {
            "excellent_90_plus": 0,
            "very_good_80_89": 0,
            "good_70_79": 0,
            "fair_60_69": 0,
            "poor_below_60": 0
        },
        "content_score_distribution": {
            "excellent_85_plus": 0,
            "good_70_84": 0,
            "fair_60_69": 0,
            "poor_below_60": 0
        }
    }

    for idx, article in enumerate(batch_articles, start=21):
        try:
            result = process_article(article, idx)
            results.append(result)

            # Update statistics
            stats["total_processed"] += 1

            # Metadata stats
            if result["phase1_metadata"]["audit_results"]:
                stats["metadata_audits_completed"] += 1
                score = result["phase1_metadata"]["audit_results"].get("overall_score", 0)

                if score >= 90:
                    stats["metadata_score_distribution"]["excellent_90_plus"] += 1
                elif score >= 80:
                    stats["metadata_score_distribution"]["very_good_80_89"] += 1
                elif score >= 70:
                    stats["metadata_score_distribution"]["good_70_79"] += 1
                elif score >= 60:
                    stats["metadata_score_distribution"]["fair_60_69"] += 1
                else:
                    stats["metadata_score_distribution"]["poor_below_60"] += 1

            if result["phase1_metadata"]["optimization_results"]:
                stats["metadata_optimizations_performed"] += 1
                if result["phase1_metadata"]["optimization_results"].get("optimization_successful"):
                    stats["metadata_optimizations_successful"] += 1

            # Content stats
            if result["phase1_content_audit"]:
                stats["content_audits_completed"] += 1
                score = result["phase1_content_audit"].get("content_quality_score", 0)

                if score >= 85:
                    stats["content_score_distribution"]["excellent_85_plus"] += 1
                elif score >= 70:
                    stats["content_score_distribution"]["good_70_84"] += 1
                elif score >= 60:
                    stats["content_score_distribution"]["fair_60_69"] += 1
                else:
                    stats["content_score_distribution"]["poor_below_60"] += 1

                # Check if needs Phase 2
                if result["phase1_content_audit"].get("needs_content_optimization", False) or score < 85:
                    stats["articles_needing_phase2"] += 1

        except Exception as e:
            print(f"\n  ERROR processing article {idx}: {e}")
            import traceback
            traceback.print_exc()

    # Prepare output
    output = {
        "batch": "21-40",
        "processed_at": "2026-03-16",
        "articles": results,
        "summary": {
            "statistics": stats,
            "articles_needing_phase2": [
                {
                    "index": r["index"],
                    "slug": r["slug"],
                    "content_quality_score": r["phase1_content_audit"].get("content_quality_score", 0) if r["phase1_content_audit"] else 0,
                    "key_content_issues": r["phase1_content_audit"].get("key_content_issues", []) if r["phase1_content_audit"] else []
                }
                for r in results
                if r["phase1_content_audit"] and (
                    r["phase1_content_audit"].get("needs_content_optimization", False) or
                    r["phase1_content_audit"].get("content_quality_score", 0) < 85
                )
            ]
        }
    }

    # Save results
    print(f"\n{'=' * 80}")
    print(f"Saving results to: {OUTPUT_FILE}")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    # Print summary
    print(f"\n{'=' * 80}")
    print("SUMMARY")
    print(f"{'=' * 80}")
    print(f"\nTotal Processed: {stats['total_processed']}")
    print(f"\nMetadata Audit:")
    print(f"  - Audits completed: {stats['metadata_audits_completed']}")
    print(f"  - Optimizations performed: {stats['metadata_optimizations_performed']}")
    print(f"  - Optimizations successful: {stats['metadata_optimizations_successful']}")
    print(f"\nMetadata Score Distribution:")
    print(f"  - Excellent (90+): {stats['metadata_score_distribution']['excellent_90_plus']}")
    print(f"  - Very Good (80-89): {stats['metadata_score_distribution']['very_good_80_89']}")
    print(f"  - Good (70-79): {stats['metadata_score_distribution']['good_70_79']}")
    print(f"  - Fair (60-69): {stats['metadata_score_distribution']['fair_60_69']}")
    print(f"  - Poor (<60): {stats['metadata_score_distribution']['poor_below_60']}")
    print(f"\nContent Audit:")
    print(f"  - Audits completed: {stats['content_audits_completed']}")
    print(f"\nContent Score Distribution:")
    print(f"  - Excellent (85+): {stats['content_score_distribution']['excellent_85_plus']}")
    print(f"  - Good (70-84): {stats['content_score_distribution']['good_70_84']}")
    print(f"  - Fair (60-69): {stats['content_score_distribution']['fair_60_69']}")
    print(f"  - Poor (<60): {stats['content_score_distribution']['poor_below_60']}")
    print(f"\nArticles Needing Phase 2: {stats['articles_needing_phase2']}")
    print(f"\n{'=' * 80}")
    print("Processing complete!")
    print(f"{'=' * 80}\n")


if __name__ == "__main__":
    main()
