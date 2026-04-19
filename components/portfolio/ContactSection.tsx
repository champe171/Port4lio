import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { Profile } from '@/types/profile'

interface Props {
  profile: Profile
}

export default function ContactSection({ profile }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <section
      id="contact"
      className="relative py-section sm:py-section-sm bg-portfolio-cream overflow-hidden"
    >
      {/* Section number */}
      <div className="absolute top-8 right-6 md:right-12 section-num text-portfolio-gray">
        06
      </div>

      <div className="max-w-portfolio mx-auto px-6 md:px-12">
        {/* Giant CTA heading */}
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 48 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-black text-portfolio-red leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
        >
          LET&apos;S WORK
          <br />
          TOGETHER
        </motion.h2>

        {/* Asterisk */}
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="asterisk block mt-6 mb-12 md:mb-16"
        >
          *
        </motion.span>

        {/* Contact row — icons + values */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="flex flex-col sm:flex-row flex-wrap gap-6 md:gap-10 border-t border-portfolio-border pt-8"
        >
          {profile.phone && (
            <ContactLink
              href={`tel:${profile.phone}`}
              icon={<PhoneIcon />}
              label={profile.phone}
            />
          )}
          {profile.email && (
            <ContactLink
              href={`mailto:${profile.email}`}
              icon={<EmailIcon />}
              label={profile.email}
            />
          )}
          {profile.linkedinUrl && (
            <ContactLink
              href={profile.linkedinUrl}
              icon={<LinkedInIcon />}
              label={profile.linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
              external
            />
          )}

          {!profile.phone && !profile.email && !profile.linkedinUrl && (
            <p className="text-portfolio-gray">Contact details coming soon.</p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function ContactLink({
  href,
  icon,
  label,
  external = false,
}: {
  href: string
  icon: React.ReactNode
  label: string
  external?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-3 group"
    >
      <span className="w-10 h-10 rounded-full border border-portfolio-border flex items-center justify-center text-portfolio-black group-hover:bg-portfolio-red group-hover:border-portfolio-red group-hover:text-white transition-colors shrink-0">
        {icon}
      </span>
      <span className="font-semibold text-portfolio-black group-hover:text-portfolio-red transition-colors text-sm md:text-base">
        {label}
      </span>
    </a>
  )
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}
