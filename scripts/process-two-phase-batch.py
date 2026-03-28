#!/usr/bin/env python3
"""
Two-Phase Article Audit and Optimization
Processes articles through metadata audit, optimization, and content audit

Usage:
    python3 scripts/process-two-phase-batch.py --start 21 --end 40

Requirements:
    - ANTHROPIC_API_KEY environment variable
    - anthropic Python package
"""

import json
import os
import sys
import argparse
from datetime import datetime
from pathlib import Path

try:
    from anthropic import Anthropic
except ImportError:
    print("Error: anthropic package not installed.")
    print("Install with: pip install anthropic")
    sys.exit(1)

# Configuration
WORKING_DIR = Path("/Users/hulksi/Desktop/IOS_APPS/bpcareai-site")
ARTICLES_INDEX = WORKING_DIR / "data" / "articles-index.json"
CONTENT_DIR = WORKING_DIR / "content" / "articles"

# Load skill prompts
SKILLS_DIR = WORKING_DIR / ".claude" / "skills"

with open(SKILLS_DIR / "llm-article-audit-comprehensive.md") as f:
    AUDIT_PROMPT = f.read()

with open(SKILLS_DIR / "llm-article-optimization-comprehensive.md") as f:
    OPTIMIZATION_PROMPT = f.read()

with open(SKILLS_DIR / "article-content-quality-audit.md") as f:
    CONTENT_AUDIT_PROMPT = f.read()


class ArticleProcessor:
    """Processes articles through two-phase audit and optimization"""

    def __init__(self, api_key=None):
        # Initialize client without proxies parameter for version 0.28.0
        api_key = api_key or os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable not set")
        self.client = Anthropic(api_key=api_key)
        self.model = "claude-sonnet-4-20250514"

    def call_claude(self, system_prompt, user_message):
        """Call Claude API"""
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=16000,
                temperature=0.3,
                system=system_prompt,
                messages=[{"role": "user", "content": user_message}]
            )
            return response.content[0].text
        except Exception as e:
            return f"ERROR: {str(e)}"

    def extract_json(self, response):
        """Extract JSON from Claude response"""
        if "```json" in response:
            json_str = response.split("```json")[1].split("```")[0].strip()
        else:
            json_str = response.strip()

        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}")
            print(f"Response: {response[:500]}")
            return None

    def audit_metadata(self, article):
        """Phase 1a: Audit article metadata"""
        user_msg = f"""Please audit this article's metadata:

```json
{json.dumps(article, indent=2, ensure_ascii=False)}
```

Return your evaluation in the exact JSON format specified in the prompt."""

        response = self.call_claude(AUDIT_PROMPT, user_msg)
        return self.extract_json(response)

    def optimize_metadata(self, article, audit_results):
        """Phase 1b: Optimize metadata if score < 85"""
        combined_data = {**article, "audit_results": audit_results}

        user_msg = f"""Please optimize this article's metadata based on the audit results:

```json
{json.dumps(combined_data, indent=2, ensure_ascii=False)}
```

Return your optimization in the exact JSON format specified.
All element scores must be ≥85 after optimization."""

        response = self.call_claude(OPTIMIZATION_PROMPT, user_msg)
        return self.extract_json(response)

    def audit_content(self, slug):
        """Phase 1c: Audit content quality"""
        content_file = CONTENT_DIR / f"{slug}.md"

        if not content_file.exists():
            return {
                "slug": slug,
                "content_quality_score": 0,
                "needs_content_optimization": True,
                "error": "Content file not found"
            }

        with open(content_file) as f:
            content = f.read()[:15000]  # Limit to 15k chars

        user_msg = f"""Please audit the content quality of this article:

**Slug**: {slug}

**Content**:
```markdown
{content}
```

Return your evaluation in the exact JSON format specified in the prompt."""

        response = self.call_claude(CONTENT_AUDIT_PROMPT, user_msg)
        return self.extract_json(response)

    def process_article(self, article, article_number):
        """Process a single article through both phases"""
        slug = article['slug']
        print(f"\n{'='*80}")
        print(f"Article {article_number}: {slug[:60]}...")
        print(f"{'='*80}")

        result = {
            "article_number": article_number,
            "slug": slug,
            "original_metadata": article
        }

        # Phase 1a: Metadata Audit
        print("  Phase 1a: Metadata audit...")
        audit_result = self.audit_metadata(article)

        if not audit_result:
            print("    ERROR: Audit failed")
            result["error"] = "Metadata audit failed"
            return result

        result["metadata_audit"] = audit_result
        original_score = audit_result.get("overall_score", 0)
        print(f"    Score: {original_score}/100")

        # Phase 1b: Metadata Optimization (if needed)
        if original_score < 85:
            print("  Phase 1b: Optimizing metadata...")
            optimization_result = self.optimize_metadata(article, audit_result)

            if optimization_result:
                result["metadata_optimization"] = optimization_result
                optimized_score = optimization_result.get("quality_scores", {}).get("overall", 0)
                print(f"    Optimized Score: {optimized_score}/100")
                result["metadata_final_score"] = optimized_score
                result["metadata_optimized"] = True
            else:
                print("    ERROR: Optimization failed")
                result["metadata_final_score"] = original_score
                result["metadata_optimized"] = False
        else:
            print("  Phase 1b: Skipped (score ≥ 85)")
            result["metadata_final_score"] = original_score
            result["metadata_optimized"] = False

        # Phase 1c: Content Audit
        print("  Phase 1c: Content audit...")
        content_audit = self.audit_content(slug)

        if content_audit:
            result["content_audit"] = content_audit
            content_score = content_audit.get("content_quality_score", 0)
            print(f"    Content Score: {content_score}/100")
            result["needs_phase2"] = content_score < 85

            if result["needs_phase2"]:
                print("    Flagged for Phase 2")
        else:
            print("    ERROR: Content audit failed")
            result["needs_phase2"] = True

        return result


def main():
    parser = argparse.ArgumentParser(description="Two-phase article audit and optimization")
    parser.add_argument("--start", type=int, required=True, help="Starting article number")
    parser.add_argument("--end", type=int, required=True, help="Ending article number (inclusive)")
    parser.add_argument("--output", help="Output file path")
    args = parser.parse_args()

    # Load articles index
    with open(ARTICLES_INDEX) as f:
        all_articles = json.load(f)

    # Extract batch
    start_idx = args.start - 1
    end_idx = args.end
    batch = all_articles[start_idx:end_idx]

    print(f"\n{'='*80}")
    print(f"TWO-PHASE ARTICLE AUDIT & OPTIMIZATION")
    print(f"Articles {args.start}-{args.end} ({len(batch)} total)")
    print(f"{'='*80}")

    # Process articles
    processor = ArticleProcessor()
    results = []

    for i, article in enumerate(batch, start=args.start):
        try:
            result = processor.process_article(article, i)
            results.append(result)
        except Exception as e:
            print(f"\nERROR processing article {i}: {e}")
            results.append({
                "article_number": i,
                "slug": article.get('slug', 'unknown'),
                "error": str(e)
            })

    # Calculate summary
    metadata_orig_scores = [r.get("metadata_audit", {}).get("overall_score", 0) for r in results if "metadata_audit" in r]
    metadata_final_scores = [r.get("metadata_final_score", 0) for r in results]
    content_scores = [r.get("content_audit", {}).get("content_quality_score", 0) for r in results if "content_audit" in r]

    summary = {
        "batch_range": f"{args.start}-{args.end}",
        "total_articles": len(batch),
        "successfully_processed": len([r for r in results if "error" not in r]),
        "processing_date": datetime.now().isoformat(),
        "metadata_stats": {
            "original_avg_score": round(sum(metadata_orig_scores) / len(metadata_orig_scores), 2) if metadata_orig_scores else 0,
            "final_avg_score": round(sum(metadata_final_scores) / len(metadata_final_scores), 2) if metadata_final_scores else 0,
            "articles_optimized": len([r for r in results if r.get("metadata_optimized", False)]),
            "all_above_85": all(s >= 85 for s in metadata_final_scores)
        },
        "content_stats": {
            "avg_score": round(sum(content_scores) / len(content_scores), 2) if content_scores else 0,
            "articles_needing_phase2": len([r for r in results if r.get("needs_phase2", False)]),
            "articles_above_85": len([s for s in content_scores if s >= 85])
        }
    }

    # Build output
    output = {
        "batch_info": {
            "range": f"{args.start}-{args.end}",
            "total_articles": len(batch),
            "processing_date": datetime.now().isoformat()
        },
        "detailed_results": results,
        "summary": summary
    }

    # Save results
    output_file = args.output or f"{WORKING_DIR}/data/llm-two-phase-batch-{args.start}-{args.end}.json"
    with open(output_file, 'w') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    # Print summary
    print(f"\n{'='*80}")
    print("PROCESSING COMPLETE")
    print(f"{'='*80}")
    print(f"\nTotal Processed: {summary['successfully_processed']}/{summary['total_articles']}")
    print(f"\nMetadata:")
    print(f"  Original Avg: {summary['metadata_stats']['original_avg_score']}/100")
    print(f"  Final Avg: {summary['metadata_stats']['final_avg_score']}/100")
    print(f"  Optimized: {summary['metadata_stats']['articles_optimized']}")
    print(f"  All ≥85: {'Yes' if summary['metadata_stats']['all_above_85'] else 'No'}")
    print(f"\nContent:")
    print(f"  Avg Score: {summary['content_stats']['avg_score']}/100")
    print(f"  Need Phase 2: {summary['content_stats']['articles_needing_phase2']}")
    print(f"\nResults: {output_file}")


if __name__ == "__main__":
    main()
