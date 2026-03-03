#!/usr/bin/env python3
"""
Topic Cluster Remapping Script for Batch 2
Maps 250 articles from old clusters to 32 core topic clusters
"""

import json
import re
from typing import Dict, List

# Define 32 core topic clusters with keywords for matching
CORE_CLUSTERS = {
    # Disease Management (7)
    'cardiovascular-health': [
        'heart', 'cardiac', 'cardiovascular', 'coronary', 'vascular', 'arterial',
        'heart rate', 'heart health', 'myocardial', 'aortic', 'carotid'
    ],
    'hypertension-management': [
        'blood pressure', 'hypertension', 'bp', 'systolic', 'diastolic',
        'prehypertension', 'elevated blood pressure'
    ],
    'diabetes-management': [
        'diabetes', 'diabetic', 'type 2 diabetes', 't2d', 'prediabetes',
        'insulin resistance', 'a1c', 'hemoglobin a1c'
    ],
    'cardiac-disease-management': [
        'heart failure', 'atrial fibrillation', 'arrhythmia', 'cardiomyopathy',
        'heart disease', 'coronary artery disease', 'cad', 'angina', 'stenosis'
    ],
    'glucose-diabetes-management': [
        'blood sugar', 'glucose', 'glycemic', 'hyperglycemia', 'hypoglycemia',
        'glucose control', 'blood glucose'
    ],
    'diabetes-glucose-management': [
        'diabetes glucose', 'diabetic glucose', 'glucose management'
    ],
    'metabolic-syndrome-management': [
        'metabolic syndrome', 'insulin resistance syndrome', 'syndrome x'
    ],

    # Interventions (6)
    'nutrition-diet-management': [
        'diet', 'nutrition', 'food', 'meal', 'eating', 'nutrient', 'dietary',
        'mediterranean diet', 'dash diet', 'plant-based', 'recipe', 'sodium', 'salt'
    ],
    'lifestyle-interventions': [
        'exercise', 'physical activity', 'workout', 'walking', 'fitness',
        'activity', 'movement', 'aerobic', 'resistance training', 'yoga', 'tai chi'
    ],
    'medication-safety': [
        'medication', 'drug', 'pill', 'statin', 'beta blocker', 'ace inhibitor',
        'anticoagulant', 'warfarin', 'aspirin', 'polypharmacy', 'drug interaction'
    ],
    'treatment-interventions': [
        'treatment', 'therapy', 'intervention', 'clinical trial', 'protocol'
    ],
    'behavioral-mental-health': [
        'stress management', 'mental health', 'anxiety', 'depression',
        'cognitive', 'behavior', 'mindfulness', 'psychological'
    ],
    'natural-remedies': [
        'supplement', 'herbal', 'natural remedy', 'alternative medicine',
        'complementary therapy', 'vitamin', 'mineral'
    ],

    # Diagnosis & Monitoring (3)
    'symptoms-diagnosis': [
        'symptoms', 'warning signs', 'diagnosis', 'detection', 'screening',
        'early signs', 'recognize', 'identify'
    ],
    'monitoring-technology': [
        'monitor', 'device', 'tracker', 'wearable', 'app', 'digital health',
        'continuous monitoring', 'home monitoring', 'blood pressure monitor'
    ],
    'monitoring-diagnosis': [
        'monitoring', 'diagnostic', 'test', 'measurement', 'tracking'
    ],

    # Impact Factors (7)
    'circadian-sleep-health': [
        'sleep', 'circadian', 'rhythm', 'insomnia', 'sleep quality',
        'sleep apnea', 'sleep duration'
    ],
    'sleep-circadian-health': [
        'sleep circadian', 'circadian sleep', 'sleep rhythm'
    ],
    'circadian-sleep-metabolism': [
        'circadian metabolism', 'sleep metabolism', 'metabolic rhythm'
    ],
    'circadian-metabolic-health': [
        'circadian metabolic', 'metabolic circadian'
    ],
    'environmental-factors': [
        'environment', 'seasonal', 'weather', 'temperature', 'air pollution',
        'climate', 'outdoor', 'indoor'
    ],
    'environmental-health-factors': [
        'environmental health', 'environmental impact', 'environmental exposure'
    ],
    'mental-health-stress': [
        'stress', 'anxiety', 'mental', 'emotional', 'psychological stress',
        'chronic stress', 'cortisol'
    ],

    # Special Topics (9)
    'special-populations': [
        'elderly', 'seniors', 'older adults', 'women', 'men', 'gender',
        'age', 'aging', 'postmenopausal', 'geriatric'
    ],
    'gastrointestinal-health': [
        'gut', 'digestive', 'gastrointestinal', 'microbiome', 'intestinal',
        'stomach', 'bowel', 'gi health'
    ],
    'complications-management': [
        'complications', 'comorbidity', 'comorbidities', 'co-occurring',
        'multimorbidity'
    ],
    'cardiovascular-physiology': [
        'physiology', 'mechanism', 'pathophysiology', 'vascular function',
        'endothelial', 'hemodynamic'
    ],
    'metabolic-health': [
        'metabolic', 'metabolism', 'metabolic health', 'metabolic rate'
    ],
    'renal-health': [
        'kidney', 'renal', 'chronic kidney disease', 'ckd', 'nephropathy',
        'kidney function', 'creatinine', 'egfr'
    ],
    'autonomic-nervous-regulation': [
        'autonomic', 'nervous system', 'sympathetic', 'parasympathetic',
        'vagal', 'heart rate variability', 'hrv'
    ],
    'comprehensive-health-topics': [
        'health', 'wellness', 'general health', 'overall health'
    ],
    'prevention-risk-assessment': [
        'prevention', 'risk', 'risk assessment', 'risk factors', 'preventive',
        'reduce risk', 'lower risk', 'framingham'
    ]
}


def analyze_article(article: Dict) -> str:
    """
    Analyze article and determine best core cluster
    Priority: title > description > primaryKeyword
    """
    title = article.get('title', '').lower()
    description = article.get('description', '').lower()
    keyword = article.get('primaryKeyword', '').lower()

    # Combine for analysis, with title weighted most
    text = f"{title} {title} {description} {keyword}"

    # Score each cluster
    scores = {}
    for cluster, keywords in CORE_CLUSTERS.items():
        score = 0
        for kw in keywords:
            if kw.lower() in text:
                # Higher weight for title matches
                if kw.lower() in title:
                    score += 3
                elif kw.lower() in description:
                    score += 2
                else:
                    score += 1
        scores[cluster] = score

    # Apply semantic rules

    # Rule 1: Kidney/Renal is highly specific
    if any(kw in text for kw in ['kidney', 'renal', 'ckd', 'chronic kidney disease', 'nephropathy']):
        scores['renal-health'] = scores.get('renal-health', 0) + 10

    # Rule 2: Warfarin/anticoagulant -> medication-safety
    if any(kw in text for kw in ['warfarin', 'anticoagulant', 'inr', 'blood thinner']):
        scores['medication-safety'] = scores.get('medication-safety', 0) + 5

    # Rule 3: Exercise/workout/walking -> lifestyle-interventions
    if any(kw in text for kw in ['exercise', 'workout', 'walking', 'resistance band', 'tai chi', 'yoga', 'physical activity']):
        scores['lifestyle-interventions'] = scores.get('lifestyle-interventions', 0) + 5

    # Rule 4: Blood pressure in title -> hypertension-management
    if 'blood pressure' in title or 'hypertension' in title or ' bp ' in title:
        scores['hypertension-management'] = scores.get('hypertension-management', 0) + 8

    # Rule 5: Diabetes/glucose in title -> diabetes-management
    if any(kw in title for kw in ['diabetes', 'diabetic', 'blood sugar', 'glucose', 'a1c']):
        scores['diabetes-management'] = scores.get('diabetes-management', 0) + 8

    # Rule 6: Heart/cardiac/coronary -> cardiovascular
    if any(kw in title for kw in ['heart', 'cardiac', 'coronary', 'myocardial', 'cardiovascular']):
        # But check if it's specific disease
        if any(kw in text for kw in ['heart failure', 'atrial fibrillation', 'arrhythmia', 'stenosis', 'angina']):
            scores['cardiac-disease-management'] = scores.get('cardiac-disease-management', 0) + 8
        else:
            scores['cardiovascular-health'] = scores.get('cardiovascular-health', 0) + 8

    # Rule 7: Diet/food/meal/nutrition -> nutrition-diet-management
    if any(kw in title for kw in ['diet', 'food', 'meal', 'nutrition', 'eating', 'recipe', 'protein', 'sodium', 'salt']):
        scores['nutrition-diet-management'] = scores.get('nutrition-diet-management', 0) + 5

    # Rule 8: Sleep/circadian
    if any(kw in text for kw in ['sleep', 'circadian', 'rhythm', 'insomnia']):
        scores['circadian-sleep-health'] = scores.get('circadian-sleep-health', 0) + 5

    # Rule 9: Stress/mental/anxiety
    if any(kw in text for kw in ['stress', 'anxiety', 'mental health', 'depression', 'psychological']):
        scores['mental-health-stress'] = scores.get('mental-health-stress', 0) + 5

    # Rule 10: Gut/microbiome
    if any(kw in text for kw in ['gut', 'microbiome', 'digestive', 'gastrointestinal', 'intestinal']):
        scores['gastrointestinal-health'] = scores.get('gastrointestinal-health', 0) + 8

    # Get best match
    if not scores or max(scores.values()) == 0:
        return 'comprehensive-health-topics'

    best_cluster = max(scores.items(), key=lambda x: x[1])[0]
    return best_cluster


def generate_rationale(article: Dict, new_cluster: str, old_cluster: str) -> str:
    """Generate brief rationale for the mapping"""
    title = article.get('title', '')

    # Extract key topic from title
    title_lower = title.lower()

    rationales = {
        'renal-health': '文章涉及肾脏健康或慢性肾病管理',
        'medication-safety': '文章主题是药物安全或抗凝治疗',
        'lifestyle-interventions': '文章核心是运动或体力活动干预',
        'hypertension-management': '文章主题是血压管理或高血压',
        'diabetes-management': '文章主题是糖尿病综合管理',
        'cardiovascular-health': '文章涉及心血管整体健康',
        'cardiac-disease-management': '文章涉及特定心脏疾病管理',
        'nutrition-diet-management': '文章主题是饮食营养管理',
        'circadian-sleep-health': '文章涉及睡眠或昼夜节律',
        'mental-health-stress': '文章涉及心理健康或压力管理',
        'gastrointestinal-health': '文章涉及消化系统或肠道健康',
        'symptoms-diagnosis': '文章涉及症状识别或疾病诊断',
        'monitoring-technology': '文章涉及健康监测设备或技术',
        'special-populations': '文章针对特殊人群',
        'prevention-risk-assessment': '文章涉及疾病预防或风险评估',
        'complications-management': '文章涉及并发症管理',
        'comprehensive-health-topics': '文章涵盖综合健康主题'
    }

    base_rationale = rationales.get(new_cluster, f'文章最符合{new_cluster}主题')

    # Add specifics from title
    if 'warfarin' in title_lower and 'ckd' in title_lower:
        return '文章同时涉及抗凝和肾病,优先归入肾脏健康管理'
    if 'exercise' in title_lower or 'walking' in title_lower or 'resistance' in title_lower:
        return '文章核心是运动干预,属于生活方式干预'
    if 'protein' in title_lower or 'diet' in title_lower or 'meal' in title_lower:
        if 'ckd' in title_lower or 'kidney' in title_lower:
            return '文章虽涉及饮食但核心是肾病管理'
        return '文章核心是饮食营养管理'

    return base_rationale


def main():
    # Read input file
    input_file = '/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/remap-batch-2.json'
    output_file = '/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/remap-result-2.json'

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    batch_id = data['batch_id']
    articles = data['articles']

    print(f"Processing Batch {batch_id}: {len(articles)} articles")

    # Process each article
    mappings = []
    cluster_counts = {}

    for i, article in enumerate(articles, 1):
        slug = article['slug']
        old_cluster = article.get('topicCluster', '')

        # Determine new cluster
        new_cluster = analyze_article(article)

        # Generate rationale
        rationale = generate_rationale(article, new_cluster, old_cluster)

        # Add to mappings
        mappings.append({
            'slug': slug,
            'old_cluster': old_cluster,
            'new_cluster': new_cluster,
            'rationale': rationale
        })

        # Count clusters
        cluster_counts[new_cluster] = cluster_counts.get(new_cluster, 0) + 1

        if i % 50 == 0:
            print(f"Processed {i}/{len(articles)} articles...")

    # Create output
    result = {
        'batch_id': batch_id,
        'total_articles': len(articles),
        'mappings': mappings
    }

    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Completed mapping {len(articles)} articles")
    print(f"✓ Output saved to: {output_file}")

    # Print top 3 clusters
    print("\nTop 3 most common new clusters:")
    sorted_clusters = sorted(cluster_counts.items(), key=lambda x: x[1], reverse=True)
    for i, (cluster, count) in enumerate(sorted_clusters[:3], 1):
        print(f"{i}. {cluster}: {count} articles")

    # Print all cluster distribution
    print("\nFull cluster distribution:")
    for cluster, count in sorted(sorted_clusters, key=lambda x: x[1], reverse=True):
        print(f"  {cluster}: {count}")


if __name__ == '__main__':
    main()
