#!/usr/bin/env python3
"""
重新审查 PrimaryKeyword 质量
使用更严格的标准和人工规则判断是否真的需要优化
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
    'management', 'control', 'prevention', 'reduction', 'monitoring'
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
        r'\d+\+',  # 60+, 70+
        r'over \d+',  # over 60
        r'\d+-\d+',  # 60-70
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
    """检查是否过度医学化（用户不会搜索的术语）"""
    technical_terms = [
        'pheochromocytoma', 'metanephrines', 'augmentation index',
        'connexin-43', 'phosphorylation', 'encephalopathy',
        'tmao', 'cyp2c9', 'qtc prolongation', 'vasopressin-mimetic',
        'baroreceptor', 'repolarization reserve', 'myocardial fibrosis',
        'tachycardia-induced cardiomyopathy'
    ]
    keyword_lower = keyword.lower()
    for term in technical_terms:
        if term in keyword_lower:
            return True
    return False

def evaluate_keyword_quality(keyword: str, title: str, topic_cluster: str) -> Tuple[int, List[str], str]:
    """
    重新评估关键词质量
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
        rationale_parts.append('Contains overly technical terms users rarely search')

    # 4. 关键词堆砌检查（-10分）
    words = keyword.lower().split()
    if len(words) != len(set(words)):  # 有重复单词
        score -= 10
        issues.append('keyword_stuffing')
        rationale_parts.append('Contains repeated words')

    # 5. 自然度检查（-10分）
    # 检查是否有明显的不自然连接
    if re.search(r'\b(and|or|vs|with|for|from|after|before|during|without)\b', keyword.lower()):
        # 有连接词，更自然
        pass
    else:
        # 没有连接词，检查是否只是词汇堆砌
        if len(words) >= 4 and not any(w in keyword.lower() for w in ['management', 'control', 'monitoring', 'prevention']):
            score -= 5
            rationale_parts.append('May lack natural phrasing')

    # 确保分数在0-100范围
    score = max(0, min(100, score))

    # 生成理由
    if rationale_parts:
        rationale = '; '.join(rationale_parts)
    else:
        rationale = 'Meets quality standards'

    return score, issues, rationale

def generate_optimized_keyword(keyword: str, title: str, topic_cluster: str, issues: List[str]) -> str:
    """
    基于文章title和topicCluster生成优化后的关键词
    """
    # 提取title中的关键信息
    title_lower = title.lower()

    # 提取核心医疗主题
    core_topic = None
    for term in ['blood pressure', 'diabetes', 'heart', 'cholesterol', 'stroke', 'kidney', 'glucose', 'hypertension']:
        if term in title_lower:
            core_topic = term
            break

    # 如果title中没有，从topicCluster提取
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

    # 提取场景（如果有）
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
        # 添加限定词
        if 'management' not in optimized:
            optimized = optimized.replace(core_topic.split()[0], f"{core_topic.split()[0]} management", 1)

    if len(optimized) > 50:
        # 简化
        optimized = optimized[:50].rsplit(' ', 1)[0]

    return optimized.strip()

def main():
    print("🔄 重新审查 PrimaryKeyword 质量...")
    print("=" * 80)

    # 读取原始audit结果
    with open('data/primary-keyword-audit.json', 'r', encoding='utf-8') as f:
        old_audit = json.load(f)

    print(f"\n📊 原始audit报告: {len(old_audit['needs_optimization'])} 篇文章被标记需要优化")

    # 读取完整文章列表
    with open('data/articles-index.json', 'r', encoding='utf-8') as f:
        all_articles = json.load(f)

    # 创建slug到文章的映射
    article_map = {article['slug']: article for article in all_articles}

    # 重新评估
    truly_needs_optimization = []
    false_positives = []

    for item in old_audit['needs_optimization']:
        slug = item['slug']
        current_keyword = item['current_keyword']

        # 获取完整文章信息
        article = article_map.get(slug)
        if not article:
            continue

        title = article['title']
        topic_cluster = article.get('topicCluster', '')

        # 重新评估
        new_score, new_issues, rationale = evaluate_keyword_quality(current_keyword, title, topic_cluster)

        # 只有分数<60才真正需要优化
        if new_score < 60:
            optimized = generate_optimized_keyword(current_keyword, title, topic_cluster, new_issues)

            truly_needs_optimization.append({
                'slug': slug,
                'title': title,
                'topicCluster': topic_cluster,
                'current_keyword': current_keyword,
                'old_score': item['score'],
                'new_score': new_score,
                'issues': new_issues,
                'suggested_keyword': optimized,
                'rationale': rationale
            })
        else:
            false_positives.append({
                'slug': slug,
                'current_keyword': current_keyword,
                'old_score': item['score'],
                'new_score': new_score,
                'reason': 'Re-evaluation shows this keyword meets quality standards'
            })

    # 统计
    print(f"\n✅ 重新评估完成:")
    print(f"   原标记需优化: {len(old_audit['needs_optimization'])} 篇")
    print(f"   实际需优化: {len(truly_needs_optimization)} 篇 ({len(truly_needs_optimization)/len(old_audit['needs_optimization'])*100:.1f}%)")
    print(f"   误报（实际合格）: {len(false_positives)} 篇 ({len(false_positives)/len(old_audit['needs_optimization'])*100:.1f}%)")

    # 按分数分类
    critical = [x for x in truly_needs_optimization if x['new_score'] < 40]
    needs_improvement = [x for x in truly_needs_optimization if 40 <= x['new_score'] < 60]

    print(f"\n📊 真正需要优化的文章分布:")
    print(f"   🔴 严重问题 (<40分): {len(critical)} 篇")
    print(f"   🟠 需要改进 (40-59分): {len(needs_improvement)} 篇")

    # 保存结果
    final_audit = {
        'audit_version': '2.0 (re-evaluated with stricter standards)',
        'total_articles_checked': 2209,
        'originally_flagged': len(old_audit['needs_optimization']),
        'truly_needs_optimization': len(truly_needs_optimization),
        'false_positive_rate': f"{len(false_positives)/len(old_audit['needs_optimization'])*100:.1f}%",
        'quality_distribution': {
            'critical': len(critical),
            'needs_improvement': len(needs_improvement)
        },
        'needs_optimization': truly_needs_optimization,
        'false_positives_summary': {
            'count': len(false_positives),
            'note': 'These keywords were originally flagged but meet quality standards upon re-evaluation'
        }
    }

    output_path = 'data/primary-keyword-audit-v2.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_audit, f, ensure_ascii=False, indent=2)

    print(f"\n💾 重新审查结果已保存: {output_path}")

    # 展示样例
    print(f"\n" + "=" * 80)
    print("🔴 严重问题案例 (前5个):")
    print("=" * 80)
    for i, article in enumerate(critical[:5], 1):
        print(f"\n{i}. {article['title'][:70]}...")
        print(f"   当前: \"{article['current_keyword']}\" (长度: {len(article['current_keyword'])}, 分数: {article['new_score']}/100)")
        print(f"   问题: {', '.join(article['issues'])}")
        print(f"   建议: \"{article['suggested_keyword']}\" (长度: {len(article['suggested_keyword'])})")
        print(f"   理由: {article['rationale']}")

    print(f"\n" + "=" * 80)
    print("🟠 需要改进案例 (前5个):")
    print("=" * 80)
    for i, article in enumerate(needs_improvement[:5], 1):
        print(f"\n{i}. {article['title'][:70]}...")
        print(f"   当前: \"{article['current_keyword']}\" (长度: {len(article['current_keyword'])}, 分数: {article['new_score']}/100)")
        print(f"   问题: {', '.join(article['issues'])}")
        print(f"   建议: \"{article['suggested_keyword']}\" (长度: {len(article['suggested_keyword'])})")
        print(f"   理由: {article['rationale']}")

    print(f"\n" + "=" * 80)
    print("✅ 误报案例 (被错误标记，实际合格，前5个):")
    print("=" * 80)
    for i, item in enumerate(false_positives[:5], 1):
        print(f"\n{i}. Slug: {item['slug'][:60]}...")
        print(f"   关键词: \"{item['current_keyword']}\" (长度: {len(item['current_keyword'])})")
        print(f"   原评分: {item['old_score']}/100 → 新评分: {item['new_score']}/100")
        print(f"   结论: {item['reason']}")

if __name__ == '__main__':
    main()
