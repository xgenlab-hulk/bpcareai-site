#!/usr/bin/env python3
"""
Process articles 61-80 through two-phase audit and optimization.
"""

import json
import os
import requests
from datetime import datetime

# Get API key from environment
API_KEY = os.environ.get("ANTHROPIC_API_KEY")

def load_skill(skill_path):
    """Load a skill file."""
    with open(skill_path, 'r') as f:
        return f.read()

def load_article_metadata(slug):
    """Load article metadata from articles-index.json."""
    with open('/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/articles-index.json', 'r') as f:
        articles = json.load(f)

    for article in articles:
        if article['slug'] == slug:
            return article
    return None

def load_article_content(slug):
    """Load article markdown content."""
    content_path = f'/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/content/articles/{slug}.md'
    try:
        with open(content_path, 'r') as f:
            return f.read()
    except FileNotFoundError:
        return None

def call_claude(system_prompt, user_message):
    """Call Claude API using direct HTTP requests."""
    headers = {
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    data = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 8000,
        "temperature": 0.3,
        "system": system_prompt,
        "messages": [
            {"role": "user", "content": user_message}
        ]
    }

    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers=headers,
        json=data
    )

    if response.status_code != 200:
        raise Exception(f"API error: {response.status_code} - {response.text}")

    result = response.json()
    return result['content'][0]['text']

def phase1_metadata_audit(article):
    """Phase 1: Audit article metadata."""
    audit_skill = load_skill('/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/.claude/skills/llm-article-audit-comprehensive.md')

    user_message = f"""Please audit this article's metadata:

```json
{json.dumps(article, indent=2)}
```

Provide your assessment in the JSON format specified in the instructions."""

    result = call_claude(audit_skill, user_message)

    # Parse JSON from response
    try:
        # Find JSON in response
        start = result.find('{')
        end = result.rfind('}') + 1
        if start != -1 and end > start:
            return json.loads(result[start:end])
    except:
        pass

    return {"error": "Failed to parse audit result", "raw": result}

def phase1_metadata_optimization(article, audit_result):
    """Phase 1: Optimize article metadata if score < 85."""
    optimization_skill = load_skill('/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/.claude/skills/llm-article-optimization-comprehensive.md')

    user_message = f"""Please optimize this article's metadata:

```json
{{
  "slug": "{article['slug']}",
  "title": "{article['title']}",
  "description": "{article['description']}",
  "primaryKeyword": "{article['primaryKeyword']}",
  "topicCluster": "{article['topicCluster']}",
  "audit_results": {json.dumps(audit_result, indent=2)}
}}
```

Provide your optimizations in the JSON format specified in the instructions."""

    result = call_claude(optimization_skill, user_message)

    # Parse JSON from response
    try:
        start = result.find('{')
        end = result.rfind('}') + 1
        if start != -1 and end > start:
            return json.loads(result[start:end])
    except:
        pass

    return {"error": "Failed to parse optimization result", "raw": result}

def phase1_content_audit(slug, content):
    """Phase 1: Audit article content quality."""
    content_audit_skill = load_skill('/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/.claude/skills/article-content-quality-audit.md')

    # Truncate content if too long (keep first 15000 chars)
    if len(content) > 15000:
        content = content[:15000] + "\n\n[... content truncated for audit ...]"

    user_message = f"""Please audit this article's content quality:

**Slug**: {slug}

**Content**:
```markdown
{content}
```

Provide your assessment in the JSON format specified in the instructions."""

    result = call_claude(content_audit_skill, user_message)

    # Parse JSON from response
    try:
        start = result.find('{')
        end = result.rfind('}') + 1
        if start != -1 and end > start:
            return json.loads(result[start:end])
    except:
        pass

    return {"error": "Failed to parse content audit result", "raw": result}

def process_article(article):
    """Process a single article through two-phase audit and optimization."""
    slug = article['slug']
    print(f"\nProcessing: {slug}")

    result = {
        "slug": slug,
        "phase1_metadata": {},
        "phase1_content_audit": {},
        "processing_timestamp": datetime.now().isoformat()
    }

    # Phase 1 - Metadata Audit
    print("  - Metadata audit...")
    audit_result = phase1_metadata_audit(article)
    result['phase1_metadata']['audit_results'] = audit_result

    # Phase 1 - Metadata Optimization (if needed)
    overall_score = audit_result.get('overall_score', 0)
    if overall_score < 85:
        print(f"  - Metadata optimization (score: {overall_score})...")
        optimization_result = phase1_metadata_optimization(article, audit_result)
        result['phase1_metadata']['optimization_results'] = optimization_result
        result['phase1_metadata']['optimized'] = True
    else:
        print(f"  - Metadata OK (score: {overall_score})")
        result['phase1_metadata']['optimized'] = False

    # Phase 1 - Content Audit
    print("  - Content audit...")
    content = load_article_content(slug)
    if content:
        content_audit_result = phase1_content_audit(slug, content)
        result['phase1_content_audit'] = content_audit_result
    else:
        result['phase1_content_audit'] = {"error": "Content file not found"}

    return result

def main():
    """Main processing function."""
    print("Loading articles index...")

    with open('/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/articles-index.json', 'r') as f:
        articles = json.load(f)

    # Extract articles 61-80 (indices 60-79)
    batch = articles[60:80]

    print(f"Processing {len(batch)} articles (batch 61-80)...")

    results = []
    metadata_optimized_count = 0
    content_needs_optimization_count = 0

    for i, article in enumerate(batch, 1):
        print(f"\n[{i}/{len(batch)}]")
        try:
            result = process_article(article)
            results.append(result)

            # Track statistics
            if result['phase1_metadata'].get('optimized', False):
                metadata_optimized_count += 1

            content_score = result['phase1_content_audit'].get('content_quality_score', 100)
            if content_score < 85:
                content_needs_optimization_count += 1

        except Exception as e:
            print(f"  ERROR: {e}")
            results.append({
                "slug": article['slug'],
                "error": str(e),
                "processing_timestamp": datetime.now().isoformat()
            })

    # Compile summary
    articles_needing_phase2 = [
        r['slug'] for r in results
        if r.get('phase1_content_audit', {}).get('content_quality_score', 100) < 85
    ]

    output = {
        "batch": "61-80",
        "processing_timestamp": datetime.now().isoformat(),
        "articles_processed": len(results),
        "results": results,
        "summary": {
            "total_processed": len(results),
            "metadata_optimized": metadata_optimized_count,
            "content_needs_optimization": content_needs_optimization_count,
            "articles_needing_phase2": articles_needing_phase2,
            "metadata_optimization_rate": f"{(metadata_optimized_count/len(results)*100):.1f}%",
            "content_optimization_needed_rate": f"{(content_needs_optimization_count/len(results)*100):.1f}%"
        }
    }

    # Save results
    output_path = '/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/llm-two-phase-batch-61-80.json'
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2)

    print("\n" + "="*60)
    print("PROCESSING COMPLETE")
    print("="*60)
    print(f"Total articles processed: {output['summary']['total_processed']}")
    print(f"Metadata optimized: {output['summary']['metadata_optimized']} ({output['summary']['metadata_optimization_rate']})")
    print(f"Content needs optimization: {output['summary']['content_needs_optimization']} ({output['summary']['content_optimization_needed_rate']})")
    print(f"Articles needing Phase 2: {len(articles_needing_phase2)}")
    print(f"\nResults saved to: {output_path}")

if __name__ == "__main__":
    main()
