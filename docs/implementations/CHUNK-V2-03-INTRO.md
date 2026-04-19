# CHUNK-V2-03 — Introduction Section Visual Redesign

## File to edit
`components/portfolio/IntroSection.tsx`

## Current state
- Cream background (`bg-portfolio-cream`)
- Red heading "About"
- Single-column paragraph, black text

## Target (Canva reference)
- **Full RED background** (`bg-portfolio-red`)
- **White text** throughout
- Giant heading "INTRODUCTION" (all caps, white, very large)
- **Two-column layout**: left column = body text, right column can hold extra content/photo
- `introPhoto` shown on the **left side** alongside the text
- Section number `02` top-right (white)
- Asterisk decorator (white)

---

## Prerequisite
CHUNK-V2-01-SCHEMA must be implemented first — `Profile.introPhoto?: string` must exist in types.

---

## Full replacement for `components/portfolio/IntroSection.tsx`

```tsx
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { Profile } from '@/types/profile'

interface Props {
  profile: Profile
}

export default function IntroSection({ profile }: Props) {
  if (!profile.introduction) return null

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <section
      id="about"
      className="relative py-section sm:py-section-sm bg-portfolio-red overflow-hidden"
    >
      {/* Section number — white on red */}
      <div className="absolute top-8 right-6 md:right-12 section-num text-white/50">
        02
      </div>

      <div className="max-w-portfolio mx-auto px-6 md:px-12">
        {/* Heading */}
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-black text-white leading-none tracking-tight mb-10 md:mb-14"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
        >
          INTRODUCTION
        </motion.h2>

        {/* Two-column: photo left + text right */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          {/* Left: intro photo */}
          {profile.introPhoto && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="shrink-0 w-full md:w-[280px] lg:w-[340px]"
            >
              <div className="relative w-full aspect-[3/4] rounded-portfolio overflow-hidden">
                <Image
                  src={profile.introPhoto}
                  alt={`${profile.fullName} intro photo`}
                  fill
                  sizes="(max-width: 768px) 100vw, 340px"
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* Right: text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="flex-1"
          >
            <p className="text-white text-lg md:text-xl leading-relaxed">
              {profile.introduction}
            </p>

            <span className="block mt-10 text-white/70 font-black text-4xl">*</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

---

## Key changes from current
1. `bg-portfolio-red` on section (was `bg-portfolio-cream`)
2. `text-white` throughout (was `text-portfolio-black` / `text-portfolio-red`)
3. Heading is `"INTRODUCTION"` all-caps (was `"About"`)
4. Two-column layout: `introPhoto` on left, paragraph on right
5. Asterisk is white (`text-white/70`) not the global `.asterisk` class (which uses portfolio-red)
6. Section number `text-white/50`
7. If no `introPhoto`, the text takes full width (single column)

## Verification
- Section has solid red background, no cream showing through
- "INTRODUCTION" heading in white, large
- Intro photo appears on the left when `profile.introPhoto` is set
- Paragraph text is white
- Asterisk is visible (white) at bottom of text column
- No TypeScript errors (introPhoto is optional, guarded by `&&`)
