# CHUNK-V2-05 — Skills Section Visual Redesign

## File to edit
`components/portfolio/SkillsSection.tsx`

## Current state
- Cream background, single section
- 3-col grid of SkillGroupCard with pill badges

## Target (Canva reference)
Two visually distinct sub-sections within the same `<section id="skills">`:

### Sub-section A: "MY SKILLS"
- **Light gray background** (`bg-[#EBEBEB]` or `bg-gray-100`)
- Left side: heading "MY SKILLS" + list of skill group names as text with red `*` bullets
- Right side: a profile photo (optional — uses `profile.avatar` or empty placeholder)
- Section number `04` top-right

### Sub-section B: "TOOLS AND TECHNOLOGIES"  
- **Cream background** (`bg-portfolio-cream`)
- Heading "TOOLS AND TECHNOLOGIES"
- Grid of tool icon tiles — each shows a devicon image + tool name
- Organized by group (group name as small label above each group's icons)

---

## Prerequisite
CHUNK-V2-01-SCHEMA must be done — `SkillGroup.tools` is now `ToolItem[]` not `string[]`.

---

## Full replacement for `components/portfolio/SkillsSection.tsx`

```tsx
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { Profile, SkillGroup } from '@/types/profile'

interface Props {
  profile: Profile
}

export default function SkillsSection({ profile }: Props) {
  if (!profile.skillGroups || profile.skillGroups.length === 0) return null

  return (
    <section id="skills">
      <MySkillsPanel profile={profile} />
      <ToolsPanel skillGroups={profile.skillGroups} />
    </section>
  )
}

// ─── Sub-section A: MY SKILLS ────────────────────────────────────────────────

function MySkillsPanel({ profile }: { profile: Profile }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <div className="relative py-section sm:py-section-sm bg-gray-100 overflow-hidden">
      {/* Section number */}
      <div className="absolute top-8 right-6 md:right-12 section-num text-portfolio-gray">
        04
      </div>

      <div className="max-w-portfolio mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          {/* Left: heading + skill list */}
          <div className="flex-1">
            <motion.h2
              ref={ref}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-black text-portfolio-black leading-none tracking-tight mb-10"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
            >
              MY SKILLS
            </motion.h2>

            <ul className="flex flex-col gap-4">
              {profile.skillGroups.map((group, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-portfolio-red font-black text-xl shrink-0">*</span>
                  <span className="font-semibold text-portfolio-black text-lg md:text-xl">
                    {group.groupName}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right: profile photo */}
          {profile.avatar && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="shrink-0 w-full md:w-[280px] lg:w-[320px]"
            >
              <div className="relative w-full aspect-[3/4] rounded-portfolio overflow-hidden">
                <Image
                  src={profile.avatar}
                  alt={profile.fullName}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Sub-section B: TOOLS AND TECHNOLOGIES ───────────────────────────────────

function ToolsPanel({ skillGroups }: { skillGroups: SkillGroup[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })

  // Filter groups that have tools
  const groupsWithTools = skillGroups.filter(g => g.tools && g.tools.length > 0)
  if (groupsWithTools.length === 0) return null

  return (
    <div className="relative py-section sm:py-section-sm bg-portfolio-cream border-t border-portfolio-border overflow-hidden">
      <div className="max-w-portfolio mx-auto px-6 md:px-12">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-black text-portfolio-black leading-none tracking-tight mb-10 md:mb-14"
          style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
        >
          TOOLS AND TECHNOLOGIES
        </motion.h2>

        <div className="flex flex-col gap-12">
          {groupsWithTools.map((group, gi) => (
            <motion.div
              key={gi}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: gi * 0.1 }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-portfolio-gray mb-4">
                {group.groupName}
              </p>
              <div className="flex flex-wrap gap-4">
                {group.tools.map((tool, ti) => (
                  <ToolIcon key={ti} name={tool.name} icon={tool.icon} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <span className="asterisk block mt-14">*</span>
      </div>
    </div>
  )
}

function ToolIcon({ name, icon }: { name: string; icon?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 w-[72px]">
      <div className="w-12 h-12 rounded-lg bg-portfolio-border flex items-center justify-center overflow-hidden">
        {icon ? (
          // Devicon CDN: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/{icon}/{icon}-original.svg
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}/${icon}-original.svg`}
            alt={name}
            width={32}
            height={32}
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <span className="text-portfolio-gray text-xs font-bold text-center px-1 leading-tight">
            {name.slice(0, 3).toUpperCase()}
          </span>
        )}
      </div>
      <span className="text-[10px] text-portfolio-gray text-center font-medium leading-tight">
        {name}
      </span>
    </div>
  )
}
```

---

## Key changes from current
1. Single section splits into two sub-sections: `MySkillsPanel` + `ToolsPanel`
2. `MySkillsPanel`: gray-100 bg, skill group names as `*`-bulleted text list, avatar photo right
3. `ToolsPanel`: cream bg, tool icon grid using devicon CDN, organized by group
4. `ToolIcon`: shows devicon SVG from CDN when `icon` slug present; fallback = 3-char text
5. No `SectionWrapper` — inline motion + `isInView` hooks
6. `SkillGroup.tools` is now `ToolItem[]` from schema (CHUNK-V2-01)

## Devicon icon slugs (common examples for settings)
When a user enters a tool in settings, they can also enter an icon slug:
- react, nextjs, typescript, javascript, python, figma, nodejs, mongodb, postgresql, docker

## Verification
- "MY SKILLS" sub-section has gray background, list of group names with red asterisks
- Avatar photo appears on right of MY SKILLS when `profile.avatar` is set
- "TOOLS AND TECHNOLOGIES" sub-section has cream background
- Tool icon tiles show devicon image or 3-char fallback
- No TypeScript errors
