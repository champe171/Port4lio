# CHUNK-V2-02 — Hero Section Visual Redesign

## File to edit
`components/portfolio/HeroSection.tsx`

## Current state
- Name rendered in `text-portfolio-black`
- Tagline paragraph with asterisk below it
- Two HeroPhoto boxes stacked right-aligned

## Target (Canva reference)
- Name rendered in **`text-portfolio-red`** — the giant headline IS the red color
- Tagline on the LEFT, asterisk to the LEFT of the tagline text (inline, not below)
- Photos on the RIGHT — one taller portrait (~3:4), one shorter landscape — side by side
- Section number `01` top-right

---

## Full replacement for `components/portfolio/HeroSection.tsx`

```tsx
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Profile } from '@/types/profile'
import { staggerContainer, wordSlide, fadeIn, scaleIn } from '@/utils/variants'

interface Props {
  profile: Profile
}

export default function HeroSection({ profile }: Props) {
  const nameParts = (profile.fullName || 'PORTFOLIO').toUpperCase().split(' ')

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-portfolio-cream pt-[72px] flex flex-col justify-center overflow-hidden"
    >
      <div className="absolute top-24 right-6 md:right-12 section-num text-portfolio-gray">
        01
      </div>

      <div className="max-w-portfolio mx-auto px-6 md:px-12 w-full">
        {/* Name — staggered word reveal, RED */}
        <motion.h1
          className="font-black leading-none tracking-tight text-portfolio-red"
          style={{ fontSize: 'clamp(3rem, 10vw, 9rem)' }}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {nameParts.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.2em] will-change-transform"
              variants={wordSlide}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Tagline + photos row */}
        <div className="mt-8 md:mt-12 flex flex-col md:flex-row md:items-end gap-8 md:gap-12">
          {/* Tagline — asterisk inline before text */}
          <motion.div
            className="flex-1 flex items-start gap-3"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <motion.span
              className="asterisk shrink-0 mt-1"
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
            >
              *
            </motion.span>
            <p className="text-lg md:text-xl text-portfolio-gray leading-relaxed max-w-md">
              {profile.tagline || 'Turning ideas into action.'}
            </p>
          </motion.div>

          {/* Hero photos — portrait left, landscape right */}
          <motion.div
            className="flex items-end gap-4 md:gap-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <HeroPhoto
              src={profile.heroPhotoLeft}
              alt="Photo left"
              className="w-[140px] md:w-[200px] aspect-[3/4]"
            />
            <HeroPhoto
              src={profile.heroPhotoRight}
              alt="Photo right"
              className="w-[110px] md:w-[160px] aspect-[4/5]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function HeroPhoto({
  src,
  alt,
  className,
}: {
  src?: string
  alt: string
  className: string
}) {
  if (!src) {
    return (
      <div
        className={`${className} bg-portfolio-border rounded-portfolio flex items-center justify-center shrink-0`}
        aria-label={alt}
      >
        <span className="text-portfolio-gray text-xs text-center px-2">
          Upload in /setting
        </span>
      </div>
    )
  }

  return (
    <div className={`relative ${className} rounded-portfolio overflow-hidden shrink-0`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 140px, 200px"
        className="object-cover"
        priority
      />
    </div>
  )
}
```

---

## Key changes from current
1. `text-portfolio-red` on `<h1>` (was `text-portfolio-black`)
2. Tagline div now uses `flex items-start gap-3` with asterisk as first child (inline left)
3. Asterisk `<span>` moved inside the tagline div, before the `<p>` (was below the `<p>`)
4. `HeroPhoto` accepts `className` prop for different aspect ratios per photo slot
5. Photos use `items-end` alignment — taller photo aligns to bottom with shorter photo

## Verification
- Hero name renders in red
- Asterisk appears to the left of the tagline text, not below it
- Two photo placeholders have different heights (taller left, shorter right)
- No TypeScript errors
