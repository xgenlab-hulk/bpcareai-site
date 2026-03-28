#!/usr/bin/env python3
"""
Quick audit script for PrimaryKeyword quality
Uses rule-based scoring for fast initial check
"""
import json
import re

def score_primary_keyword(pk):
    """Score a primary keyword (0-100)"""
    score = 0
    issues = []
    
    # Length check (15 points)
    length = len(pk)
    if 30 <= length <= 50:
        score += 15
    elif 25 <= length < 30 or 50 < length <= 60:
        score += 10
    else:
        score += 0
        issues.append("length_not_optimal")
    
    # Specific medical topic (40 points)
    medical_keywords = [
        'blood pressure', 'diabetes', 'heart', 'cholesterol', 
        'stroke', 'glucose', 'kidney', 'cardiac', 'hypertension',
        'blood sugar', 'heart rate', 'arrhythmia', 'atrial'
    ]
    
    has_medical = any(kw in pk.lower() for kw in medical_keywords)
    if has_medical:
        score += 40
    else:
        # Check if using generic terms
        generic_terms = ['health', 'wellness', 'management', 'tips']
        if any(term in pk.lower() for term in generic_terms):
            score += 10  # Some credit but not full
            issues.append("uses_generic_terms")
        else:
            score += 0
            issues.append("no_medical_keyword")
    
    # Target audience (20 points)
    audience_patterns = [
        r'seniors?', r'adults?\s+\d+', r'elderly', r'women', r'men',
        r'over\s+\d+', r'\d+\+', r'age\s+\d+'
    ]
    
    has_audience = any(re.search(pattern, pk.lower()) for pattern in audience_patterns)
    if has_audience:
        score += 20
    else:
        issues.append("lacks_audience")
    
    # Natural phrasing (10 points) - basic check
    if ' ' in pk and not pk.count(' ') > 10:  # Has spaces but not too many
        score += 10
    else:
        issues.append("unnatural_phrasing")
    
    # Avoid technical jargon (15 points)
    technical_terms = [
        'tmao', 'endothelial', 'baroreceptor', 'microvascular',
        'connexin', 'pheochromocytoma', 'nephropathy'
    ]
    
    has_technical = any(term in pk.lower() for term in technical_terms)
    if not has_technical:
        score += 15
    else:
        score += 5
        issues.append("overly_technical")
    
    return score, issues

def main():
    # Load articles
    with open('data/articles-index.json', 'r') as f:
        articles = json.load(f)
    
    results = []
    needs_opt = []
    
    for article in articles:
        pk = article.get('primaryKeyword', '')
        score, issues = score_primary_keyword(pk)
        
        result = {
            'slug': article['slug'],
            'primaryKeyword': pk,
            'score': score,
            'issues': issues,
            'needs_optimization': score < 85
        }
        
        results.append(result)
        if score < 85:
            needs_opt.append(result)
    
    # Summary
    summary = {
        'total_articles': len(articles),
        'needs_optimization_count': len(needs_opt),
        'percentage': f"{len(needs_opt)/len(articles)*100:.1f}%",
        'score_distribution': {
            'excellent_85+': len([r for r in results if r['score'] >= 85]),
            'good_70-84': len([r for r in results if 70 <= r['score'] < 85]),
            'needs_work_<70': len([r for r in results if r['score'] < 70])
        }
    }
    
    # Save results
    output = {
        'audit_date': '2026-03-11',
        'audit_method': 'rule-based-quick-check',
        'summary': summary,
        'needs_optimization': needs_opt[:10]  # First 10 for preview
    }
    
    print(json.dumps(summary, indent=2))
    
    with open('data/quick-audit-results.json', 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n✅ Results saved to data/quick-audit-results.json")
    print(f"Found {len(needs_opt)} articles needing optimization")

if __name__ == '__main__':
    main()
