#!/usr/bin/env python3
"""
Process articles 81-100 (indices 80-99) with two-phase audit and optimization
"""

import json
import os
import requests
from pathlib import Path

# Configuration
WORKING_DIR = Path("/Users/hulksi/Desktop/IOS_APPS/bpcareai-site")
ARTICLES_INDEX_FILE = WORKING_DIR / "data/articles-index.json"
CONTENT_DIR = WORKING_DIR / "content/articles"
OUTPUT_FILE = WORKING_DIR / "data/llm-two-phase-batch-81-100.json"

# Skill prompts paths
METADATA_AUDIT_SKILL = WORKING_DIR / ".claude/skills/llm-article-audit-comprehensive.md"
METADATA_OPTIMIZATION_SKILL = WORKING_DIR / ".claude/skills/llm-article-optimization-comprehensive.md"
CONTENT_AUDIT_SKILL = WORKING_DIR / ".claude/skills/article-content-quality-audit.md"

# API Configuration
API_KEY = os.environ.get("ANTHROPIC_API_KEY")
API_URL = "https://api.anthropic.com/v1/messages"
MODEL = "claude-sonnet-4-20250514"

def load_json(file_path):
    """Load JSON file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(data, file_path):
    """Save JSON file"""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def read_file(file_path):
    """Read text file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def call_claude(system_prompt, user_message):
    """Call Claude API using requests"""
    headers = {
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    payload = {
        "model": MODEL,
        "max_tokens": 16000,
        "temperature": 0,
        "system": system_prompt,
        "messages": [
            {"role": "user", "content": user_message}
        ]
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code != 200:
        print(f"    API Error: {response.status_code} - {response.text}")
        raise Exception(f"API call failed: {response.status_code}")

    result = response.json()
    return result["content"][0]["text"]

def parse_json_response(response_text):
    """Extract JSON from Claude's response"""
    # Try to find JSON block
    if "```json" in response_text:
        start = response_text.find("```json") + 7
        end = response_text.find("```", start)
        json_str = response_text[start:end].strip()
    elif "```" in response_text:
        start = response_text.find("```") + 3
        end = response_text.find("```", start)
        json_str = response_text[start:end].strip()
    else:
        json_str = response_text.strip()

    return json.loads(json_str)

def audit_metadata(article, audit_skill):
    """Phase 1 Metadata: Audit article metadata"""
    print(f"  - Auditing metadata...")

    user_message = f"""Please audit this article's metadata:

```json
{json.dumps(article, indent=2, ensure_ascii=False)}
```

Provide your audit in the specified JSON format."""

    response = call_claude(audit_skill, user_message)
    return parse_json_response(response)

def optimize_metadata(article, audit_results, optimization_skill):
    """Phase 1 Metadata: Optimize if score < 85"""
    print(f"  - Optimizing metadata (score was {audit_results.get('overall_score', 0)})...")

    combined_data = {
        **article,
        "audit_results": audit_results
    }

    user_message = f"""Please optimize this article's metadata:

```json
{json.dumps(combined_data, indent=2, ensure_ascii=False)}
```

Provide your optimization in the specified JSON format."""

    response = call_claude(optimization_skill, user_message)
    return parse_json_response(response)

def audit_content(slug, content_audit_skill):
    """Phase 1 Content: Audit article content quality"""
    print(f"  - Auditing content quality...")

    # Read article content
    content_file = CONTENT_DIR / f"{slug}.md"
    if not content_file.exists():
        return {
            "slug": slug,
            "content_quality_score": 0,
            "needs_content_optimization": True,
            "error": "Content file not found"
        }

    content = read_file(content_file)

    user_message = f"""Please audit this article's content quality:

Article slug: {slug}

```markdown
{content}
```

Provide your audit in the specified JSON format."""

    response = call_claude(content_audit_skill, user_message)
    return parse_json_response(response)

def process_article(article, audit_skill, optimization_skill, content_audit_skill):
    """Process single article through both phases"""
    slug = article['slug']
    print(f"\nProcessing: {slug}")

    result = {
        "slug": slug,
        "phase1_metadata": {},
        "phase1_content_audit": {},
        "needs_phase2": False
    }

    try:
        # Phase 1 Metadata: Audit
        audit_results = audit_metadata(article, audit_skill)
        result["phase1_metadata"]["audit_results"] = audit_results

        metadata_score = audit_results.get("overall_score", 0)

        # Phase 1 Metadata: Optimize if needed
        if metadata_score < 85:
            optimization_results = optimize_metadata(article, audit_results, optimization_skill)
            result["phase1_metadata"]["optimization_results"] = optimization_results

            # Check if optimization was successful
            optimized_score = optimization_results.get("quality_scores", {}).get("overall", 0)
            print(f"  - Metadata optimized: {metadata_score} -> {optimized_score}")
        else:
            print(f"  - Metadata score {metadata_score} >= 85, no optimization needed")
            result["phase1_metadata"]["optimization_results"] = None

        # Phase 1 Content: Audit
        content_audit_results = audit_content(slug, content_audit_skill)
        result["phase1_content_audit"] = content_audit_results

        content_score = content_audit_results.get("content_quality_score", 0)
        print(f"  - Content quality score: {content_score}")

        # Determine if Phase 2 is needed
        if content_score < 85:
            result["needs_phase2"] = True
            print(f"  ✓ Flagged for Phase 2 content optimization")
        else:
            print(f"  ✓ Content quality sufficient, no Phase 2 needed")

    except Exception as e:
        print(f"  ERROR: {e}")
        result["error"] = str(e)

    return result

def main():
    print("=== Processing Articles 81-100 (Two-Phase Audit & Optimization) ===\n")

    # Load articles index
    print("Loading articles index...")
    articles = load_json(ARTICLES_INDEX_FILE)

    # Extract articles 81-100 (indices 80-99)
    batch_articles = articles[80:100]
    print(f"Processing {len(batch_articles)} articles (indices 80-99)")

    # Load skill prompts
    print("Loading skill prompts...")
    audit_skill = read_file(METADATA_AUDIT_SKILL)
    optimization_skill = read_file(METADATA_OPTIMIZATION_SKILL)
    content_audit_skill = read_file(CONTENT_AUDIT_SKILL)

    # Process each article
    results = []
    stats = {
        "total_processed": 0,
        "metadata_optimized": 0,
        "metadata_optimization_failed": 0,
        "content_needs_phase2": 0,
        "errors": 0
    }

    for article in batch_articles:
        result = process_article(article, audit_skill, optimization_skill, content_audit_skill)
        results.append(result)

        # Update stats
        stats["total_processed"] += 1

        if "error" in result:
            stats["errors"] += 1
        else:
            # Check if metadata was optimized
            if result["phase1_metadata"].get("optimization_results"):
                optimized_score = result["phase1_metadata"]["optimization_results"].get("quality_scores", {}).get("overall", 0)
                if optimized_score >= 85:
                    stats["metadata_optimized"] += 1
                else:
                    stats["metadata_optimization_failed"] += 1

            # Check if content needs Phase 2
            if result.get("needs_phase2", False):
                stats["content_needs_phase2"] += 1

    # Compile final output
    output = {
        "batch_info": {
            "batch_name": "batch-81-100",
            "article_indices": "80-99",
            "article_count": len(batch_articles),
            "processed_count": stats["total_processed"]
        },
        "summary": {
            "total_processed": stats["total_processed"],
            "metadata_optimized": stats["metadata_optimized"],
            "metadata_optimization_failed": stats["metadata_optimization_failed"],
            "content_needs_phase2": stats["content_needs_phase2"],
            "errors": stats["errors"],
            "articles_needing_phase2": [
                r["slug"] for r in results if r.get("needs_phase2", False)
            ]
        },
        "results": results
    }

    # Save results
    print(f"\nSaving results to {OUTPUT_FILE}...")
    save_json(output, OUTPUT_FILE)

    # Print summary
    print("\n=== SUMMARY ===")
    print(f"Total processed: {stats['total_processed']}")
    print(f"Metadata optimized: {stats['metadata_optimized']}")
    print(f"Metadata optimization failed: {stats['metadata_optimization_failed']}")
    print(f"Content needs Phase 2: {stats['content_needs_phase2']}")
    print(f"Errors: {stats['errors']}")
    print(f"\nArticles needing Phase 2 content optimization: {stats['content_needs_phase2']}")

    if stats["content_needs_phase2"] > 0:
        print("\nArticles flagged for Phase 2:")
        for slug in output["summary"]["articles_needing_phase2"]:
            print(f"  - {slug}")

    print(f"\n✓ Results saved to: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
