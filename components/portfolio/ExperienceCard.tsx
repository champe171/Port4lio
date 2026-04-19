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
