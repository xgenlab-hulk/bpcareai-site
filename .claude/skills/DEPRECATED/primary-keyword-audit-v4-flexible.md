# PrimaryKeyword Quality Audit Guide v4.0 (Flexible)

## Your Mission

You are evaluating PrimaryKeywords to determine if they effectively help users discover articles through search engines and AI tools (SEO/GEO).

**Core Question**: Would a real person search for this? Does it accurately represent the article content?

---

## Evaluation Philosophy

**Think like a user, not a robot.**

- ✅ Use your judgment and understanding of search behavior
- ✅ Consider context - what works for one article may not work for another
- ❌ Don't mechanically apply rigid rules
- ❌ Don't force keywords to fit a template if it makes them unnatural

---

## Scoring Framework (0-100 points)

### 1. Search Match Quality (40 points)

**Core Question**: Would real users search using these terms?

**Consider:**
- Is this how people actually search for health information?
- Are the medical terms user-friendly (not overly technical)?
- Does it match what the article is about?

**Examples:**

```
✅ 95/100: "blood pressure monitoring seniors"
   - Real users search this way
   - Clear medical topic + relevant audience

✅ 85/100: "blood pressure monitoring"
   - Real search query
   - No audience specified, but that's OK if article is general

⚠️ 60/100: "health management seniors"
   - Too generic - "health" is vague
   - Users search for specific conditions, not "health"

❌ 30/100: "endothelial dysfunction microvascular aging"
   - Medical jargon users won't search
   - Unnatural phrasing
```

**Red Flags:**
- Technical medical terms: "tmao", "endothelial", "postprandial", "baroreceptor"
- Generic vague terms as main topic: "health", "wellness", "lifestyle"
- Keyword stuffing: "blood pressure hypertension bp monitoring control"

---

### 2. Clarity & Specificity (30 points)

**Core Question**: Is it clear and specific enough to be useful?

**Consider:**
- Does it describe a specific medical topic/condition?
- Is the search intent clear?
- Would adding audience (seniors, adults 60+) improve specificity? **(Use judgment - not always necessary!)**

**Decision Guide: When to include audience**

✅ **Include audience when:**
- Article content is specific to an age group
- Advice differs by demographic (e.g., "seniors" vs "young adults")
- Target readers are clearly elderly/senior population

⚠️ **Audience optional when:**
- Information is universal across age groups
- Article title/content doesn't emphasize age
- Adding it would feel forced

❌ **Don't force audience when:**
- It makes the keyword unnatural
- The medical topic is already specific enough
- Users wouldn't typically add age to their search

**Examples:**

```
✅ Good specificity: "diabetes diet tips holiday meals"
   - Specific condition (diabetes)
   - Specific context (holiday meals)
   - Clear intent (diet tips)
   - Audience not needed - applies broadly

✅ Good with audience: "blood pressure management seniors over 70"
   - Audience adds value (management differs by age)
   - Natural phrasing

⚠️ Too generic: "health tips"
   - What kind of health?
   - Too vague to be useful

❌ Forced audience: "heart health monitoring adults 25+"
   - "adults 25+" is too broad and unnatural
   - Better without it: "heart health monitoring"
```

---

### 3. Natural Phrasing (20 points)

**Core Question**: Does it sound like something a real person would type into Google?

**Consider:**
- Reads naturally, not like keyword stuffing
- Uses connecting words when needed ("for", "with", "in", "management")
- Length feels right (typically 30-50 chars, but use judgment)

**Examples:**

```
✅ Natural: "diabetes management holiday meals seniors"
✅ Natural: "blood pressure spike morning commute"
✅ Natural: "heart medication side effects elderly"

⚠️ Awkward: "blood pressure management control monitoring seniors"
   - Too many similar words

❌ Unnatural: "diabetes glucose control management tips advice"
   - Keyword stuffing
```

---

### 4. SEO/GEO Value (10 points)

**Core Question**: Will this help the article get discovered?

**Consider:**
- Specific enough to match user intent?
- Not too broad (impossible to rank)
- Not too narrow (nobody searches)

---

## Scoring Guide

**Your final score should be a holistic judgment, not mechanical addition.**

| Score | Grade | Meaning |
|-------|-------|---------|
| 90-100 | Excellent | Perfect or near-perfect keyword |
| 85-89 | Very Good | Minor improvements possible but not necessary |
| 70-84 | Good | Works well, optional optimization |
| 60-69 | Fair | Could be better, consider optimization |
| 40-59 | Poor | Should optimize |
| 0-39 | Very Poor | Must optimize |

**Threshold**: Score < 85 = recommend optimization

---

## Decision Framework

For each keyword, ask yourself:

### ✅ Good Signs (should score 85+)
- [ ] Real people would search using these terms
- [ ] Medical topic is specific and user-friendly
- [ ] Phrasing is natural and readable
- [ ] Clear what the user is looking for
- [ ] Length feels right (usually 30-50 chars)

### ⚠️ Warning Signs (probably < 85)
- [ ] Contains technical jargon users won't search
- [ ] Main topic is too generic ("health", "wellness")
- [ ] Unnatural phrasing or keyword stuffing
- [ ] Unclear what user is looking for
- [ ] Too short (<25 chars) or too long (>65 chars)

### ❌ Critical Issues (definitely < 70)
- [ ] Multiple technical terms
- [ ] No clear medical topic
- [ ] Completely unnatural phrasing
- [ ] User would never search this way

---

## Common Pitfalls to Avoid

### Pitfall 1: Forcing audience when unnecessary

```
❌ Wrong thinking: "Every keyword MUST have audience = 20 points"
✅ Right thinking: "Does this keyword benefit from audience specificity?"

Example:
"blood pressure monitoring" - May be fine without audience if article is general
"blood pressure monitoring seniors with diabetes" - Audience adds value if article is specific
```

### Pitfall 2: Penalizing generically good keywords

```
❌ Wrong: "diabetes management" scores low because no audience
✅ Right: "diabetes management" is a strong, searchable keyword - score should be 80-85

It COULD be better with audience ("diabetes management seniors"), but it's not bad as-is.
```

### Pitfall 3: Rewarding unnatural keywords

```
❌ Wrong: "blood pressure management adults 30-80" gets high score because it has audience
✅ Right: The age range "30-80" is unnatural and too broad - should lower score

Just because it follows a "template" doesn't make it good!
```

---

## Output Format

```json
{
  "batch_id": 1,
  "total_checked": 100,
  "articles": [
    {
      "slug": "article-slug",
      "primaryKeyword": "the keyword",
      "score": 85,
      "grade": "Very Good",
      "needs_optimization": false,
      "reasoning": "Clear medical topic (blood pressure), natural phrasing, user-friendly terms. Audience not necessary as content applies broadly. Minor room for improvement but not required.",
      "strengths": [
        "Specific medical topic",
        "Natural search phrasing",
        "User-friendly terminology"
      ],
      "weaknesses": []
    },
    {
      "slug": "another-article",
      "primaryKeyword": "health management seniors",
      "score": 55,
      "grade": "Poor",
      "needs_optimization": true,
      "reasoning": "Main topic 'health management' is too generic - users search for specific conditions (diabetes, blood pressure, etc.), not 'health' broadly. Has audience (seniors) which is good, but needs specific medical topic.",
      "strengths": [
        "Has audience identifier"
      ],
      "weaknesses": [
        "Too generic - no specific medical topic",
        "Users don't search 'health management'"
      ]
    }
  ],
  "summary": {
    "total": 100,
    "excellent_90plus": 25,
    "very_good_85to89": 15,
    "good_70to84": 30,
    "fair_60to69": 15,
    "poor_40to59": 10,
    "very_poor_below40": 5,
    "needs_optimization": 30
  }
}
```

---

## Key Principles to Remember

1. **Context matters** - What works for one article may not work for another
2. **Think like a user** - Would you search this way?
3. **Natural > Template** - A natural keyword without audience beats an unnatural one with audience
4. **Specific > Generic** - "Blood pressure" beats "health", even without other details
5. **Use judgment** - You're a smart AI, not a rule-following robot

**Your goal**: Identify keywords that will actually help users find relevant content, not keywords that mechanically follow a formula.
