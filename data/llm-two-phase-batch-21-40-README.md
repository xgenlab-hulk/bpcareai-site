# Two-Phase Batch Processing (Articles 21-40) - Setup Guide

## Overview

This document explains how to process articles 21-40 through the two-phase audit and optimization workflow.

## What the Process Does

### Phase 1: Metadata Audit & Optimization
1. **Audit metadata** using LLM-driven comprehensive review
2. **Optimize metadata** if score < 85
3. **Ensure** all optimized metadata scores ≥ 85

### Phase 2: Content Audit (No Optimization)
1. **Audit content quality** of article body
2. **Flag articles** with content score < 85 for future optimization
3. **Do NOT optimize** content in this phase

## Running the Process

### Option 1: Using the Python Script (Recommended)

#### Prerequisites
```bash
# Ensure you have the anthropic package
pip install anthropic

# Set your API key
export ANTHROPIC_API_KEY="your-api-key-here"
```

#### Run the script
```bash
cd /Users/hulksi/Desktop/IOS_APPS/bpcareai-site

# Process articles 21-40
python3 scripts/process-two-phase-batch.py --start 21 --end 40

# Output will be saved to:
# data/llm-two-phase-batch-21-40.json
```

#### Estimated Time
- **20 articles** × **3-5 API calls each** = **60-100 total calls**
- **Processing time**: 30-60 minutes (depending on API speed)
- **Cost**: ~$10-15 in API usage (using Claude Sonnet 4)

### Option 2: Process in Smaller Batches

If you want to process incrementally:

```bash
# Articles 21-25 (5 articles)
python3 scripts/process-two-phase-batch.py --start 21 --end 25 --output data/batch-21-25.json

# Articles 26-30 (5 articles)
python3 scripts/process-two-phase-batch.py --start 26 --end 30 --output data/batch-26-30.json

# Articles 31-35 (5 articles)
python3 scripts/process-two-phase-batch.py --start 31 --end 35 --output data/batch-31-35.json

# Articles 36-40 (5 articles)
python3 scripts/process-two-phase-batch.py --start 36 --end 40 --output data/batch-36-40.json
```

Then merge the results manually.

## Output Format

The script generates a JSON file with:

```json
{
  "batch_info": {
    "range": "21-40",
    "total_articles": 20,
    "processing_date": "2026-03-16T..."
  },
  "detailed_results": [
    {
      "article_number": 21,
      "slug": "article-slug",
      "metadata_audit": { ... },
      "metadata_optimization": { ... },
      "metadata_final_score": 88,
      "content_audit": { ... },
      "needs_phase2": true
    }
  ],
  "summary": {
    "total_articles": 20,
    "successfully_processed": 20,
    "metadata_stats": {
      "original_avg_score": 62.5,
      "final_avg_score": 89.2,
      "articles_optimized": 18,
      "all_above_85": true
    },
    "content_stats": {
      "avg_score": 78.3,
      "articles_needing_phase2": 12,
      "articles_above_85": 8
    }
  }
}
```

## Articles in Batch 21-40

1. Article 21: `warning-signs-your-normal-blood-pressure-reading-is-actually-masked-hypertension...`
2. Article 22: `warning-signs-your-holiday-weight-gain-is-accelerating-diabetic-kidney...`
3. Article 23: `type-1-diabetes-holiday-potluck-guide`
4. Article 24: `taurine-vitamin-b6-atrial-calcium-handling`
5. Article 25: `stabilize-morning-glucose-without-insulin`
6. Article 26: `quick-fix-for-postprandial-hypotension-seniors`
7. Article 27: `quercetin-and-hypertensive-retinopathy-microvascular`
8. Article 28: `post-dinner-brain-fog-diabetes-65`
9. Article 29: `natural-cardiac-fibroblast-stabilization-post-mi`
10. Article 30: `nasal-decongestants-and-pulse-pressure-in-asthma`
11. Article 31: `how-late-night-holiday-movie-marathons-elevate-sympathetic-tone...`
12. Article 32: `how-holiday-stress-hormones-disrupt-overnight-glucose-recovery...`
13. Article 33: `how-alcohol-metabolism-changes-after-age-55...`
14. Article 34: `healthy-holiday-buffet-glycemic-traps`
15. Article 35: `gut-kidney-axis-modulation-for-bp-control`
16. Article 36: `gratitude-walks-post-holiday-dinner`
17. Article 37: `fruitcake-vs-almond-flour-loaf-diabetes`
18. Article 38: `does-intermittent-fasting-during-holidays-actually-lower-hba1c...`
19. Article 39: `coq10-and-ejection-fraction-ischemic-cardiomyopathy`
20. Article 40: `blood-pressure-underestimation-in-advanced-ckid`

## Troubleshooting

### API Key Issues
```bash
# Check if API key is set
echo $ANTHROPIC_API_KEY

# Set it if missing
export ANTHROPIC_API_KEY="your-key"
```

### Module Not Found
```bash
# Install anthropic package
pip3 install --user anthropic
```

### Script Fails Midway
The script saves results as it goes. If it fails, check the partial output file and resume from the last successful article.

## Next Steps After Processing

1. **Review the summary** in the output JSON
2. **Identify articles needing Phase 2** (content optimization)
3. **Prioritize** content optimization based on scores
4. **Update metadata** in the articles based on optimization results

## Support

If you encounter issues, check:
- Python version (requires 3.9+)
- API key validity
- Network connection
- Disk space for output files
