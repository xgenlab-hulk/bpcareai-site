#!/usr/bin/env python3
"""
PrimaryKeyword质量检查脚本 - Batch 3
根据 .claude/skills/primary-keyword-standards.md 标准评分
"""

import json
import re

def calculate_score(pk, title, topic_cluster):
    """
    评分标准（总分100分）:
    - 长度评分（20分）: 30-50字符=20分, 25-29或51-60=15分, <25或>60=0分
    - 结构评分（30分）: 主题+受众/场景=30分, 只有主题=15分
    - 关键词质量（25分）: 1-2个核心医疗词=25分
    - 搜索意图（15分）: 明确=15分, 模糊=7分
    - 自然度（10分）: 自然短语=10分
    """
    score = 0
    issues = []

    # 1. 长度评分（20分）
    length = len(pk)
    if 30 <= length <= 50:
        score += 20
    elif (25 <= length <= 29) or (51 <= length <= 60):
        score += 15
    else:
        score += 0
        if length < 25:
            issues.append("too_short")
        else:
            issues.append("too_long")

    # 2. 结构评分（30分）- 检查是否包含主题+受众/场景
    medical_keywords = [
        'blood pressure', 'diabetes', 'glucose', 'heart rate', 'cholesterol',
        'insulin', 'hypertension', 'cardiovascular', 'cardiac', 'metabolic',
        'thyroid', 'kidney', 'renal', 'liver', 'hepatic', 'copd', 'respiratory',
        'endothelial', 'vascular', 'arterial', 'stroke', 'atrial fibrillation',
        'arrhythmia', 'lipoprotein', 'triglyceride', 'a1c', 'hemoglobin',
        'retinopathy', 'neuropathy', 'nephropathy', 'wound healing', 'circulation',
        'oxygen', 'saturation', 'sleep apnea', 'osteoporosis', 'arthritis',
        'inflammation', 'immune', 'microbiome', 'gut health', 'digestion',
        'charcot', 'myopathy', 'mitochondrial', 'oxidative stress', 'telomere',
        'sirt1', 'resveratrol', 'polyphenol', 'anthocyanin', 'fiber'
    ]

    audience_keywords = [
        'senior', 'elderly', 'adult', 'women', 'men', 'over 60', 'over 65',
        'over 70', '60+', '65+', '70+', 'older', 'aging', 'postmenopausal'
    ]

    scenario_keywords = [
        'holiday', 'winter', 'summer', 'morning', 'evening', 'post-meal',
        'fasting', 'exercise', 'sleep', 'travel', 'stress', 'meal', 'diet',
        'medication', 'monitoring', 'management', 'prevention', 'testing'
    ]

    pk_lower = pk.lower()
    has_medical = any(kw in pk_lower for kw in medical_keywords)
    has_audience = any(kw in pk_lower for kw in audience_keywords)
    has_scenario = any(kw in pk_lower for kw in scenario_keywords)

    if has_medical and (has_audience or has_scenario):
        score += 30
    elif has_medical:
        score += 15
        issues.append("lacks_audience_or_scenario")
    else:
        score += 0
        issues.append("lacks_medical_keyword")

    # 3. 关键词质量评分（25分）- 检查核心医疗词数量
    medical_word_count = sum(1 for kw in medical_keywords if kw in pk_lower)
    if 1 <= medical_word_count <= 2:
        score += 25
    else:
        score += 10
        if medical_word_count > 2:
            issues.append("too_many_medical_keywords")
        elif medical_word_count == 0:
            issues.append("no_medical_keywords")

    # 4. 搜索意图评分（15分）
    # 明确的搜索意图通常包含动作词或场景词
    intent_keywords = [
        'monitor', 'manage', 'control', 'prevent', 'test', 'measure',
        'reduce', 'improve', 'treat', 'diagnose', 'track', 'assess'
    ] + scenario_keywords

    has_clear_intent = any(kw in pk_lower for kw in intent_keywords) or has_scenario
    if has_clear_intent:
        score += 15
    else:
        score += 7
        issues.append("unclear_search_intent")

    # 5. 自然度评分（10分）
    # 检查是否是自然短语（避免关键词堆砌）
    words = pk.split()
    # 关键词堆砌的特征：同义词重复、不自然的连接
    keyword_stuffing_patterns = [
        r'blood pressure hypertension',
        r'glucose sugar blood',
        r'senior elderly older adult',
        r'(\w+)\s+\1'  # 重复单词
    ]

    is_stuffed = any(re.search(pattern, pk_lower) for pattern in keyword_stuffing_patterns)

    # 检查是否是自然的短语（有适当的连接）
    has_natural_structure = len(words) >= 3 and not is_stuffed

    if has_natural_structure and not is_stuffed:
        score += 10
    else:
        score += 0
        issues.append("unnatural_phrasing")

    return score, issues

def generate_suggestion(article):
    """基于title和topicCluster生成优化建议"""
    title = article['title']
    topic = article['topicCluster']
    current_pk = article['primaryKeyword']

    # 从title中提取核心概念
    title_lower = title.lower()

    # 提取核心医疗主题
    medical_topics = {
        'blood pressure': 'blood pressure',
        'diabetes': 'diabetes',
        'glucose': 'glucose',
        'insulin': 'insulin',
        'heart disease': 'heart disease',
        'heart': 'heart health',
        'cardiac': 'cardiac',
        'cardiovascular': 'cardiovascular',
        'cholesterol': 'cholesterol',
        'hypertension': 'hypertension',
        'copd': 'copd',
        'respiratory': 'respiratory',
        'kidney': 'kidney health',
        'renal': 'renal health',
        'liver': 'liver health',
        'thyroid': 'thyroid function',
        'atrial fibrillation': 'atrial fibrillation',
        'endothelial': 'endothelial function',
        'vascular': 'vascular health',
        'retinopathy': 'diabetic retinopathy',
        'neuropathy': 'neuropathy',
        'microalbuminuria': 'microalbuminuria',
        'lipoprotein': 'lipoprotein',
        'charcot': 'charcot footwear',
        'myopathy': 'myopathy',
        'mitochondrial': 'mitochondrial health',
        'wound healing': 'wound healing',
        'foot': 'diabetic foot care',
        'gastroparesis': 'gastroparesis',
        'hypoglycemia': 'hypoglycemia',
        'orthostatic hypotension': 'orthostatic hypotension'
    }

    # 提取受众
    audience_patterns = {
        r'adult[s]?\s+(\d+)\+': lambda m: f'adults {m.group(1)}+',
        r'over\s+(\d+)': lambda m: f'adults over {m.group(1)}',
        r'women\s+over\s+(\d+)': lambda m: f'women over {m.group(1)}',
        r'women\s+(\d+)\+': lambda m: f'women {m.group(1)}+',
        r'men\s+over\s+(\d+)': lambda m: f'men over {m.group(1)}',
        r'men\s+(\d+)\+': lambda m: f'men {m.group(1)}+',
        r'senior[s]?': lambda m: 'seniors',
        r'elderly': lambda m: 'elderly adults',
        r'postmenopausal': lambda m: 'postmenopausal women',
        r'older\s+adult[s]?': lambda m: 'older adults'
    }

    # 提取场景/上下文
    scenario_patterns = {
        'holiday': 'holiday meals',
        'winter': 'winter season',
        'summer': 'summer',
        'post-meal': 'post-meal',
        'postprandial': 'post-meal monitoring',
        'fasting': 'fasting glucose',
        'dawn phenomenon': 'dawn phenomenon',
        'sleep': 'sleep quality',
        'exercise': 'exercise safety',
        'travel': 'travel tips',
        'medication': 'medication management',
        'diet': 'diet management',
        'monitoring': 'monitoring',
        'testing': 'testing',
        'prevention': 'prevention strategies'
    }

    # 构建建议关键词
    parts = []

    # 1. 添加核心医疗主题
    medical_found = None
    for pattern, topic_name in medical_topics.items():
        if pattern in title_lower:
            parts.append(topic_name)
            medical_found = topic_name
            break

    # 2. 添加场景（如果有）
    scenario_found = None
    for pattern, scenario in scenario_patterns.items():
        if pattern in title_lower:
            parts.append(scenario)
            scenario_found = scenario
            break

    # 3. 添加受众
    audience_found = None
    for pattern, extractor in audience_patterns.items():
        match = re.search(pattern, title_lower)
        if match:
            audience = extractor(match)
            parts.append(audience)
            audience_found = audience
            break

    # 如果parts为空，使用fallback
    if not parts:
        # 从current_pk中提取
        words = current_pk.split()[:5]
        suggested = ' '.join(words)
    else:
        suggested = ' '.join(parts)

    # 确保长度在30-50字符之间
    if len(suggested) < 30:
        # 尝试添加更多上下文
        extra_words = []

        # 查找额外的描述性词
        if not scenario_found:
            if 'management' in title_lower and 'management' not in suggested:
                extra_words.append('management')
            elif 'monitoring' in title_lower and 'monitoring' not in suggested:
                extra_words.append('monitoring')
            elif 'prevention' in title_lower and 'prevention' not in suggested:
                extra_words.append('prevention')
            elif 'risk' in title_lower and 'risk' not in suggested:
                extra_words.append('risk factors')
            elif 'dysfunction' in title_lower and 'dysfunction' not in suggested:
                extra_words.append('dysfunction')
            elif 'control' in title_lower and 'control' not in suggested:
                extra_words.append('control')

        # 如果仍然太短，添加更多描述
        if len(' '.join(parts + extra_words)) < 30:
            if 'warning' in title_lower or 'signs' in title_lower:
                extra_words.append('warning signs')
            elif 'symptoms' in title_lower:
                extra_words.append('symptoms')
            elif 'treatment' in title_lower:
                extra_words.append('treatment options')
            elif 'diet' in title_lower and 'diet' not in suggested:
                extra_words.append('diet tips')
            elif 'food' in title_lower:
                extra_words.append('food choices')

        if extra_words:
            suggested = suggested + ' ' + ' '.join(extra_words)

    # 如果还是太短，基于topicCluster添加
    if len(suggested) < 30:
        topic_map = {
            'diabetes-management': 'diabetes management',
            'hypertension-management': 'hypertension management',
            'cardiovascular-health': 'cardiovascular health',
            'prevention-risk-assessment': 'prevention strategies',
            'special-populations': 'special populations',
            'renal-health': 'kidney health'
        }
        topic_addition = topic_map.get(topic, '')
        if topic_addition and topic_addition not in suggested:
            suggested = suggested + ' ' + topic_addition

    if len(suggested) > 50:
        # 截断到50字符以内
        words = suggested.split()
        while len(' '.join(words)) > 50 and len(words) > 3:
            words.pop()
        suggested = ' '.join(words)

    # 最终检查：如果还是太短或太长，使用current_pk的优化版本
    if len(suggested) < 30 or len(suggested) > 50:
        # 从current_pk提取关键部分
        pk_words = current_pk.split()
        if len(current_pk) > 50:
            # 太长，缩短
            suggested = ' '.join(pk_words[:5])
            if len(suggested) > 50:
                suggested = ' '.join(pk_words[:4])
        else:
            # 太短，从title提取关键词
            key_terms = []
            for term in ['blood pressure', 'diabetes', 'heart', 'glucose', 'hypertension']:
                if term in title_lower:
                    key_terms.append(term)
                    break
            if audience_found:
                key_terms.append(audience_found)
            suggested = ' '.join(key_terms + pk_words[:2])

    return suggested

def main():
    # 读取数据
    with open('/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/pk-check-batch-3.json', 'r') as f:
        articles = json.load(f)

    print(f"Processing {len(articles)} articles...")

    # 统计数据
    quality_dist = {
        'excellent': 0,  # 80-100
        'good': 0,       # 60-79
        'needs_improvement': 0,  # 40-59
        'poor': 0        # <40
    }

    needs_optimization = []

    # 处理每篇文章
    for article in articles:
        pk = article['primaryKeyword']
        title = article['title']
        topic = article['topicCluster']
        slug = article['slug']

        # 计算评分
        score, issues = calculate_score(pk, title, topic)

        # 更新统计
        if score >= 80:
            quality_dist['excellent'] += 1
        elif score >= 60:
            quality_dist['good'] += 1
        elif score >= 40:
            quality_dist['needs_improvement'] += 1
        else:
            quality_dist['poor'] += 1

        # 只记录需要优化的（分数<60）
        if score < 60:
            suggested = generate_suggestion(article)

            # 生成rationale
            rationale_parts = []
            if len(pk) < 30:
                rationale_parts.append(f"Extended from {len(pk)} to {len(suggested)} chars")
            elif len(pk) > 50:
                rationale_parts.append(f"Shortened from {len(pk)} to {len(suggested)} chars")

            if 'lacks_audience_or_scenario' in issues:
                rationale_parts.append("added audience/scenario")
            if 'unclear_search_intent' in issues:
                rationale_parts.append("clarified search intent")
            if 'too_many_medical_keywords' in issues:
                rationale_parts.append("simplified medical terms")

            rationale = "; ".join(rationale_parts) if rationale_parts else "optimized for clarity and search intent"

            needs_optimization.append({
                'slug': slug,
                'title': title,
                'current_keyword': pk,
                'score': score,
                'issues': issues,
                'suggested_keyword': suggested,
                'rationale': rationale
            })

    # 构建输出
    result = {
        'batch_id': 3,
        'total_articles': len(articles),
        'quality_distribution': quality_dist,
        'needs_optimization': needs_optimization
    }

    # 保存结果
    output_path = '/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/pk-check-result-3.json'
    with open(output_path, 'w') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"\n=== Quality Distribution ===")
    print(f"Excellent (80-100): {quality_dist['excellent']}")
    print(f"Good (60-79): {quality_dist['good']}")
    print(f"Needs Improvement (40-59): {quality_dist['needs_improvement']}")
    print(f"Poor (<40): {quality_dist['poor']}")
    print(f"\nTotal needing optimization (<60): {len(needs_optimization)}")
    print(f"\nResults saved to: {output_path}")

if __name__ == '__main__':
    main()
