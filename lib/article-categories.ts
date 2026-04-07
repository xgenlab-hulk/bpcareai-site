/**
 * Category mapping: user-friendly category names → topicCluster values
 */

export interface CategoryDef {
  label: string;
  slug: string;
  clusters: string[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    label: 'Blood Pressure',
    slug: 'blood-pressure',
    clusters: ['hypertension-management'],
  },
  {
    label: 'Diabetes',
    slug: 'diabetes',
    clusters: ['diabetes-management', 'glucose-diabetes-management'],
  },
  {
    label: 'Heart Health',
    slug: 'heart-health',
    clusters: [
      'cardiovascular-health',
      'cardiac-disease-management',
      'autonomic-nervous-regulation',
    ],
  },
  {
    label: 'Nutrition & Diet',
    slug: 'nutrition-diet',
    clusters: ['nutrition-diet-management', 'gastrointestinal-health'],
  },
  {
    label: 'Exercise & Lifestyle',
    slug: 'exercise-lifestyle',
    clusters: [
      'lifestyle-interventions',
      'circadian-sleep-health',
      'mental-health-stress',
      'environmental-factors',
    ],
  },
  {
    label: 'Medication Safety',
    slug: 'medication-safety',
    clusters: ['medication-safety', 'treatment-interventions'],
  },
  {
    label: 'Kidney & Organs',
    slug: 'kidney-organs',
    clusters: ['renal-health', 'special-populations'],
  },
  {
    label: 'Symptoms & Prevention',
    slug: 'symptoms-prevention',
    clusters: [
      'symptoms-diagnosis',
      'prevention-risk-assessment',
      'monitoring-technology',
      'natural-remedies',
      'comprehensive-health-topics',
      'behavioral-mental-health',
      'metabolic-syndrome-management',
      'complications-management',
      'metabolic-health',
    ],
  },
];

/**
 * Build a reverse lookup: topicCluster → CategoryDef
 */
const clusterToCategoryMap = new Map<string, CategoryDef>();
CATEGORIES.forEach((cat) => {
  cat.clusters.forEach((cluster) => {
    clusterToCategoryMap.set(cluster, cat);
  });
});

/**
 * Get the user-friendly category for a given topicCluster value.
 * Returns undefined if no mapping exists.
 */
export function getCategoryForCluster(
  topicCluster: string | undefined
): CategoryDef | undefined {
  if (!topicCluster) return undefined;
  return clusterToCategoryMap.get(topicCluster);
}

/**
 * Get a category by its slug (used in URL params).
 */
export function getCategoryBySlug(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((cat) => cat.slug === slug);
}
