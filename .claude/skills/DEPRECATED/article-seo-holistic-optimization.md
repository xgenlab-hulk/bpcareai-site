# Article SEO/GEO Holistic Optimization Guide

## Mission

Optimize all SEO/GEO elements of an article in a SINGLE PASS for maximum efficiency and consistency.

You will read an article and output optimized versions of:
- Slug
- Title
- Description
- PrimaryKeyword
- Content optimization suggestions

**Key Principle**: All elements must be consistent and aligned around the same core search intent.

---

## Step 1: Analyze the Article

### Read and Understand
1. **Read the full article content** (at least first 500-1000 words)
2. **Identify core medical topic**: What specific health condition/topic is this about?
   - NOT generic terms like "health" or "wellness"
   - Specific conditions: diabetes, blood pressure, heart disease, etc.
3. **Identify target audience**: Who is this for?
   - Age groups: seniors, adults 60+, elderly, over 70
   - Specific demographics if relevant
4. **Understand user search intent**: What would someone search to find this?
   - Think like a user, not a medical professional
   - Use user-friendly terminology

### Extract Key Information
- Main topic (user-friendly version)
- Audience (if specific)
- Key benefits/value proposition
- Unique angle (if any)

---

## Step 2: Optimize Each Element

### 1. Slug Optimization

**Goal**: Short, clean URL that contains key search terms

**Criteria**:
- ✅ 3-6 words maximum
- ✅ Contains core medical topic
- ✅ Lowercase with hyphens
- ✅ No stop words if possible (the, and, for, with)
- ❌ Avoid technical jargon
- ❌ No dates, version numbers

**Format**: `{medical-topic}-{context}-{audience}`

**Examples**:
```
✅ "blood-pressure-monitoring-seniors"
✅ "diabetes-diet-tips-over-60"
✅ "heart-health-holiday-meals"

❌ "natural-ways-to-support-pancreatic-beta-cell-resilience-without-stimulating-insulin" (too long)
❌ "health-tips-seniors" (too generic)
```

---

### 2. Title Optimization

**Goal**: Compelling, clear title that ranks well and gets clicks

**Criteria**:
- ✅ 50-60 characters (optimal for search results)
- ✅ Includes PrimaryKeyword core concept
- ✅ Clear benefit or value
- ✅ Audience identifier (if relevant)
- ✅ Specific and actionable
- ❌ Avoid clickbait
- ❌ Avoid excessive technical jargon

**Formulas that work**:
- `{Number} {Topic} for {Audience}`
- `{Topic}: {Benefit} for {Audience}`
- `How to {Action} {Topic} ({Audience})`
- `{Topic} {Benefit}: {Specific Context}`

**Examples**:
```
✅ "7 Blood Pressure Tips for Seniors Over 70"
✅ "Diabetes Diet: Holiday Meal Planning for Seniors"
✅ "Beta Cell Health: Natural Pancreas Protection (Prediabetes)"

❌ "Natural Ways to Support Pancreatic Beta-Cell Resilience Without Stimulating Insulin Secretion Using Sulforaphane Timing Plus Low-Dose Lithium in Adults 56–64 With Early Beta-Cell Decline" (way too long, too technical)
```

---

### 3. Description Optimization

**Goal**: Compelling 150-160 character summary for search snippets

**Criteria**:
- ✅ 150-160 characters (optimal for search results)
- ✅ Includes PrimaryKeyword naturally
- ✅ Clear value proposition
- ✅ Action-oriented or benefit-focused
- ✅ Complete sentence(s)

**Formula**: `{What it covers} + {Key benefit} + {For whom}`

**Examples**:
```
✅ "Science-backed blood pressure monitoring strategies for seniors over 70. Includes home device tips, timing, and when to call your doctor." (155 chars)

✅ "Diabetes-friendly holiday meal ideas for seniors. Easy recipes that balance blood sugar while enjoying traditional foods with family." (158 chars)

❌ "Focuses on cytoprotective, not secretagogue, approaches — Nrf2 activation, autophagy enhancement..." (too technical, unclear value)
```

---

### 4. PrimaryKeyword Optimization

**Goal**: Natural search phrase users actually type

**Criteria** (from v4 flexible standard):
- ✅ 30-50 characters ideal
- ✅ Specific medical topic (not "health" or "wellness")
- ✅ Natural phrasing (how users search)
- ✅ Includes audience IF it adds value
- ✅ User-friendly terminology
- ❌ No technical jargon
- ❌ No keyword stuffing

**Formula**: `{medical topic} {context/action} {audience (optional)}`

**Examples**:
```
✅ "blood pressure monitoring seniors over 70"
✅ "diabetes holiday meal planning"
✅ "beta cell health diabetes prevention seniors"

❌ "health management seniors" (too generic)
❌ "pancreatic beta-cell resilience sulforaphane" (technical jargon)
```

---

### 5. Content Optimization Suggestions

**Quick Checks**:
1. **H1 Tag**: Does it include the PrimaryKeyword or core concept?
2. **Keyword Density**: Does PrimaryKeyword appear 3-5 times naturally in content?
3. **Subheadings (H2/H3)**: Do they include related keywords?
4. **Images**: Suggest alt text that includes relevant keywords
5. **Internal Links**: Suggest 2-3 related articles to link to
6. **User Intent**: Does content actually answer the search query?

**Output**: List of 3-5 actionable suggestions

---

## Step 3: Consistency Check

**CRITICAL**: Ensure all elements align

### ✅ Consistency Checklist
- [ ] Title includes core concept from PrimaryKeyword
- [ ] Description includes PrimaryKeyword naturally
- [ ] Slug reflects the main topic
- [ ] All elements target the same audience (if audience-specific)
- [ ] All elements use similar terminology (not mixing jargon with plain language)
- [ ] User searching PrimaryKeyword would find Title/Description relevant

### Consistency Score
Rate 0-100 based on alignment:
- **90-100**: Perfect alignment
- **80-89**: Very good, minor inconsistencies
- **70-79**: Good but could be tighter
- **<70**: Needs work, elements feel disconnected

---

## Output Format

```json
{
  "slug": "article-slug",
  "analysis": {
    "coreTheme": "specific medical topic (user-friendly)",
    "targetAudience": "specific demographic or 'general'",
    "userSearchIntent": "what users are looking for",
    "currentIssues": [
      "issue 1",
      "issue 2"
    ]
  },
  "optimizations": {
    "slug": {
      "current": "current slug",
      "optimized": "new slug (or null if no change needed)",
      "needsChange": true/false,
      "reasoning": "why changed or why kept"
    },
    "title": {
      "current": "current title",
      "optimized": "new title (or null if no change needed)",
      "needsChange": true/false,
      "reasoning": "why changed or why kept",
      "characterCount": 55
    },
    "description": {
      "current": "current description",
      "optimized": "new description (or null if no change needed)",
      "needsChange": true/false,
      "reasoning": "why changed or why kept",
      "characterCount": 158
    },
    "primaryKeyword": {
      "current": "current keyword",
      "optimized": "new keyword (or null if no change needed)",
      "needsChange": true/false,
      "reasoning": "why changed or why kept"
    },
    "contentSuggestions": [
      "suggestion 1",
      "suggestion 2",
      "suggestion 3"
    ]
  },
  "consistencyCheck": {
    "titleIncludesKeywordConcept": true,
    "descriptionIncludesKeyword": true,
    "slugReflectsTopic": true,
    "allAlignedOnSearchIntent": true,
    "consistencyScore": 95,
    "notes": "All elements well-aligned around 'blood pressure monitoring for seniors'"
  },
  "priority": "high" | "medium" | "low"
}
```

---

## Priority Assessment

Assign priority based on how badly the article needs optimization:

### High Priority (Must Fix)
- Current PrimaryKeyword is generic ("health management")
- Title is overly technical or unclear
- Major inconsistencies between elements
- Slug is very long or confusing

### Medium Priority (Should Fix)
- PrimaryKeyword is okay but could be better
- Title is decent but not optimal
- Minor inconsistencies
- Some technical jargon present

### Low Priority (Optional)
- All elements are pretty good
- Minor tweaks would help but not critical
- Already scoring 80+ in quality

---

## Key Principles

1. **User-First**: Think like someone searching for health information, not a medical professional
2. **Consistency**: All elements must tell the same story
3. **Specificity**: Specific medical topics beat generic "health" terms
4. **Natural Language**: Use terms people actually search, not medical textbook language
5. **Efficiency**: Output ALL optimizations in one pass - don't require multiple rounds

---

## Common Pitfalls to Avoid

❌ **Optimizing elements independently**
- Don't create a great PrimaryKeyword that doesn't match the Title

❌ **Using different terminology across elements**
- If you use "blood pressure" in keyword, don't use "hypertension" in title (unless both are present)

❌ **Being too technical**
- "Pancreatic beta-cell resilience" → "Pancreas health" or "Beta cell health"

❌ **Forgetting the audience**
- If content is clearly for seniors, reflect that in ALL elements

❌ **Making slug too long**
- Keep it under 6 words

✅ **Do this instead**:
- Analyze once, optimize all elements together
- Use consistent terminology
- Translate medical jargon to user-friendly terms
- Make audience clear if relevant
- Keep it concise
