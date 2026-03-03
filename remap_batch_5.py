#!/usr/bin/env python3
"""
重新映射Batch 5的250篇文章到32个核心topicClusters
"""

import json
import re
from collections import Counter

# 32个核心clusters
CORE_CLUSTERS = [
    # 疾病管理类
    "cardiovascular-health",
    "hypertension-management",
    "diabetes-management",
    "cardiac-disease-management",
    "glucose-diabetes-management",
    "diabetes-glucose-management",
    "metabolic-syndrome-management",
    # 干预措施类
    "nutrition-diet-management",
    "lifestyle-interventions",
    "medication-safety",
    "treatment-interventions",
    "behavioral-mental-health",
    "natural-remedies",
    # 诊断监测类
    "symptoms-diagnosis",
    "monitoring-technology",
    "monitoring-diagnosis",
    # 影响因素类
    "circadian-sleep-health",
    "sleep-circadian-health",
    "circadian-sleep-metabolism",
    "circadian-metabolic-health",
    "environmental-factors",
    "environmental-health-factors",
    "mental-health-stress",
    # 特殊主题类
    "special-populations",
    "gastrointestinal-health",
    "complications-management",
    "cardiovascular-physiology",
    "metabolic-health",
    "renal-health",
    "autonomic-nervous-regulation",
    "comprehensive-health-topics",
    "prevention-risk-assessment",
]


def map_article_to_cluster(article):
    """
    根据文章的title、description、primaryKeyword映射到最合适的核心cluster
    """
    title = article.get("title", "").lower()
    description = article.get("description", "").lower()
    keyword = article.get("primaryKeyword", "").lower()
    old_cluster = article.get("topicCluster", "")

    # 合并所有文本用于分析
    text = f"{title} {description} {keyword}"

    # 映射规则：按优先级从高到低

    # 1. 特殊人群优先识别（老年人、护理人员等）
    if any(term in text for term in ["caregiver", "elderly", "senior", "aging parent", "adults 78", "adults 75", "over age 68", "age 55", "age 58"]):
        # 如果是护理人员相关的药物安全
        if any(term in text for term in ["administering", "medication", "nitroglycerin", "drug"]):
            return "medication-safety", "文章针对护理人员的药物管理安全"
        # 如果是老年人的特殊健康问题
        elif any(term in text for term in ["dementia", "cognitive impairment", "delirium"]):
            return "special-populations", "文章针对老年人的认知健康问题"
        # 冠状动脉钙化（针对特定年龄段）
        elif "coronary artery calcification" in text or "cac score" in text or "agatston" in text:
            return "cardiovascular-health", "冠状动脉钙化是心血管健康的重要指标"

    # 2. 疾病管理类（疾病优先原则）

    # 高血压管理
    if any(term in text for term in ["blood pressure", "hypertension", "hypotension", "bp medication"]):
        # 如果主要是饮食相关
        if any(term in title for term in ["diet", "food", "meal", "eating", "nutrition"]) and "manage" not in title:
            return "nutrition-diet-management", "主题是饮食营养对血压的影响"
        # 如果是药物相关
        elif any(term in text for term in ["medication", "drug", "pill"]):
            return "hypertension-management", "高血压药物治疗是高血压管理的一部分"
        # 其他血压相关
        else:
            return "hypertension-management", "文章主题是高血压管理"

    # 糖尿病管理
    if any(term in text for term in ["diabetes", "diabetic", "blood sugar", "glucose", "a1c", "insulin", "hypoglycemia", "hyperglycemia"]):
        # 如果主要是饮食相关
        if any(term in title for term in ["diet", "food", "meal", "eating", "nutrition"]) and "blood sugar" not in title:
            return "nutrition-diet-management", "主题是糖尿病饮食管理"
        # 如果主要是运动相关
        elif any(term in title for term in ["exercise", "activity", "fitness", "walking"]):
            return "lifestyle-interventions", "主题是运动对糖尿病的影响"
        # 其他糖尿病相关
        else:
            return "diabetes-management", "文章主题是糖尿病管理"

    # 心血管疾病
    if any(term in text for term in ["cardiac", "heart disease", "coronary", "cad", "heart attack", "myocardial", "angina", "cardiovascular"]):
        # 冠状动脉钙化
        if "calcification" in text or "cac" in text:
            return "cardiovascular-health", "冠状动脉钙化是心血管健康的重要方面"
        # 心率变异性
        elif "heart rate variability" in text or "hrv" in text:
            return "cardiovascular-health", "心率变异性是心血管健康的重要指标"
        # 特定心脏病
        elif any(term in text for term in ["heart failure", "cardiomyopathy", "arrhythmia", "atrial fibrillation"]):
            return "cardiac-disease-management", "文章讨论特定心脏疾病的管理"
        # 其他心血管相关
        else:
            return "cardiovascular-health", "文章主题是心血管健康"

    # 肾脏健康
    if any(term in text for term in ["kidney", "renal", "nephropathy", "ckd"]):
        return "renal-health", "文章主题是肾脏健康"

    # 代谢综合征
    if "metabolic syndrome" in text or ("metabolic" in text and "syndrome" in text):
        return "metabolic-syndrome-management", "文章主题是代谢综合征管理"

    # 消化系统
    if any(term in text for term in ["gastrointestinal", "digestive", "gut", "microbiome", "stomach", "intestinal", "dysphagia", "aspiration"]):
        return "gastrointestinal-health", "文章主题是消化系统健康"

    # 3. 干预措施类

    # 饮食营养
    if any(term in title for term in ["diet", "food", "meal", "eating", "nutrition", "dietary", "sodium", "salt", "nitrate"]):
        return "nutrition-diet-management", "文章主题是饮食营养管理"

    # 运动生活方式
    if any(term in title for term in ["exercise", "activity", "fitness", "walking", "lifestyle", "physical activity"]):
        return "lifestyle-interventions", "文章主题是运动和生活方式干预"

    # 药物安全
    if any(term in text for term in ["medication", "drug", "pill", "polypharmacy", "drug interaction", "administering"]):
        return "medication-safety", "文章主题是药物安全和管理"

    # 天然疗法
    if any(term in text for term in ["natural", "supplement", "nutraceutical", "herbal", "vitamin", "mineral"]):
        # 如果是维生素K2等针对钙化的
        if "calcification" in text:
            return "cardiovascular-health", "维生素K2用于心血管健康（钙化管理）"
        else:
            return "natural-remedies", "文章主题是天然疗法和补充剂"

    # 行为和心理健康
    if any(term in text for term in ["stress", "anxiety", "mental health", "depression", "psychological", "behavioral"]):
        return "mental-health-stress", "文章主题是心理健康和压力管理"

    # 4. 诊断监测类

    # 症状诊断
    if any(term in text for term in ["symptom", "warning sign", "diagnosis", "detection", "screening"]):
        return "symptoms-diagnosis", "文章主题是症状识别和诊断"

    # 监测技术
    if any(term in text for term in ["monitor", "device", "technology", "wearable", "tracking", "measurement"]):
        return "monitoring-technology", "文章主题是健康监测技术"

    # 5. 影响因素类

    # 睡眠和昼夜节律
    if any(term in text for term in ["sleep", "circadian", "rhythm", "insomnia", "sleep quality"]):
        return "circadian-sleep-health", "文章主题是睡眠和昼夜节律健康"

    # 环境因素
    if any(term in text for term in ["environment", "seasonal", "weather", "climate", "pollution", "social isolation"]):
        return "environmental-factors", "文章主题是环境因素对健康的影响"

    # 6. 特殊主题类

    # 并发症管理
    if any(term in text for term in ["complication", "comorbidity", "comorbid"]):
        return "complications-management", "文章主题是并发症和合并症管理"

    # 预防和风险评估
    if any(term in text for term in ["prevent", "prevention", "risk assessment", "risk factor", "reduce risk"]):
        # 如果是认知保护
        if "cognitive" in text or "dementia" in text or "delirium" in text:
            return "special-populations", "老年人的认知保护"
        # 如果是心血管预防
        elif any(term in text for term in ["cardiovascular", "heart", "coronary"]):
            return "cardiovascular-health", "心血管疾病预防"
        # 其他预防
        else:
            return "prevention-risk-assessment", "文章主题是疾病预防和风险评估"

    # 治疗干预
    if any(term in text for term in ["treatment", "therapy", "intervention", "management"]):
        return "treatment-interventions", "文章主题是治疗干预"

    # 7. 默认分类（当不确定时）
    return "comprehensive-health-topics", "综合健康主题（无法明确分类）"


def main():
    # 读取输入文件
    with open("/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/remap-batch-5.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    batch_id = data.get("batch_id", 5)
    articles = data.get("articles", [])

    print(f"开始处理Batch {batch_id}，共{len(articles)}篇文章...")

    # 映射结果
    mappings = []
    cluster_counter = Counter()

    for idx, article in enumerate(articles, 1):
        slug = article.get("slug", "")
        old_cluster = article.get("topicCluster", "")

        # 执行映射
        new_cluster, rationale = map_article_to_cluster(article)

        # 记录映射
        mappings.append({
            "slug": slug,
            "old_cluster": old_cluster,
            "new_cluster": new_cluster,
            "rationale": rationale
        })

        cluster_counter[new_cluster] += 1

        # 进度提示
        if idx % 50 == 0:
            print(f"已处理 {idx}/{len(articles)} 篇文章...")

    # 输出结果
    result = {
        "batch_id": batch_id,
        "total_articles": len(articles),
        "mappings": mappings
    }

    output_path = "/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/remap-result-5.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"\n✓ 完成！结果已保存到: {output_path}")
    print(f"\n映射统计：")
    print(f"- 总文章数: {len(articles)}")
    print(f"- 使用的核心clusters数: {len(cluster_counter)}")
    print(f"\n最常见的3个新cluster：")
    for cluster, count in cluster_counter.most_common(3):
        print(f"  {cluster}: {count}篇")

    # 验证所有new_cluster都在核心列表中
    invalid_clusters = [m["new_cluster"] for m in mappings if m["new_cluster"] not in CORE_CLUSTERS]
    if invalid_clusters:
        print(f"\n⚠ 警告：发现{len(invalid_clusters)}个不在核心列表中的cluster")
    else:
        print(f"\n✓ 验证通过：所有映射的cluster都在32个核心列表中")


if __name__ == "__main__":
    main()
