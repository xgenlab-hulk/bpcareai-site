#!/usr/bin/env python3
"""
严格验证50篇测试文章的优化结果
使用独立的评分标准确保质量
"""

import json
import re

# 严格的核心医疗关键词（不包括泛化词）
STRICT_MEDICAL_KEYWORDS = {
    'blood pressure', 'bp', 'hypertension', 'hypotension', 'systolic', 'diastolic',
    'diabetes', 'diabetic', 'glucose', 'blood sugar', 'insulin', 'a1c', 'hba1c',
    'heart', 'cardiac', 'cardiovascular', 'coronary', 'artery', 'cholesterol',
    'stroke', 'tia', 'kidney', 'renal',
    'sleep apnea', 'digestive', 'mental health', 'stress'
}

# 过度技术化术语（应避免）
TECHNICAL_TERMS = {
    'tmao', 'endothelial', 'phosphorylation', 'connexin', 'pheochromocytoma',
    'metanephrines', 'baroreceptor', 'repolarization', 'cyp2c9',
    'encephalopathy', 'galectin', 'prostacyclin', 'thromboxane'
}

def has_real_medical_topic(keyword):
    """检查是否包含真正的医疗主题词"""
    keyword_lower = keyword.lower()
    return any(term in keyword_lower for term in STRICT_MEDICAL_KEYWORDS)

def has_audience(keyword):
    """检查是否包含受众标识"""
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
        r'families',
        r'caregivers'
    ]
    keyword_lower = keyword.lower()
    return any(re.search(pattern, keyword_lower) for pattern in patterns)

def has_technical_terms(keyword):
    """检查是否包含过度技术化术语"""
    keyword_lower = keyword.lower()
    return any(term in keyword_lower for term in TECHNICAL_TERMS)

def has_generic_main_topic(keyword):
    """检查是否使用泛化词作为主词"""
    # 检查关键词开头是否是泛化词
    keyword_lower = keyword.lower().strip()
    generic_starts = ['health ', 'wellness ', 'management ']
    return any(keyword_lower.startswith(term) for term in generic_starts)

def has_natural_phrasing(keyword):
    """检查是否自然短语"""
    # 有连接词或动词
    connecting_words = ['for', 'in', 'with', 'and', 'or', 'of', 'to', 'from',
                        'management', 'control', 'prevention', 'monitoring']
    keyword_lower = keyword.lower()
    return any(word in keyword_lower for word in connecting_words)

def has_keyword_stuffing(keyword):
    """检查是否关键词堆砌（有重复单词）"""
    words = keyword.lower().split()
    return len(words) != len(set(words))

def strict_score_keyword(keyword):
    """
    严格评分关键词
    返回: (score, issues, breakdown)
    """
    score = 100
    issues = []
    breakdown = {}

    # 1. 真正的医疗主题词（40分）
    if has_real_medical_topic(keyword):
        breakdown['real_medical_topic'] = 40
    else:
        breakdown['real_medical_topic'] = 0
        score -= 40
        issues.append('no_real_medical_topic')

    # 2. 受众标识（20分）
    if has_audience(keyword):
        breakdown['has_audience'] = 20
    else:
        breakdown['has_audience'] = 0
        score -= 20
        issues.append('no_audience')

    # 3. 长度（15分）
    length = len(keyword)
    if 30 <= length <= 50:
        breakdown['optimal_length'] = 15
    elif 25 <= length < 30 or 50 < length <= 60:
        breakdown['optimal_length'] = 10
        score -= 5
        issues.append('suboptimal_length')
    else:
        breakdown['optimal_length'] = 0
        score -= 15
        issues.append('bad_length')

    # 4. 自然短语（10分）
    if has_natural_phrasing(keyword):
        breakdown['natural_phrasing'] = 10
    else:
        breakdown['natural_phrasing'] = 5
        score -= 5
        issues.append('unnatural_phrasing')

    # 5. 避免技术术语（10分）
    if not has_technical_terms(keyword):
        breakdown['avoids_technical'] = 10
    else:
        breakdown['avoids_technical'] = 0
        score -= 10
        issues.append('has_technical_terms')

    # 6. 避免泛化主词（5分）
    if not has_generic_main_topic(keyword):
        breakdown['avoids_generic'] = 5
    else:
        breakdown['avoids_generic'] = 0
        score -= 5
        issues.append('generic_main_topic')

    # 7. 避免关键词堆砌（扣分项）
    if has_keyword_stuffing(keyword):
        score -= 10
        issues.append('keyword_stuffing')
        breakdown['no_stuffing'] = -10
    else:
        breakdown['no_stuffing'] = 0

    score = max(0, min(100, score))

    return score, issues, breakdown

def main():
    print("🔍 严格验证测试结果...")
    print("=" * 80)

    # 读取测试结果
    with open('data/test-optimization-results.json', 'r', encoding='utf-8') as f:
        results = json.load(f)

    total = len(results)
    print(f"\n📊 测试文章数: {total}\n")

    # 验证每个优化结果
    validation_results = []
    pass_count = 0
    score_sum = 0

    for i, result in enumerate(results, 1):
        slug = result['slug']
        current_kw = result['current_keyword']
        optimized_kw = result['optimized_keyword']
        agent_score = result['score_after']

        # 独立评分
        actual_score, issues, breakdown = strict_score_keyword(optimized_kw)

        passed = actual_score >= 85
        if passed:
            pass_count += 1

        score_sum += actual_score

        validation_results.append({
            'slug': slug,
            'current_keyword': current_kw,
            'optimized_keyword': optimized_kw,
            'agent_claimed_score': agent_score,
            'actual_score': actual_score,
            'passed': passed,
            'issues': issues,
            'score_breakdown': breakdown
        })

        # 进度显示
        if i % 10 == 0:
            print(f"   进度: {i}/{total} ({i/total*100:.0f}%)")

    # 统计结果
    avg_score = score_sum / total
    pass_rate = pass_count / total * 100

    # 按分数分类
    excellent = [r for r in validation_results if r['actual_score'] >= 90]
    good = [r for r in validation_results if 85 <= r['actual_score'] < 90]
    needs_improvement = [r for r in validation_results if 70 <= r['actual_score'] < 85]
    poor = [r for r in validation_results if r['actual_score'] < 70]

    print(f"\n✅ 验证完成!\n")
    print("=" * 80)
    print("📊 验证结果统计:")
    print("=" * 80)
    print(f"\n总测试数: {total}")
    print(f"平均分数: {avg_score:.1f}/100")
    print(f"通过率 (≥85分): {pass_rate:.1f}% ({pass_count}/{total})")
    print()
    print(f"质量分布:")
    print(f"  🟢 优秀 (90-100分): {len(excellent)} 篇 ({len(excellent)/total*100:.1f}%)")
    print(f"  🟡 良好 (85-89分): {len(good)} 篇 ({len(good)/total*100:.1f}%)")
    print(f"  🟠 需改进 (70-84分): {len(needs_improvement)} 篇 ({len(needs_improvement)/total*100:.1f}%)")
    print(f"  🔴 不合格 (<70分): {len(poor)} 篇 ({len(poor)/total*100:.1f}%)")

    # 问题统计
    all_issues = {}
    for result in validation_results:
        for issue in result['issues']:
            all_issues[issue] = all_issues.get(issue, 0) + 1

    if all_issues:
        print(f"\n问题类型统计:")
        for issue, count in sorted(all_issues.items(), key=lambda x: -x[1]):
            print(f"  - {issue}: {count} 次")

    # 展示未通过的案例
    if needs_improvement or poor:
        print(f"\n" + "=" * 80)
        print("⚠️ 未达85分的案例:")
        print("=" * 80)

        failed = needs_improvement + poor
        for i, result in enumerate(sorted(failed, key=lambda x: x['actual_score'])[:10], 1):
            print(f"\n{i}. 分数: {result['actual_score']}/100")
            print(f"   优化后: \"{result['optimized_keyword']}\" ({len(result['optimized_keyword'])} chars)")
            print(f"   问题: {', '.join(result['issues'])}")
            print(f"   评分明细: {result['score_breakdown']}")

    # 展示优秀案例
    if excellent:
        print(f"\n" + "=" * 80)
        print("✨ 优秀案例 (90+分, 前5个):")
        print("=" * 80)

        for i, result in enumerate(excellent[:5], 1):
            print(f"\n{i}. 分数: {result['actual_score']}/100")
            print(f"   优化前: \"{result['current_keyword']}\"")
            print(f"   优化后: \"{result['optimized_keyword']}\"")

    # 保存验证报告
    validation_report = {
        'total_tested': total,
        'pass_count': pass_count,
        'pass_rate': f"{pass_rate:.1f}%",
        'average_score': round(avg_score, 1),
        'quality_distribution': {
            'excellent': len(excellent),
            'good': len(good),
            'needs_improvement': len(needs_improvement),
            'poor': len(poor)
        },
        'issue_statistics': all_issues,
        'detailed_results': validation_results
    }

    with open('data/test-validation-report.json', 'w', encoding='utf-8') as f:
        json.dump(validation_report, f, ensure_ascii=False, indent=2)

    print(f"\n💾 验证报告已保存: data/test-validation-report.json")

    # 结论
    print(f"\n" + "=" * 80)
    print("🎯 测试结论:")
    print("=" * 80)

    if pass_rate >= 90:
        print(f"✅ 测试通过! 通过率 {pass_rate:.1f}% ≥ 90%")
        print(f"✅ Sub-agent + Skill 组合有效，可以继续全量优化2209篇文章")
    elif pass_rate >= 60:
        print(f"⚠️  测试部分通过。通过率 {pass_rate:.1f}% 在60-90%之间")
        print(f"⚠️  建议：调整skill文档后重新测试")
    else:
        print(f"❌ 测试未通过。通过率 {pass_rate:.1f}% < 60%")
        print(f"❌ 需要重新设计优化策略")

    print("=" * 80)

if __name__ == '__main__':
    main()
