# BPCare AI Official Website

Official website and SEO content hub for BPCare AI - a blood pressure and heart health tracking iOS app designed for middle-aged and elderly users managing hypertension.

## 🌐 Live Site

**Production:** [https://bpcareai.com](https://bpcareai.com)

## 📋 Project Overview

This is a Next.js 14-based website featuring:
- **Homepage:** Marketing and product introduction with empathetic, middle-aged-friendly messaging
- **Articles System:** Markdown-based SEO content about blood pressure, heart health, HRV, and cardiovascular wellness
- **Future-ready:** Structured for upcoming SEO automation (batch article generation + vector search + auto internal linking)

### Design Philosophy

The website is designed specifically for **middle-aged and elderly users** with hypertension concerns:
- **Larger fonts and comfortable spacing** for easy reading
- **Calming color palette** (blue-purple-pink gradient from the iOS app)
- **Empathetic, reassuring language** that reduces anxiety
- **Clear information hierarchy** with minimal jargon

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and npm
- Basic familiarity with Next.js and React

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd bpcareai-site
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
bpcareai-site/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with SEO metadata
│   ├── page.tsx             # Homepage
│   ├── articles/            # Articles system
│   │   ├── page.tsx         # Articles list page
│   │   └── [slug]/          # Dynamic article pages
│   │       └── page.tsx
│   ├── api/                 # API routes
│   │   └── healthcheck/
│   ├── sitemap.ts           # Dynamic sitemap generation
│   └── robots.ts            # Robots.txt configuration
│
├── components/              # Reusable React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── FeatureCard.tsx
│   ├── CTAButton.tsx
│   └── homepage/           # Homepage section components
│       ├── HeroSection.tsx
│       ├── FeaturesSection.tsx
│       ├── HowItWorksSection.tsx
│       ├── WhoItsForSection.tsx
│       ├── WhyItMattersSection.tsx
│       ├── ArticlesPreviewSection.tsx
│       ├── TestimonialsSection.tsx
│       └── FinalCTASection.tsx
│
├── content/                 # Content files
│   └── articles/            # Markdown article files
│       ├── understanding-blood-pressure-numbers.md
│       ├── heart-rate-variability-explained.md
│       └── when-to-worry-about-high-readings.md
│
├── lib/                     # Utility functions
│   └── articles.ts          # Article management (read/parse Markdown)
│
├── public/                  # Static assets
│   ├── Logo files (to be added)
│   └── OG images (to be added)
│
└── Configuration files
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.js
    └── README.md
```

## 📝 Adding a New Article

### 1. Create a Markdown File

Create a new `.md` file in `content/articles/` with this frontmatter structure:

```markdown
---
title: "Your Article Title"
slug: "your-article-slug"
description: "A brief description of your article (for SEO and previews)"
date: "2024-11-20"
tags: ["blood pressure", "heart health", "education"]
---

# Your Article Title

Your article content here in Markdown format...
```

### 2. File Naming Convention

Use kebab-case for file names matching the slug:
```
your-article-slug.md
```

### 3. Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Article title (shown in lists and page header) |
| `slug` | Yes | URL-friendly identifier (must match filename) |
| `description` | Yes | Brief summary for SEO and previews (150-160 chars ideal) |
| `date` | Yes | Publication date in YYYY-MM-DD format |
| `tags` | Yes | Array of relevant tags |

### 4. Writing Guidelines

For **middle-aged and elderly readers:**
- **Use clear, simple language** - avoid medical jargon where possible
- **Break up text** with headers, lists, and short paragraphs
- **Explain medical terms** when you must use them
- **Be reassuring and empathetic** - reduce anxiety, don't create it
- **Focus on patterns over single readings** - emphasize trends
- **Include actionable advice** - what readers can actually do

### Example Content Structure:

```markdown
---
title: "How Stress Affects Your Blood Pressure"
slug: "stress-and-blood-pressure"
description: "Understanding the connection between daily stress and blood pressure readings, and simple techniques to manage both."
date: "2024-11-20"
tags: ["stress", "blood pressure", "lifestyle"]
---

# How Stress Affects Your Blood Pressure

Have you noticed your blood pressure readings are higher when you're stressed? You're not imagining it...

## The Stress-Blood Pressure Connection

[Clear explanation in simple terms]

## Why This Matters

[Reassuring context]

## What You Can Do

[Practical, actionable advice]

---

*Medical disclaimer text*
```

### 5. Test Your Article

After adding an article:

1. **Restart the dev server** (articles are loaded at build time):
   ```bash
   npm run dev
   ```

2. **Check the articles list:**
   Navigate to [http://localhost:3000/articles](http://localhost:3000/articles)

3. **View your article:**
   Click on your article or go directly to `/articles/your-slug`

4. **Verify:**
   - Title, date, and tags display correctly
   - Content renders properly
   - No broken links or images

## 🎨 Brand Colors

The site uses colors extracted from the BPCare AI iOS app:

```css
/* Light mode gradient background */
Blue:   #D9F2FF → #85C1E9 → #1F3A57
Purple: #F2E6FF → #B19CD9 → #2D1F3D
Pink:   #FFEBF2 → #E8B4D9 → #3D1F2D

/* Semantic colors */
Heart/Primary:  #EF4444 (red)
Success:        #10B981 (green)
Warning:        #F59E0B (orange)
Info:           #3B82F6 (blue)
```

These create a calming, professional feel suitable for health-focused content.

## 🔍 SEO Configuration

### Metadata

Global SEO settings are in `app/layout.tsx`:
- Default title template
- Site description
- Open Graph tags
- Twitter Card tags

Each page can override these with specific metadata.

### Sitemap

Automatically generated at `/sitemap.xml`:
- Homepage
- Articles list page
- All individual articles

Regenerated on each build with current content.

### Robots.txt

Configured in `app/robots.ts` to:
- Allow all search engines
- Exclude `/api/` routes
- Reference sitemap location

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect your Git repository** to Vercel
2. **Import the project** (auto-detects Next.js)
3. **Configure environment** (if needed)
4. **Deploy** - automatic on every push

### Environment Variables

Currently none required. Future additions might include:
- Analytics IDs
- API keys for content generation
- Vector database credentials

### Build Command

```bash
npm run build
```

This generates a standalone production build.

## 🔮 Future Enhancements

The site is structured to support:

1. **Batch Article Generation**
   - Scripts to generate articles from templates
   - AI-assisted content creation with medical fact-checking

2. **Vector Search & Auto Internal Linking**
   - Embed articles as vectors
   - Automatically suggest and insert relevant internal links
   - Semantic content recommendations

3. **Advanced Article Filtering**
   - Tag-based filtering
   - Search functionality
   - Related articles by topic

4. **Analytics Integration**
   - User behavior tracking
   - Popular articles
   - SEO performance metrics

## 📄 License

Copyright © 2024 BPCare AI. All rights reserved.

## 📧 Contact

For questions or support:
- **Email:** mariememe0624@gmail.com
- **Website:** [https://bpcareai.com](https://bpcareai.com)

---

**Made with care for those managing their heart health** ❤️
