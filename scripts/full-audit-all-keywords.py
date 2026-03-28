#!/usr/bin/env python3
"""
完整检查所有2209篇文章的PrimaryKeyword质量
使用与re-audit相同的严格标准
"""

import json
import re
from typing import List, Dict, Tuple

# 核心医疗关键词列表
CORE_MEDICAL_KEYWORDS = {
    'blood pressure', 'bp', 'hypertension', 'hypotension', 'systolic', 'diastolic',
    'diabetes', 'diabetic', 'glucose', 'blood sugar', 'insulin', 'glycemic', 'a1c', 'hba1c',
    'heart', 'cardiac', 'cardiovascular', 'coronary', 'artery', 'angina', 'afib', 'atrial',
    'cholesterol', 'ldl', 'hdl', 'triglycerides', 'lipid',
    'stroke', 'tia', 'ischemic', 'hemorrhagic',
    'kidney', 'renal', 'creatinine', 'egfr',
    'diet', 'nutrition', 'food', 'meal', 'eating',
    'exercise', 'activity', 'walking', 'movement',
    'sleep', 'insomnia', 'apnea',
    'weight', 'obesity', 'bmi',
    'medication', 'drug', 'pill', 'treatment',
    'seniors', 'elderly', 'older adults', 'aging', 'age',
    'management', 'control', 'prevention', 'reduction', 'monitoring',
    'health', 'wellness'
}

def has_core_medical_keyword(keyword: str) -> bool:
    """检查是否包含核心医疗关键词"""
    keyword_lower = keyword.lower()
    for medical_term in CORE_MEDICAL_KEYWORDS:
        if medical_term in keyword_lower:
            return True
    return False

def has_age_or_audience(keyword: str) -> bool:
    """检查是否包含年龄或受众标识"""
    patterns = [
        r'\d+\+',
        r'over \d+',
        r'\d+-\d+',
        r'seniors?',
        r'elderly',
        r'older adults?',
        r'adults?',
        r'women',
        r'men',
    ]
    keyword_lower = keyword.lower()
    for pattern in patterns:
        if re.search(pattern, keyword_lower):
            return True
    return False

def has_scenario_context(keyword: str) -> bool:
    """检查是否包含场景标识"""
    scenario_keywords = [
        'holiday', 'winter', 'summer', 'morning', 'evening', 'night', 'nighttime',
        'post-meal', 'after eating', 'fasting', 'exercise', 'stress', 'travel',
        'home', 'work', 'outdoor', 'indoor'
    ]
    keyword_lower = keyword.lower()
    for scenario in scenario_keywords:
        if scenario in keyword_lower:
            return True
    return False

def is_overly_technical(keyword: str) -> bool:
    """检查是否过度医学化"""
    technical_terms = [
        'pheochromocytoma', 'metanephrines', 'augmentation index',
        'connexin-43', 'phosphorylation', 'encephalopathy',
        'tmao', 'cyp2c9', 'qtc prolongation', 'vasopressin-mimetic',
        'baroreceptor', 'repolarization reserve', 'myocardial fibrosis',
        'tachycardia-induced cardiomyopathy', 'galectin-3',
        'prostacyclin', 'thromboxane', 'endothelial nitric oxide synthase'
    ]
    keyword_lower = keyword.lower()
    for term in technical_terms:
        if term in keyword_lower:
            return True
    return False

def evaluate_keyword_quality(keyword: str, title: str, topic_cluster: str) -> Tuple[int, List[str], str]:
    """
    评估关键词质量
    返回: (分数, 问题列表, 评估理由)
    """
    issues = []
    score = 100
    rationale_parts = []

    length = len(keyword)

    # 1. 长度检查（20分）
    if length < 25:
        score -= 20
        issues.append('too_short')
        rationale_parts.append(f'Too short ({length} chars, need 25-60)')
    elif length > 60:
        score -= 20
        issues.append('too_long')
        rationale_parts.append(f'Too long ({length} chars, need 25-60)')
    elif 25 <= length <= 30 or 51 <= length <= 60:
        score -= 5
        rationale_parts.append(f'Length acceptable but not optimal ({length} chars)')

    # 2. 结构完整性（30分）
    has_medical = has_core_medical_keyword(keyword)
    has_audience = has_age_or_audience(keyword)
    has_scenario = has_scenario_context(keyword)

    if not has_medical:
        score -= 25
        issues.append('no_core_medical_keyword')
        rationale_parts.append('Missing core medical keyword')

    if not has_audience and not has_scenario:
        score -= 15
        issues.append('lacks_audience_or_scenario')
        rationale_parts.append('Missing audience/scenario identifier')
    elif not has_audience:
        score -= 5
        rationale_parts.append('Has scenario but missing audience')

    # 3. 过度技术化（-15分）
    if is_overly_technical(keyword):
        score -= 15
        issues.append('overly_technical')
        rationale_parts.append('Contains overly technical terms')

    # 4. 关键词堆砌检查（-10分）
    words = keyword.lower().split()
    if len(words) != len(set(words)):
        score -= 10
        issues.append('keyword_stuffing')
        rationale_parts.append('Contains repeated words')

    # 5. 自然度检查（-10分）
    if re.search(r'\b(and|or|vs|with|for|from|after|before|during|without)\b', keyword.lower()):
        pass
    else:
        if len(words) >= 4 and not any(w in keyword.lower() for w in ['management', 'control', 'monitoring', 'prevention']):
            score -= 5
            rationale_parts.append('May lack natural phrasing')

    score = max(0, min(100, score))

    if rationale_parts:
        rationale = '; '.join(rationale_parts)
    else:
        rationale = 'Meets quality standards'

    return score, issues, rationale

def generate_optimized_keyword(keyword: str, title: str, topic_cluster: str, issues: List[str]) -> str:
    """基于title和topicCluster生成优化建议"""
    title_lower = title.lower()

    # 提取核心医疗主题
    core_topic = None
    for term in ['blood pressure', 'diabetes', 'heart', 'cholesterol', 'stroke', 'kidney', 'glucose', 'hypertension']:
        if term in title_lower:
            core_topic = term
            break

    if not core_topic:
        cluster_map = {
            'blood-pressure-monitoring': 'blood pressure monitoring',
            'diabetes-management': 'diabetes management',
            'heart-health': 'heart health',
            'cholesterol-lipids': 'cholesterol management',
            'nutrition-diet-management': 'diet management',
            'exercise-physical-activity': 'exercise seniors',
            'sleep-management': 'sleep quality',
            'medication-management': 'medication safety',
            'weight-management': 'weight management'
        }
        core_topic = cluster_map.get(topic_cluster, 'health management')

    # 提取年龄/受众
    age_match = re.search(r'(over \d+|adults \d+[-+]|seniors \d+|women \d+|men \d+|\d+\+)', title_lower)
    audience = age_match.group(1) if age_match else 'seniors'

    # 提取场景
    scenario = None
    for s in ['holiday', 'winter', 'summer', 'morning', 'nighttime', 'post-meal']:
        if s in title_lower:
            scenario = s
            break

    # 组合关键词
    if scenario:
        optimized = f"{core_topic} {scenario} {audience}"
    else:
        optimized = f"{core_topic} {audience}"

    # 确保长度在30-50字符
    if len(optimized) < 30:
        if 'management' not in optimized:
            optimized = optimized.replace(core_topic.split()[0], f"{core_topic.split()[0]} management", 1)

    if len(optimized) > 50:
        optimized = optimized[:50].rsplit(' ', 1)[0]

    return optimized.strip()

def main():
    print("🔍 完整检查所有2209篇文章的PrimaryKeyword质量...")
    print("=" * 80)

    # 读取映射JSON
    with open('data/primary-keyword-mapping.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    all_articles = data['all_mappings']
    total = len(all_articles)

    print(f"\n📊 总文章数: {total}")
    print(f"开始逐个检查...\n")

    # 质量统计
    quality_dist = {
        'excellent': [],      # 80-100
        'good': [],           # 60-79
        'needs_improvement': [],  # 40-59
        'poor': []            # <40
    }

    needs_optimization = []

    # 逐个检查
    for i, article in enumerate(all_articles, 1):
        slug = article['slug']
        title = article['title']
        keyword = article['primaryKeyword']
        cluster = article['topicCluster']

        # 评估质量
        score, issues, rationale = evaluate_keyword_quality(keyword, title, cluster)

        # 分类
        if score >= 80:
            quality_dist['excellent'].append({'slug': slug, 'score': score})
        elif score >= 60:
            quality_dist['good'].append({'slug': slug, 'score': score})
        elif score >= 40:
            quality_dist['needs_improvement'].append({'slug': slug, 'score': score})
        else:
            quality_dist['poor'].append({'slug': slug, 'score': score})

        # 需要优化（<60分）
        if score < 60:
            optimized = generate_optimized_keyword(keyword, title, cluster, issues)
            needs_optimization.append({
                'slug': slug,
                'title': title,
                'topicCluster': cluster,
                'current_keyword': keyword,
                'score': score,
                'issues': issues,
                'suggested_keyword': optimized,
                'rationale': rationale
            })

        # 进度显示（每100篇）
        if i % 100 == 0:
            print(f"   进度: {i}/{total} ({i/total*100:.1f}%)")

    print(f"\n✅ 检查完成!\n")

    # 统计结果
    print("=" * 80)
    print("📊 质量分布:")
    print("=" * 80)
    print(f"🟢 优秀 (80-100分): {len(quality_dist['excellent'])} 篇 ({len(quality_dist['excellent'])/total*100:.1f}%)")
    print(f"🟡 良好 (60-79分): {len(quality_dist['good'])} 篇 ({len(quality_dist['good'])/total*100:.1f}%)")
    print(f"🟠 需改进 (40-59分): {len(quality_dist['needs_improvement'])} 篇 ({len(quality_dist['needs_improvement'])/total*100:.1f}%)")
    print(f"🔴 不合格 (<40分): {len(quality_dist['poor'])} 篇 ({len(quality_dist['poor'])/total*100:.1f}%)")
    print()
    print(f"✅ 通过率 (≥60分): {(len(quality_dist['excellent']) + len(quality_dist['good']))/total*100:.1f}%")
    print(f"⚠️  需优化: {len(needs_optimization)} 篇 ({len(needs_optimization)/total*100:.1f}%)")

    # 保存完整报告
    full_report = {
        'audit_version': 'Full Check v1.0',
        'audit_date': '2026-03-06',
        'total_articles_checked': total,
        'quality_distribution': {
            'excellent': {
                'count': len(quality_dist['excellent']),
                'percentage': f"{len(quality_dist['excellent'])/total*100:.1f}%",
                'articles': quality_dist['excellent']
            },
            'good': {
                'count': len(quality_dist['good']),
                'percentage': f"{len(quality_dist['good'])/total*100:.1f}%",
                'articles': quality_dist['good']
            },
            'needs_improvement': {
                'count': len(quality_dist['needs_improvement']),
                'percentage': f"{len(quality_dist['needs_improvement'])/total*100:.1f}%",
                'articles': quality_dist['needs_improvement']
            },
            'poor': {
                'count': len(quality_dist['poor']),
                'percentage': f"{len(quality_dist['poor'])/total*100:.1f}%",
                'articles': quality_dist['poor']
            }
        },
        'pass_rate': f"{(len(quality_dist['excellent']) + len(quality_dist['good']))/total*100:.1f}%",
        'needs_optimization': needs_optimization
    }

    output_path = 'data/full-primary-keyword-audit.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(full_report, f, ensure_ascii=False, indent=2)

    print(f"\n💾 完整审计报告已保存: {output_path}")

    # 展示样例
    if len(needs_optimization) > 0:
        print(f"\n" + "=" * 80)
        print("🔴 需要优化的案例 (前10个):")
        print("=" * 80)
        for i, article in enumerate(sorted(needs_optimization, key=lambda x: x['score'])[:10], 1):
            print(f"\n{i}. {article['title'][:70]}...")
            print(f"   当前: \"{article['current_keyword']}\" (长度: {len(article['current_keyword'])}, 分数: {article['score']}/100)")
            print(f"   问题: {', '.join(article['issues'])}")
            print(f"   建议: \"{article['suggested_keyword']}\" (长度: {len(article['suggested_keyword'])})")

    print("\n" + "=" * 80)
    print("✨ 完整检查完成!")
    print("=" * 80)

if __name__ == '__main__':
    main()
