import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { fadeUp, clipReveal, slideLeft, slideRight } from '@/utils/variants'

type VariantName = 'fadeUp' | 'clipReveal' | 'slideLeft' | 'slideRight'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
  variant?: VariantName
  // clipReveal needs overflow-hidden on the wrapper, not the motion div
  // Set to true when the parent already handles overflow-hidden
  noOverflow?: boolean
}

const VARIANT_MAP = { fadeUp, clipReveal, slideLeft, slideRight }

export default function SectionWrapper({
  children,
  className = '',
  delay = 0,
  variant = 'fadeUp',
  noOverflow = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-72px 0px' })

  const base = VARIANT_MAP[variant]

  const variants = {
    hidden: base.hidden,
    visible: {
      ...(base.visible as object),
      transition: {
        ...((base.visible as any).transition ?? {}),
        delay,
      },
    },
  }

  if (variant === 'clipReveal' && !noOverflow) {
    return (
      <div ref={ref} className={`overflow-hidden ${className}`}>
        <motion.div
          variants={variants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="will-change-transform"
        >
          {children}
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  )
}
