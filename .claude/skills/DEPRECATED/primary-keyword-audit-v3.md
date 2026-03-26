# PrimaryKeyword Quality Audit Guide v3.0

## Your Task

You are auditing the quality of PrimaryKeywords for a batch of articles. For each article, you will:
1. **Read the primaryKeyword**
2. **Evaluate it** based on the criteria below
3. **Assign a score** (0-100)
4. **Determine if it needs optimization** (< 85 score)

**IMPORTANT**: You are only evaluating the keyword itself, NOT reading article content. This is a quick quality check.

---

## Evaluation Criteria (Total: 100 points)

### 1. Specific Medical Topic (40 points)

**Question**: Does the keyword contain a specific medical condition/topic users would search for?

**Scoring**:
- ✅ **40 points**: Contains specific medical terms users search for
  - Examples: "blood pressure", "diabetes", "heart health", "cholesterol", "stroke", "glucose", "kidney health"

- ⚠️ **20 points**: Contains somewhat medical but generic terms
  - Examples: "heart" (alone), "health monitoring", "diet management"

- ❌ **0 points**: Only generic/vague terms as main topic
  - Examples: "health management", "wellness tips", "lifestyle changes"

**Examples**:
```
✅ 40pts: "blood pressure monitoring seniors" - specific medical topic
✅ 40pts: "diabetes diet tips adults 65+" - specific condition
⚠️ 20pts: "heart monitoring elderly" - medical but could be more specific
❌ 0pts: "health management seniors" - too generic
```

---

### 2. Target Audience Identifier (20 points)

**Question**: Does the keyword specify who it's for?

**Scoring**:
- ✅ **20 points**: Clear audience identifier
  - Age: "seniors", "adults 60+", "elderly", "over 70", "65+"
  - Demographic: "women over 65", "men 70+", "adults 55-65"

- ⚠️ **10 points**: Vague audience
  - "adults", "people", "patients" (too broad)

- ❌ **0 points**: No audience identifier

**Examples**:
```
✅ 20pts: "blood pressure seniors over 70"
✅ 20pts: "diabetes management adults 65+"
⚠️ 10pts: "heart health adults" (which adults?)
❌ 0pts: "blood pressure monitoring" (for who?)
```

---

### 3. Optimal Length (15 points)

**Scoring**:
- ✅ **15 points**: 30-50 characters (ideal for SEO/GEO)
- ⚠️ **10 points**: 25-29 or 51-60 characters (acceptable)
- ❌ **5 points**: <25 or >60 characters (too short/long)

---

### 4. Natural Phrasing (10 points)

**Question**: Does it read like something a real person would search for?

**Scoring**:
- ✅ **10 points**: Natural, readable phrase
  - "blood pressure monitoring seniors over 70"
  - "diabetes diet tips holiday meals"

- ⚠️ **5 points**: Somewhat readable but awkward
  - "blood pressure management elderly adults"

- ❌ **0 points**: Keyword stuffing or unnatural
  - "blood pressure hypertension bp monitoring control seniors"

---

### 5. Clear Search Intent (10 points)

**Question**: Is it clear what the user is looking for?

**Scoring**:
- ✅ **10 points**: Very clear intent
- ⚠️ **5 points**: Somewhat clear
- ❌ **0 points**: Unclear or confusing

---

### 6. Avoids Technical Jargon (5 points)

**Question**: Does it avoid medical terms users won't search for?

**Red Flag Terms** (common technical jargon):
- "tmao", "endothelial", "baroreceptor", "microvascular"
- "connexin", "pheochromocytoma", "nephropathy", "neuropathy"
- "postprandial", "glycemic excursion"

**Scoring**:
- ✅ **5 points**: No technical jargon, user-friendly
- ⚠️ **3 points**: One technical term but mostly readable
- ❌ **0 points**: Multiple technical terms

---

## Scoring Guide

| Score Range | Grade | Action |
|-------------|-------|--------|
| 85-100 | Excellent | ✅ No optimization needed |
| 70-84 | Good | ⚠️ Optional optimization |
| 50-69 | Fair | 🔶 Should optimize |
| 0-49 | Poor | ❌ Must optimize |

**Threshold**: Score < 85 = needs optimization

---

## Common Scenarios

### Scenario 1: Generic Main Topic
```
Keyword: "health management seniors"
Score: 20 + 20 + 10 + 10 + 5 + 5 = 70
Issues: No specific medical topic (only got 20/40 for generic "health")
Needs Optimization: No (70 >= 70, but borderline)
```

### Scenario 2: Technical Jargon
```
Keyword: "tmao vascular phenotype aging"
Score: 0 + 0 + 10 + 0 + 5 + 0 = 15
Issues: No searchable medical topic, no audience, technical terms
Needs Optimization: Yes
```

### Scenario 3: Good Keyword
```
Keyword: "blood pressure monitoring seniors over 70"
Score: 40 + 20 + 15 + 10 + 10 + 5 = 100
Issues: None
Needs Optimization: No
```

---

## Output Format

For each batch, provide:

```json
{
  "batch_id": 1,
  "total_checked": 100,
  "articles": [
    {
      "slug": "article-slug-here",
      "primaryKeyword": "current keyword",
      "score": 85,
      "breakdown": {
        "medical_topic": 40,
        "audience": 20,
        "length": 15,
        "natural": 10,
        "intent": 10,
        "no_jargon": 5
      },
      "needs_optimization": false,
      "issues": []
    },
    {
      "slug": "another-article",
      "primaryKeyword": "health management seniors",
      "score": 70,
      "breakdown": {
        "medical_topic": 20,
        "audience": 20,
        "length": 10,
        "natural": 10,
        "intent": 5,
        "no_jargon": 5
      },
      "needs_optimization": true,
      "issues": ["generic_medical_topic", "borderline_length"]
    }
  ],
  "summary": {
    "total": 100,
    "excellent_85plus": 65,
    "good_70to84": 20,
    "fair_50to69": 10,
    "poor_below50": 5,
    "needs_optimization": 35
  }
}
```

---

## Important Notes

1. **Be consistent** in scoring across all articles in your batch
2. **Be objective** - don't be too lenient or too harsh
3. **Focus on user perspective** - would a real person search for this?
4. **Consider SEO/GEO** - does this help articles get discovered?
5. **When in doubt** about medical topics:
   - "heart", "blood pressure", "diabetes", "cholesterol" = specific enough ✅
   - "health", "wellness", "lifestyle" = too generic ❌

---

## Your Task Summary

You will receive a batch JSON with 100 articles. For each:
1. Read the primaryKeyword
2. Score it using the 6 criteria above
3. Determine if needs_optimization (score < 85)
4. List specific issues if any
5. Output in the JSON format specified

Work through the batch systematically and provide accurate scoring.
