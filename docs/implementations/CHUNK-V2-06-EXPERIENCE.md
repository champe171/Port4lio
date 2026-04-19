# CHUNK-V2-06 — Experience Section Visual Redesign

## Files to edit
- `components/portfolio/ExperienceSection.tsx`
- `components/portfolio/ExperienceCard.tsx`

## Current state
- Cream background, stacked `ExperienceCard` entries
- Cards have border-top separators, red role text, dark metrics block

## Target (Canva reference)
Two parts within `<section id="experience">`:

### Part A: Experience Overview Slide
- **Full RED background**
- Heading "EXPERIENCE" in white
- List of all experience entries as a structured table/list:
  - Company name (large, white)
  - Role (white/lighter)
  - Period (white/muted)
  - Right side: `coverPhoto` thumbnail per entry (if provided)
- Section number `05` top-right

### Part B: Individual Experience Case-Study Slides
- Each experience gets its own full-page-height sub-section
- Alternating background: cream / black (even index = cream, odd index = black)
- Shows full case-study detail: problem, strategy, execution, result, metrics
- Or highlights if no problem field

---

## Prerequisite
CHUNK-V2-01-SCHEMA must be done — `ExperienceItem.coverPhoto?: string` must exist.

---

## 1. Full replacement for `components/portfolio/ExperienceSection.tsx`

```tsx
import ExperienceCard from './ExperienceCard'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'
import type { Profile } from '@/types/profile'

interface Props {
  profile: Profile
}

export default function ExperienceSection({ profile }: Props) {
  if (!profile.experiences || profile.experiences.length === 0) return null

  return (
    <section id="experience">
      {/* Part A: Overview slide — red background */}
      <ExperienceOverview experiences={profile.experiences} />

      {/* Part B: Individual case-study slides */}
      {profile.experiences.map((exp, i) => (
        <ExperienceCard key={i} experience={exp} index={i} />
      ))}
    </section>
  )
}

function ExperienceOverview({
  experiences,
}: {
  experiences: Profile['experiences']
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <div className="relative py-section sm:py-section-sm bg-portfolio-red overflow-hidden">
      {/* Section number */}
      <div className="absolute top-8 right-6 md:right-12 section-num text-white/30">
        05
      </div>

      <div className="max-w-portfolio mx-auto px-6 md:px-12">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-black text-white leading-none tracking-tight mb-10 md:mb-14"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
        >
          EXPERIENCE
        </motion.h2>

        <div className="flex flex-col gap-0 divide-y divide-white/10">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.1 }}
              className="flex items-center justify-between gap-6 py-6"
            >
              {/* Left: company + role + period */}
              <div>
                <h3 className="font-black text-2xl md:text-3xl text-white">
                  {exp.company}
                </h3>
                <p className="text-white/70 text-base mt-1">{exp.role}</p>
                <p className="text-white/40 text-sm font-semibold uppercase tracking-widest mt-1">
                  {exp.period}
                </p>
              </div>

              {/* Right: cover photo thumbnail */}
              {exp.coverPhoto && (
                <div className="shrink-0 w-[80px] md:w-[120px] aspect-square rounded-portfolio overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src={exp.coverPhoto}
                      alt={exp.company}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

## 2. Full replacement for `components/portfolio/ExperienceCard.tsx`

```tsx
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { ExperienceItem } from '@/types/profile'

interface Props {
  experience: ExperienceItem
  index: number
}

export default function ExperienceCard({ experience: exp, index }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })
  const isCaseStudy = Boolean(exp.problem?.trim())

  // Alternate bg: even = cream, odd = black
  const isDark = index % 2 !== 0
  const bgClass = isDark ? 'bg-portfolio-black' : 'bg-portfolio-cream'
  const headingColor = isDark ? 'text-white' : 'text-portfolio-black'
  const roleColor = isDark ? 'text-portfolio-red' : 'text-portfolio-red'
  const bodyColor = isDark ? 'text-white/80' : 'text-portfolio-black'
  const labelColor = isDark ? 'text-white/40' : 'text-portfolio-gray'
  const borderColor = isDark ? 'border-white/10' : 'border-portfolio-border'

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`will-change-transform py-section sm:py-section-sm ${bgClass}`}
    >
      <div className="max-w-portfolio mx-auto px-6 md:px-12">
        {/* Header: company + role + period */}
        <div className={`flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-8 pb-6 border-b ${borderColor}`}>
          <div>
            <h3 className={`font-black text-2xl md:text-3xl ${headingColor}`}>
              {exp.company}
            </h3>
            <p className={`font-semibold text-lg mt-1 ${roleColor}`}>
              {exp.role}
            </p>
          </div>
          <p className={`text-sm font-semibold uppercase tracking-widest whitespace-nowrap ${labelColor}`}>
            {exp.period}
          </p>
        </div>

        {/* Summary */}
        {exp.summary && (
          <p className={`text-base md:text-lg leading-relaxed mb-8 ${bodyColor}`}>
            {exp.summary}
          </p>
        )}

        {/* Case study or highlights */}
        {isCaseStudy ? (
          <CaseStudyBody exp={exp} bodyColor={bodyColor} labelColor={labelColor} />
        ) : (
          <HighlightsBody exp={exp} bodyColor={bodyColor} labelColor={labelColor} />
        )}

        {/* Metrics block */}
        {exp.metrics && (
          <div className={`mt-8 px-6 py-4 rounded-portfolio ${isDark ? 'bg-white/5 border border-white/10' : 'bg-portfolio-black'}`}>
            <p className={`text-sm font-semibold uppercase tracking-widest mb-1 ${isDark ? 'text-white/40' : 'text-portfolio-gray'}`}>
              Results
            </p>
            <p className={`font-black text-xl md:text-2xl ${isDark ? 'text-white' : 'text-portfolio-cream'}`}>
              {exp.metrics}
            </p>
          </div>
        )}
      </div>
    </motion.article>
  )
}

function CaseStudyBody({
  exp,
  bodyColor,
  labelColor,
}: {
  exp: ExperienceItem
  bodyColor: string
  labelColor: string
}) {
  return (
    <div className="flex flex-col gap-8">
      {exp.problem && (
        <Block label="Problem" content={exp.problem} bodyColor={bodyColor} labelColor={labelColor} />
      )}
      {exp.strategy && (
        <Block label="Strategy" content={exp.strategy} bodyColor={bodyColor} labelColor={labelColor} />
      )}
      {exp.execution && exp.execution.length > 0 && (
        <div>
          <h4 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${labelColor}`}>
            Execution
          </h4>
          <BulletList items={exp.execution} bodyColor={bodyColor} />
        </div>
      )}
      {exp.result && exp.result.length > 0 && (
        <div>
          <h4 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${labelColor}`}>
            Outcome
          </h4>
          <BulletList items={exp.result} bodyColor={bodyColor} />
        </div>
      )}
    </div>
  )
}

function Block({
  label,
  content,
  bodyColor,
  labelColor,
}: {
  label: string
  content: string
  bodyColor: string
  labelColor: string
}) {
  return (
    <div>
      <h4 className={`text-xs font-semibold uppercase tracking-widest mb-2 ${labelColor}`}>
        {label}
      </h4>
      <p className={`leading-relaxed ${bodyColor}`}>{content}</p>
    </div>
  )
}

function HighlightsBody({
  exp,
  bodyColor,
  labelColor,
}: {
  exp: ExperienceItem
  bodyColor: string
  labelColor: string
}) {
  if (!exp.highlights || exp.highlights.length === 0) return null

  return (
    <div>
      <h4 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${labelColor}`}>
        Highlights
      </h4>
      <BulletList items={exp.highlights} bodyColor={bodyColor} />
    </div>
  )
}

function BulletList({ items, bodyColor }: { items: string[]; bodyColor: string }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className={`flex items-start gap-3 leading-relaxed ${bodyColor}`}>
          <span className="text-portfolio-red font-black mt-0.5 shrink-0">*</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
```

---

## Key changes from current

### ExperienceSection.tsx
1. Adds `ExperienceOverview` component — red bg, lists all experiences with coverPhoto thumbnails
2. Individual cards rendered below the overview

### ExperienceCard.tsx
1. Each card now has full-section padding (`py-section`) — it IS a full section, not a bordered card
2. Alternating dark/light bg: `index % 2 !== 0` = black bg
3. All text colors passed as props (`headingColor`, `bodyColor`, etc.) based on dark/light mode
4. Metrics block adapts: dark mode = semi-transparent bg; light mode = black bg (original)
5. No more `border-t-2 border-portfolio-black` top border separator

## Verification
- Experience overview slide: full red background, all 3 jobs listed with company/role/period
- First experience card: cream background
- Second experience card (if present): black background
- Third experience card: cream again
- Case study fields (problem/strategy/execution/result) shown when `problem` is non-empty
- Metrics block visible in both dark and light modes
- No TypeScript errors
