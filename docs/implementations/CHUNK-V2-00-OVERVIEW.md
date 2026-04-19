# CHUNK-V2-00 — Visual Redesign Overview

## Goal
Rebuild all portfolio section components to match the Canva reference design at htntport.my.canva.site. The current implementation uses a uniform cream background with red headings. The Canva design uses dramatic full-bleed color sections (red, black, cream alternating), large editorial typography, and a two-panel layout language.

## What stays the same
- Next.js 14 Pages Router, getStaticProps + ISR
- MongoDB + Mongoose singleton profile
- Tailwind custom tokens (portfolio-cream, portfolio-red, portfolio-black, portfolio-gray)
- Framer Motion animations (variants in utils/variants.ts)
- Nav, PortfolioLayout, AdminLayout
- pages/index.tsx section rendering order
- Settings editor structure (only additions, covered in CHUNK-V2-08)

## What changes — section by section

| Section | Current | Target |
|---------|---------|--------|
| Hero (01) | Black name, cream bg | **RED name**, cream bg, asterisk left of tagline |
| Intro (02) | Cream bg, red heading | **Full RED bg**, white text, 2-col layout, left photo |
| Education (03) | Cream bg | **Full BLACK bg**, red heading, asterisk bullets |
| Skills (04) | Cream bg, pill badges | **Gray bg**: "MY SKILLS" text list + photo; **Cream bg**: "TOOLS" icon grid |
| Experience (05) | Cream bg, stacked cards | **RED overview** slide + individual case-study slides below |
| Contact (06) | Cream bg, label/value rows | **Giant "LET'S WORK TOGETHER"** red text + icon links at bottom |

## New schema fields (see CHUNK-V2-01-SCHEMA for full spec)
- `Profile.introPhoto?: string` — Cloudinary URL for the photo in the Introduction section
- `SkillGroup.tools` changes from `string[]` to `ToolItem[]` where `ToolItem = { name: string; icon?: string }`
- `ExperienceItem.coverPhoto?: string` — photo shown on the Experience overview slide

## Chunk execution order (for Cursor, one chunk at a time)
1. CHUNK-V2-01-SCHEMA — types/profile.ts + models/Profile.ts
2. CHUNK-V2-02-HERO — components/portfolio/HeroSection.tsx
3. CHUNK-V2-03-INTRO — components/portfolio/IntroSection.tsx
4. CHUNK-V2-04-EDUCATION — components/portfolio/EducationSection.tsx
5. CHUNK-V2-05-SKILLS — components/portfolio/SkillsSection.tsx
6. CHUNK-V2-06-EXPERIENCE — components/portfolio/ExperienceSection.tsx + ExperienceCard.tsx
7. CHUNK-V2-07-CONTACT — components/portfolio/ContactSection.tsx
8. CHUNK-V2-08-SETTINGS — settings editor components

## Design tokens already in tailwind.config.ts (do not add duplicates)
```
portfolio-cream: '#F5F4EF'
portfolio-red:   '#CC1A1A'
portfolio-black: '#1A1A1A'
portfolio-gray:  '#6B6B6B'
portfolio-border:'#E5E4DF'
```

## Design language rules (apply to every section)
- Section numbers: top-right corner, class `section-num` (already in globals.css)
- Asterisk decorators: use `<span className="asterisk">*</span>` (already in globals.css)
- All sections use `id="hero|about|education|skills|experience|contact"` (nav anchors)
- Max-width container: `className="max-w-portfolio mx-auto px-6 md:px-12"`
- Full-bleed colored sections: apply bg color to `<section>`, no inner container bg override
- White text on red/black backgrounds: `text-white` (not `text-portfolio-cream`)
- Section heading font size: `style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}` + `font-black`
