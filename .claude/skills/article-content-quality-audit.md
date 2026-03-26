# Article Content Quality Audit

## Mission

You are auditing the **content quality** of health articles (not just metadata). Your goal is to identify articles that need content improvements.

**Focus**: Article body, structure, FAQ, readability, SEO/GEO optimization

---

## What You'll Audit

For each article, you'll examine:
1. **H1 Title** (main heading in content)
2. **Content Structure** (H2, H3 organization)
3. **FAQ Section** (quality and quantity)
4. **Technical Language** (accessibility)
5. **Fact Density** (data, statistics, citations)
6. **User Value** (actionable, practical)

---

## Audit Criteria

### 1. H1 Title Quality (20 points)

**Check:**
- Does H1 match the title metadata?
- Is it natural and user-friendly?
- Does it avoid excessive jargon?
- Is it compelling?

**Red flags:**
- Overly academic: "Understanding the Complex Role of..."
- Too technical: "Baroreceptor Sensitivity Mechanisms in..."
- Doesn't match metadata title

**Good examples:**
```
✅ "Blood Pressure Variability and Brain Health: What You Need to Know"
✅ "How to Lower Blood Pressure Naturally After 60"
❌ "The Pathophysiology of Endothelial Dysfunction in Aging Vasculature"
```

### 2. Content Structure (20 points)

**Check:**
- Clear H2 sections (4-8 main sections)?
- Logical flow (intro → main content → practical tips → FAQ)?
- Appropriate use of H3 subsections?
- Lists and tables for readability?

**Red flags:**
- No clear sections
- Walls of text without breaks
- Poor logical flow
- Missing practical application section

### 3. FAQ Section (25 points)

**Check:**
- Has 3-5 FAQ questions?
- Questions match user search queries?
- Answers are concise (50-150 words)?
- Answers include specific data/numbers?
- Questions use natural language?

**Red flags:**
- No FAQ section
- Only 1-2 questions
- Questions too technical
- Answers too vague or academic
- Missing keyword in questions

**Good FAQ example:**
```markdown
#### Does blood pressure variability affect brain health even if my average BP is normal?

Yes—it absolutely can. Research shows that high blood pressure variability affects brain health independently of average BP levels. People with "normal" averages (e.g., 120–130 mmHg systolic) but wide swings (>15 mmHg SD) still show greater white matter changes—especially after age 69.
```

**Bad FAQ example:**
```markdown
#### What is hypertension?

Hypertension is high blood pressure.
```

### 4. Technical Language (15 points)

**Check:**
- Uses plain language for target audience (50+ adults)?
- Technical terms explained when first used?
- Avoids unnecessary jargon?
- Conversational tone?

**Red flags:**
- Unexplained medical terms: "endothelial dysfunction", "baroreceptor sensitivity"
- Academic writing style
- Reads like a research paper, not a helpful guide

**Acceptable technical terms** (common knowledge):
- blood pressure, cholesterol, diabetes, heart rate
- blood sugar, insulin, A1C

**Should be explained or avoided**:
- endothelial, baroreceptor, postprandial
- microinfarct, white matter hyperintensities

### 5. Fact Density (10 points)

**Check:**
- Includes specific numbers, percentages, ranges?
- Cites research or authoritative sources?
- Provides concrete examples?
- Quantifies recommendations?

**Good fact density:**
```
"A 24-hour systolic BP SD >15 mmHg raises concern, especially in adults with WMHs. Studies show 2.3 times higher odds of microinfarct burden (ASPIS cohort, 2023)."
```

**Poor fact density:**
```
"Blood pressure variability can be harmful. You should monitor it regularly."
```

### 6. User Value & Actionability (10 points)

**Check:**
- Provides practical, actionable advice?
- Includes "what to do" sections?
- Has clear takeaways?
- Addresses user intent?

**Red flags:**
- Only explains "what" and "why", no "how"
- No practical recommendations
- Academic focus without application

---

## Scoring (0-100)

| Score | Assessment | Action |
|-------|------------|--------|
| 85-100 | Excellent | No content optimization needed |
| 70-84 | Good | Minor improvements possible |
| 60-69 | Fair | Should optimize content |
| <60 | Poor | Must optimize content |

**Threshold**: Score <85 = flag for content optimization

---

## Output Format

For each article:

```json
{
  "slug": "article-slug",
  "content_quality_score": 75,
  "needs_content_optimization": true,

  "content_audit": {
    "h1_title": {
      "score": 70,
      "current": "Understanding Blood Pressure Variability in Aging Brains",
      "issues": [
        "Too academic - 'Understanding' is weak opening",
        "Uses technical term 'aging brains' instead of user-friendly 'seniors'"
      ],
      "strengths": [
        "Includes main topic"
      ]
    },

    "structure": {
      "score": 80,
      "h2_count": 6,
      "has_practical_section": true,
      "issues": [
        "Could use more lists/tables for readability"
      ],
      "strengths": [
        "Clear logical flow",
        "Good number of sections"
      ]
    },

    "faq": {
      "score": 85,
      "question_count": 5,
      "issues": [],
      "strengths": [
        "5 questions (good)",
        "Questions use natural language",
        "Answers include specific data"
      ]
    },

    "technical_language": {
      "score": 60,
      "issues": [
        "Uses 'endothelial injury' without explanation",
        "Term 'circadian amplitude' too technical",
        "Academic tone in several paragraphs"
      ],
      "unexplained_terms": [
        "endothelial injury",
        "circadian amplitude",
        "cerebral small-vessel"
      ],
      "strengths": [
        "Explains 'white matter hyperintensities'",
        "Generally conversational"
      ]
    },

    "fact_density": {
      "score": 90,
      "specific_numbers_count": 12,
      "citations_count": 3,
      "strengths": [
        "Excellent use of specific data",
        "Cites recent research (2023-2024)",
        "Provides concrete ranges and thresholds"
      ]
    },

    "user_value": {
      "score": 85,
      "has_actionable_advice": true,
      "has_practical_section": true,
      "strengths": [
        "Clear 'what to do' section",
        "Practical monitoring advice",
        "When to see doctor guidance"
      ]
    }
  },

  "optimization_priority": "medium",
  "key_content_issues": [
    "H1 title too academic",
    "Several unexplained technical terms",
    "Could improve readability with more visual breaks"
  ],

  "recommended_improvements": [
    "Simplify H1 to 'Blood Pressure Variability and Brain Health: What Seniors Need to Know'",
    "Add brief explanations for 'endothelial injury' and 'circadian amplitude'",
    "Convert some dense paragraphs to bulleted lists"
  ]
}
```

---

## Important Guidelines

### 1. Be Realistic but Fair

- Don't expect perfection
- These are health articles for real people, not academic papers
- Focus on: "Will this help the target audience (50-80 year olds)?"

### 2. Context Matters

**For frail/elderly audience**:
- Emphasize safety and gentleness in language
- Extra points for accessible tone

**For technical topics**:
- Some jargon is unavoidable
- But it should be explained

### 3. FAQ is Critical for GEO

- AI engines (ChatGPT, Claude, Perplexity) prioritize FAQ content
- Good FAQ = much higher GEO visibility
- This is **very important** to check carefully

### 4. Don't Flag Good Articles

If an article scores 85+, even if you see room for minor improvements:
- **Do NOT flag it** for content optimization
- We want to focus efforts on articles that truly need help

---

## Common Issues to Watch For

### Issue 1: Missing or Weak FAQ

```markdown
❌ Bad (only 2 questions, too basic):
#### What is blood pressure?
Blood pressure is the force of blood against artery walls.

#### Is high blood pressure bad?
Yes, it can be harmful.

✅ Good (5 questions, specific, natural):
#### Does blood pressure variability affect brain health even if my average BP is normal?
Yes—it absolutely can. Research shows that high blood pressure variability and brain health are linked independently of average BP levels...
[150 words with specific data]
```

### Issue 2: Academic H1

```markdown
❌ "Understanding the Pathophysiological Mechanisms of Blood Pressure Variability"
✅ "Blood Pressure Variability and Brain Health: What You Need to Know"
```

### Issue 3: Unexplained Jargon

```markdown
❌ "Excessive circadian amplitude leads to endothelial injury."

✅ "When blood pressure swings widely throughout the day and night (called high circadian amplitude), it can damage the delicate lining of blood vessels (endothelial injury)."
```

### Issue 4: No Practical Advice

```markdown
❌ Article only explains what BP variability is and why it matters
    (No "what should I do" section)

✅ Article includes clear section:
    "Practical Steps to Support Steadier Blood Pressure"
    - Sleep hygiene tips
    - Medication timing
    - Exercise recommendations
```

---

## Your Task Summary

For each article:

1. **Read the full markdown content** (not just metadata)
2. **Evaluate all 6 criteria** (H1, structure, FAQ, language, facts, value)
3. **Score 0-100** based on content quality
4. **Flag if <85** for content optimization
5. **List specific issues** and recommended improvements
6. **Be helpful** - specific feedback that can guide optimization

**Remember**: Your goal is to identify articles where content improvements will meaningfully help users discover and benefit from the health information.
