import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { Profile } from '@/types/profile'

interface Props {
  profile: Profile
}

export default function EducationSection({ profile }: Props) {
  const hasEducation = profile.education && profile.education.length > 0
  const hasCerts = profile.certificates && profile.certificates.length > 0

  if (!hasEducation && !hasCerts) return null

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <section
      id="education"
      className="relative py-section sm:py-section-sm bg-portfolio-black overflow-hidden"
    >
      {/* Section number — white on black */}
      <div className="absolute top-8 right-6 md:right-12 section-num text-white/30">
        03
      </div>

      <div className="max-w-portfolio mx-auto px-6 md:px-12">
        {/* Heading */}
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-black text-portfolio-red leading-none tracking-tight mb-10 md:mb-14"
          style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
        >
          EDUCATION &amp; CERTIFICATION
        </motion.h2>

        {/* Two columns: Education left, Certs right */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          {/* Education entries */}
          {hasEducation && (
            <div className="flex flex-col gap-8">
              {profile.education.map((item, i) => (
                <EducationEntry key={i} item={item} index={i} isInView={isInView} />
              ))}
            </div>
          )}

          {/* Certifications */}
          {hasCerts && (
            <CertList certs={profile.certificates} isInView={isInView} />
          )}
        </div>
      </div>
    </section>
  )
}

function EducationEntry({
  item,
  index,
  isInView,
}: {
  item: { schoolName: string; major: string; start: string; end: string }
  index: number
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 + index * 0.1 }}
      className="border-t border-white/10 pt-5"
    >
      <p className="text-sm text-white/50 font-semibold uppercase tracking-widest mb-2">
        {item.start}{item.end ? ` — ${item.end}` : ''}
      </p>
      <div className="flex items-start gap-3">
        <span className="text-portfolio-red font-black text-xl shrink-0 mt-0.5">*</span>
        <div>
          <h3 className="font-black text-xl md:text-2xl text-white">
            {item.schoolName}
          </h3>
          {item.major && (
            <p className="text-white/60 mt-1">{item.major}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function CertList({
  certs,
  isInView,
}: {
  certs: Array<{ name: string; link: string }>
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    >
      <h3 className="font-black text-lg text-white/50 mb-6 uppercase tracking-widest">
        Certifications
      </h3>
      <ul className="flex flex-col gap-4">
        {certs.map((cert, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-portfolio-red font-black text-xl shrink-0 mt-0.5">*</span>
            {cert.link ? (
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-medium hover:text-portfolio-red transition-colors"
              >
                {cert.name}
              </a>
            ) : (
              <span className="text-white font-medium">{cert.name}</span>
            )}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
