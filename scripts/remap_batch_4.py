#!/usr/bin/env python3
"""
Batch 4文章重新映射脚本
将250篇文章映射到32个核心topicClusters
"""

import json
import re
from collections import Counter

# 32个核心clusters
CORE_CLUSTERS = [
    # 疾病管理类（7个）
    'cardiovascular-health',
    'hypertension-management',
    'diabetes-management',
    'cardiac-disease-management',
    'glucose-diabetes-management',
    'diabetes-glucose-management',
    'metabolic-syndrome-management',

    # 干预措施类（6个）
    'nutrition-diet-management',
    'lifestyle-interventions',
    'medication-safety',
    'treatment-interventions',
    'behavioral-mental-health',
    'natural-remedies',

    # 诊断监测类（3个）
    'symptoms-diagnosis',
    'monitoring-technology',
    'monitoring-diagnosis',

    # 影响因素类（7个）
    'circadian-sleep-health',
    'sleep-circadian-health',
    'circadian-sleep-metabolism',
    'circadian-metabolic-health',
    'environmental-factors',
    'environmental-health-factors',
    'mental-health-stress',

    # 特殊主题类（9个）
    'special-populations',
    'gastrointestinal-health',
    'complications-management',
    'cardiovascular-physiology',
    'metabolic-health',
    'renal-health',
    'autonomic-nervous-regulation',
    'comprehensive-health-topics',
    'prevention-risk-assessment'
]

def analyze_and_map(article):
    """分析文章并映射到核心cluster"""
    title = article.get('title', '').lower()
    description = article.get('description', '').lower()
    primary_keyword = article.get('primaryKeyword', '').lower()
    old_cluster = article.get('topicCluster', '')

    # 组合文本用于分析（标题权重更高）
    text = f"{title} {description} {primary_keyword}"
    title_text = title  # 单独保留标题用于优先判断

    # 规则0: 肾脏健康（高优先级，因为经常与其他疾病共存）
    if any(word in text for word in ['kidney', 'renal', 'ckd', 'nephropathy', 'creatinine', 'gfr', 'egfr']):
        # 如果标题明确提到CKD/肾脏，优先归类到肾脏健康
        if any(word in title_text for word in ['ckd', 'kidney', 'renal']):
            return 'renal-health', '标题明确涉及肾脏健康'
        # 如果是糖尿病肾病并发症
        elif any(word in text for word in ['diabetes', 'diabetic']) and any(word in text for word in ['nephropathy', 'complication']):
            return 'complications-management', '主题是糖尿病肾脏并发症'

    # 规则1: 高血压相关
    if any(word in text for word in ['hypertension', 'blood pressure', 'systolic', 'diastolic', 'bp ']):
        # 优先检查是否是症状识别主题
        if any(word in title_text for word in ['symptom', 'sign', 'signs', 'warning sign', 'red flag', 'silent sign']):
            return 'symptoms-diagnosis', '标题明确是症状识别主题'
        # 检查是否是用药主题
        elif any(word in title_text for word in ['medication', 'drug', 'pill', 'dosage']):
            return 'medication-safety', '标题明确涉及高血压用药管理'
        # 检查是否是监测技术
        elif any(word in title_text for word in ['monitor', 'device', 'technology', 'measurement', 'cuff', 'wearable']):
            return 'monitoring-technology', '标题明确涉及血压监测技术'
        # 检查是否是饮食相关
        elif any(word in text for word in ['diet', 'food', 'nutrition', 'eating', 'sodium', 'salt', 'meal', 'recipe']):
            if any(word in title_text for word in ['food', 'diet', 'eating', 'meal']):
                return 'hypertension-management', '主题是通过饮食管理高血压'
            else:
                return 'hypertension-management', '主题是高血压管理（涉及饮食）'
        else:
            return 'hypertension-management', '主题是高血压管理'

    # 规则2: 糖尿病/血糖相关
    if any(word in text for word in ['diabetes', 'diabetic', 'glucose', 'glycemic', 'hyperglycemia', 'hypoglycemia', 'a1c', 'hba1c', 'blood sugar', 'glycated albumin', 'fructosamine']):
        # 优先检查是否是症状识别主题
        if any(word in title_text for word in ['symptom', 'sign', 'signs', 'warning sign', 'red flag', 'silent sign']):
            return 'symptoms-diagnosis', '标题明确是症状识别主题'
        # 检查是否是实验室诊断主题
        elif any(word in title_text for word in ['lab clue', 'biomarker', 'earliest lab', 'lab sign', 'laboratory', 'lab test']) or ('lab' in title_text and 'clue' in title_text):
            return 'symptoms-diagnosis', '标题明确是实验室诊断主题'
        # 检查是否主要是肠道/微生物主题
        elif any(word in title_text for word in ['gut', 'microbiome', 'fungi', 'antibiotic']):
            return 'gastrointestinal-health', '标题明确涉及肠道健康'
        # 检查是否是用药主题
        elif any(word in title_text for word in ['medication', 'drug', 'insulin', 'metformin', 'antibiotic']):
            return 'medication-safety', '标题明确涉及糖尿病用药'
        # 检查是否是饮食主题
        elif any(word in text for word in ['diet', 'food', 'nutrition', 'eating', 'meal', 'recipe', 'snack']):
            if any(word in title_text for word in ['food', 'diet', 'eating', 'meal', 'snack', 'recipe']):
                return 'nutrition-diet-management', '标题明确是饮食营养主题（糖尿病背景）'
            else:
                return 'nutrition-diet-management', '主题是饮食营养管理（糖尿病背景）'
        # 检查是否是运动主题
        elif any(word in text for word in ['exercise', 'activity', 'physical', 'walking', 'fitness', 'yoga', 'resistance']):
            # 必须标题明确提到运动，否则不归类到运动
            if any(word in title_text for word in ['exercise', 'walk', 'yoga', 'activity', 'training', 'resistance protocols']):
                return 'lifestyle-interventions', '标题明确是运动生活方式主题（糖尿病背景）'
            # 如果只是描述中提到，仍归类到糖尿病管理
            else:
                return 'diabetes-management', '主题是糖尿病管理（非运动为主）'
        # 检查是否是监测技术
        elif any(word in text for word in ['monitor', 'cgm', 'device', 'technology', 'measurement', 'sensor']):
            return 'monitoring-technology', '主题是血糖监测技术'
        # 检查是否是并发症
        elif any(word in text for word in ['complication', 'comorbid', 'ckd', 'kidney', 'renal', 'neuropathy', 'retinopathy', 'gastroparesis']):
            return 'complications-management', '主题是糖尿病并发症'
        # 检查是否是急性病症触发的血糖问题
        elif any(word in title_text for word in ['trigger', 'cause', 'acute', 'sudden']):
            return 'diabetes-management', '主题是急性情况下的糖尿病管理'
        else:
            return 'diabetes-management', '主题是糖尿病综合管理'

    # 规则3: 心血管疾病
    if any(word in text for word in ['heart', 'cardiac', 'cardiovascular', 'coronary', 'myocardial', 'arrhythmia', 'atrial fibrillation', 'heart failure', 'stroke']):
        if any(word in text for word in ['disease', 'failure', 'infarction', 'arrhythmia']):
            return 'cardiac-disease-management', '主题是特定心脏疾病'
        else:
            return 'cardiovascular-health', '主题是心血管整体健康'

    # 规则4: 肾脏健康
    if any(word in text for word in ['kidney', 'renal', 'ckd', 'nephropathy', 'creatinine', 'gfr', 'egfr']):
        return 'renal-health', '主题是肾脏健康'

    # 规则5: 睡眠/昼夜节律
    if any(word in text for word in ['sleep', 'circadian', 'rhythm', 'insomnia', 'apnea']):
        return 'circadian-sleep-health', '主题是睡眠与昼夜节律'

    # 规则6: 症状诊断和实验室检测（高优先级，需要在运动之前检查）
    if any(word in title_text for word in ['lab clue', 'biomarker', 'earliest lab', 'lab sign', 'laboratory', 'lab test']) or ('lab' in title_text and 'clue' in title_text):
        return 'symptoms-diagnosis', '标题明确是实验室诊断主题'

    # 规则7: 饮食营养（通用）
    if any(word in text for word in ['diet', 'nutrition', 'food', 'eating', 'meal', 'mediterranean', 'dash', 'keto', 'fasting', 'recipe', 'snack']):
        if any(word in title_text for word in ['food', 'diet', 'eating', 'meal', 'recipe', 'snack', 'nutrition']):
            return 'nutrition-diet-management', '标题明确是饮食营养主题'
        return 'nutrition-diet-management', '主题是饮食营养管理'

    # 规则8: 运动生活方式（需要标题明确提到运动）
    if any(word in title_text for word in ['exercise', 'walk', 'yoga', 'activity', 'fitness', 'training', 'resistance band', 'resistance training']):
        # 检查是否是监测相关（避免错误分类）
        if any(word in title_text for word in ['monitor', 'measure', 'track']):
            return 'monitoring-technology', '主题是运动监测技术'
        return 'lifestyle-interventions', '标题明确是运动与生活方式主题'

    # 规则9: 药物相关
    if any(word in text for word in ['medication', 'drug', 'pill', 'prescription', 'dosage', 'pharmacology']):
        return 'medication-safety', '主题是药物安全与管理'

    # 规则10: 消化系统
    if any(word in text for word in ['gut', 'digestive', 'microbiome', 'gastrointestinal', 'bowel', 'stomach']):
        return 'gastrointestinal-health', '主题是消化系统健康'

    # 规则11: 心理健康/压力
    if any(word in text for word in ['stress', 'anxiety', 'mental', 'depression', 'psychological', 'emotional']):
        return 'mental-health-stress', '主题是心理健康与压力'

    # 规则12: 环境因素
    if any(word in title_text for word in ['environment', 'seasonal', 'weather', 'temperature', 'pollution', 'climate']):
        return 'environmental-factors', '标题明确是环境因素主题'

    # 规则13: 症状诊断（通用，包括标题中的症状关键词）
    if any(word in title_text for word in ['symptom', 'sign', 'signs', 'warning sign', 'red flag', 'silent sign']):
        return 'symptoms-diagnosis', '标题明确是症状识别主题'
    elif any(word in text for word in ['symptom', 'sign', 'diagnosis', 'detection', 'screening', 'warning']):
        return 'symptoms-diagnosis', '主题是症状识别与诊断'

    # 规则14: 特殊人群（需要标题明确针对特定人群且无其他主要主题）
    if any(word in title_text for word in ['in women', 'in men', 'gender difference', 'pcos history']):
        # 如果标题同时提到特定疾病，优先疾病
        if not any(word in title_text for word in ['hypertension', 'diabetes', 'heart', 'kidney', 'blood pressure', 'glucose', 'insulin resistance']):
            return 'special-populations', '标题明确针对特殊人群'
        # 如果是胰岛素抵抗相关，归到代谢健康
        elif 'insulin resistance' in title_text:
            return 'metabolic-health', '主题是代谢健康（特殊人群）'

    # 规则15: 并发症
    if any(word in text for word in ['complication', 'comorbid', 'multimorbidity']):
        return 'complications-management', '主题是并发症管理'

    # 规则16: 预防与风险
    if any(word in text for word in ['prevention', 'risk', 'assessment', 'predict']):
        return 'prevention-risk-assessment', '主题是疾病预防与风险评估'

    # 规则17: 自然疗法
    if any(word in text for word in ['natural', 'supplement', 'herb', 'vitamin', 'alternative', 'complementary']):
        return 'natural-remedies', '主题是天然疗法'

    # 规则18: 代谢健康
    if any(word in text for word in ['metabolic', 'metabolism', 'insulin resistance']):
        return 'metabolic-health', '主题是代谢健康'

    # 默认：综合健康主题
    return 'comprehensive-health-topics', '未能明确分类，归入综合健康主题'

def main():
    # 读取输入文件
    with open('/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/remap-batch-4.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    articles = data['articles']
    total_articles = len(articles)

    print(f"开始处理 Batch 4: {total_articles} 篇文章")

    # 映射结果
    mappings = []
    cluster_counter = Counter()

    for idx, article in enumerate(articles, 1):
        slug = article['slug']
        old_cluster = article.get('topicCluster', '')

        # 执行映射
        new_cluster, rationale = analyze_and_map(article)

        # 验证new_cluster在核心列表中
        if new_cluster not in CORE_CLUSTERS:
            print(f"警告: {slug} 映射到了无效的cluster: {new_cluster}")
            new_cluster = 'comprehensive-health-topics'
            rationale = '默认归类'

        mappings.append({
            'slug': slug,
            'old_cluster': old_cluster,
            'new_cluster': new_cluster,
            'rationale': rationale
        })

        cluster_counter[new_cluster] += 1

        if idx % 50 == 0:
            print(f"已处理 {idx}/{total_articles} 篇文章...")

    # 生成输出
    output = {
        'batch_id': 4,
        'total_articles': total_articles,
        'mappings': mappings
    }

    # 写入输出文件
    output_path = '/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/remap-result-4.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n✓ 映射完成!")
    print(f"  - 总文章数: {total_articles}")
    print(f"  - 输出文件: {output_path}")
    print(f"\n最常见的3个新cluster:")
    for cluster, count in cluster_counter.most_common(3):
        print(f"  - {cluster}: {count} 篇")

    # 显示所有cluster分布
    print(f"\n所有cluster分布:")
    for cluster, count in sorted(cluster_counter.items(), key=lambda x: -x[1]):
        print(f"  - {cluster}: {count} 篇")

if __name__ == '__main__':
    main()
