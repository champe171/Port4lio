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
