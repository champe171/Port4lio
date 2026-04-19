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
