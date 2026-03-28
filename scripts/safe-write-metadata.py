"""
Safe metadata writer for article frontmatter.
Uses >- YAML format to avoid single-quote escaping issues.

Usage:
    from safe_write_metadata import safe_write_metadata
    safe_write_metadata(filepath, pk, title, desc)

Or batch mode:
    python safe-write-metadata.py --input /tmp/b12-merged.json --date 2026-03-28
"""
import re
import yaml
import json
import argparse
import os


def safe_write_metadata(filepath, pk, title, desc, updated_date='2026-03-28'):
    """
    Safely write optimized metadata into article frontmatter.
    Uses >- YAML format for title/description to avoid quote escaping issues.
    PrimaryKeyword uses bare format (no quotes).
    """
    with open(filepath, 'r') as f:
        content = f.read()

    # Match entire title block (single line 'xxx' or >- multiline)
    content = re.sub(
        r"^title:.*?(?=\n(?:slug|description|date|updated|primaryKeyword|topicCluster|image|relatedSlugs):|\n---)",
        f"title: >-\n  {title}",
        content, count=1, flags=re.MULTILINE | re.DOTALL
    )

    # Match entire description block
    content = re.sub(
        r"^description:.*?(?=\n(?:slug|title|date|updated|primaryKeyword|topicCluster|image|relatedSlugs):|\n---)",
        f"description: >-\n  {desc}",
        content, count=1, flags=re.MULTILINE | re.DOTALL
    )

    # PrimaryKeyword (always single line, no quotes needed)
    content = re.sub(
        r"^primaryKeyword:.*$",
        f"primaryKeyword: {pk}",
        content, count=1, flags=re.MULTILINE
    )

    # Updated date
    content = re.sub(
        r"^updated:.*$",
        f"updated: '{updated_date}'",
        content, count=1, flags=re.MULTILINE
    )

    # Verify YAML parses correctly
    parts = content.split('---', 2)
    data = yaml.safe_load(parts[1])
    assert data['title'].strip() == title.strip(), f"Title mismatch"
    assert data['description'].strip() == desc.strip(), f"Desc mismatch"
    assert data['primaryKeyword'].strip() == pk.strip(), f"PK mismatch"

    with open(filepath, 'w') as f:
        f.write(content)
    return True


def batch_write(input_json, articles_dir='content/articles', updated_date='2026-03-28'):
    """Write metadata for a batch of articles from a JSON file."""
    with open(input_json) as f:
        data = json.load(f)

    articles = data if isinstance(data, list) else data.get('articles', [])
    updated = 0
    errors = []

    for art in articles:
        slug = art['slug']
        filepath = os.path.join(articles_dir, f"{slug}.md")

        if not os.path.exists(filepath):
            # Try finding by slug field in files
            found = False
            for fname in os.listdir(articles_dir):
                if not fname.endswith('.md'):
                    continue
                fpath = os.path.join(articles_dir, fname)
                with open(fpath) as fh:
                    head = fh.read(400)
                if f"slug: {slug}" in head:
                    filepath = fpath
                    found = True
                    break
            if not found:
                errors.append(f"NOT FOUND: {slug}")
                continue

        try:
            safe_write_metadata(
                filepath,
                art['primaryKeyword'],
                art['title'],
                art['description'],
                updated_date
            )
            updated += 1
        except Exception as e:
            errors.append(f"{slug}: {e}")

    print(f"Updated: {updated}/{len(articles)}")
    if errors:
        print(f"Errors ({len(errors)}):")
        for e in errors[:10]:
            print(f"  {e}")
    return updated, errors


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True, help='JSON file with articles')
    parser.add_argument('--dir', default='content/articles', help='Articles directory')
    parser.add_argument('--date', default='2026-03-28', help='Updated date')
    args = parser.parse_args()
    batch_write(args.input, args.dir, args.date)
