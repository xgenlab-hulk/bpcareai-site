# PrimaryKeyword Optimization Standards v2.0

## Core Objective
Generate high-quality PrimaryKeywords that score 85+ out of 100 for SEO/GEO optimization.

## Critical Requirements

### ✅ MUST Include (Non-negotiable)

1. **Real Medical Topic** (40 points)
   - Use specific medical terms users actually search for
   - Examples: "blood pressure", "diabetes", "heart", "cholesterol", "stroke"
   - ❌ DO NOT use generic terms as the main topic: "health", "wellness"

2. **Target Audience** (20 points)
   - Specific age group or demographic
   - Examples: "seniors", "adults 60+", "women over 65", "men 70+"

3. **Natural Phrasing** (15 points)
   - Reads like a real search query
   - Use connecting words: "for", "in", "with", "management"
   - ❌ Avoid keyword stuffing: "health diet exercise seniors"

### ❌ MUST Avoid

1. **Generic Terms as Primary Topic**
   - ❌ "health management seniors" → ✅ "blood pressure management seniors"
   - ❌ "wellness tips adults" → ✅ "heart health tips adults 65+"

2. **Overly Technical Terms**
   - ❌ "tmao vascular phenotype" → ✅ "cholesterol diet seniors"
   - ❌ "endothelial dysfunction" → ✅ "heart health blood vessels"
   - ❌ "pheochromocytoma" → ✅ "blood pressure warning signs"

3. **Keyword Stuffing**
   - ❌ "blood pressure hypertension bp monitoring"
   - ✅ "blood pressure monitoring seniors"

## Scoring System (Total: 100 points, Pass: 85+)

| Criterion | Points | Description |
|-----------|--------|-------------|
| Real Medical Topic | 40 | Contains blood pressure, diabetes, heart, cholesterol, etc. |
| Target Audience | 20 | Contains seniors, adults 60+, women 65+, etc. |
| Optimal Length (30-50 chars) | 15 | Not too short (<25) or too long (>60) |
| Natural Phrasing | 10 | Has connecting words, reads naturally |
| Avoids Technical Terms | 10 | User-searchable, not medical jargon |
| Avoids Generic Main Topic | 5 | Not "health" or "wellness" as primary |

## Optimization Workflow

### Step 1: Extract Real Medical Topic from Title

**Pattern Matching Rules:**

```
If title contains → Use in keyword
─────────────────────────────────────────
"blood pressure" OR "BP" OR "hypertension" → "blood pressure" OR "hypertension"
"diabetes" OR "glucose" OR "blood sugar" → "diabetes" OR "glucose"
"heart" OR "cardiac" OR "cardiovascular" → "heart" OR "cardiac"
"AFib" OR "atrial fibrillation" → "heart rhythm" OR "atrial"
"cholesterol" OR "LDL" OR "HDL" → "cholesterol"
"stroke" OR "TIA" → "stroke"
"kidney" OR "renal" → "kidney health"
"sleep apnea" → "sleep apnea"
```

### Step 2: Extract Target Audience from Title

**Look for:**
- Age patterns: "60+", "over 70", "adults 55-65"
- Demographics: "seniors", "women", "men", "elderly"
- Use the EXACT audience from title if present

### Step 3: Construct Optimized Keyword

**Template:** `[Medical Topic] + [Action/Context] + [Audience]`

**Examples:**

| Current (Poor) | Title Extract | Optimized (85+) |
|----------------|---------------|-----------------|
| "health management seniors" | "Blood Pressure Management for Seniors Over 70" | "blood pressure management seniors over 70" |
| "tmao vascular phenotype" | "How TMAO Affects Heart Health in Adults 65+" | "heart health diet adults 65+" |
| "endothelial dysfunction aging" | "Foods That Support Blood Vessel Health" | "blood vessel health foods seniors" |
| "wellness tips adults" | "Diabetes Prevention Strategies for Adults 60+" | "diabetes prevention adults 60+" |

### Step 4: Validate Quality

**Pre-flight Checklist:**
- [ ] Contains a real medical topic (not "health" or "wellness")
- [ ] Contains target audience identifier
- [ ] Length: 30-50 characters
- [ ] Reads naturally (has connecting words OR action verbs)
- [ ] No technical jargon users won't search
- [ ] No repeated words

**Expected Score:** 85-100 points

## Common Mistakes to Avoid

### ❌ Mistake 1: Using "health" or "management" as the main topic
```
Current: "health management holiday seniors"
Problem: Too generic, high SEO competition
Fix: "blood pressure holiday meals seniors"
```

### ❌ Mistake 2: Keeping technical terms
```
Current: "connexin-43 phosphorylation natural"
Problem: Users don't search for "connexin-43"
Fix: "heart health natural methods seniors"
```

### ❌ Mistake 3: Missing audience
```
Current: "blood pressure monitoring tips"
Problem: No target demographic
Fix: "blood pressure monitoring seniors over 70"
```

### ❌ Mistake 4: Keyword stuffing
```
Current: "blood pressure hypertension bp control monitoring"
Problem: Unnatural, stuffed with synonyms
Fix: "blood pressure control seniors"
```

## Output Format for Optimization

For each article, provide:

```json
{
  "slug": "article-slug-here",
  "current_keyword": "current primaryKeyword value",
  "optimized_keyword": "your optimized version",
  "score_before": 45,
  "score_after": 90,
  "medical_topic_extracted": "blood pressure",
  "audience_extracted": "seniors over 70",
  "rationale": "Replaced generic 'health management' with specific 'blood pressure' extracted from title. Added audience 'seniors over 70' from title.",
  "validation": {
    "has_real_medical_topic": true,
    "has_audience": true,
    "length_ok": true,
    "natural_phrasing": true,
    "avoids_technical": true,
    "avoids_generic": true
  }
}
```

## Quality Assurance

All optimized keywords MUST:
1. Score 85+ points using the scoring system above
2. Be validated against the pre-flight checklist
3. Include clear rationale explaining the optimization

**If uncertain about a medical topic:** Default to extracting from topicCluster:
- `blood-pressure-monitoring` → "blood pressure monitoring"
- `diabetes-management` → "diabetes management"
- `heart-health` → "heart health"
- `cholesterol-lipids` → "cholesterol management"
