import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Profile } from '@/types/profile'
import { staggerContainer, wordSlide, scaleIn, drawLine } from '@/utils/variants'

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
        {/* Name — each word clip-masked, spring reveal */}
        <motion.h1
          className="font-black leading-[0.92] tracking-tight text-portfolio-red"
          style={{ fontSize: 'clamp(3rem, 10vw, 9rem)' }}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {nameParts.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.2em]">
              <motion.span
                className="inline-block will-change-transform"
                variants={wordSlide}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Red accent line draws in after name */}
        <div className="overflow-hidden mt-4 md:mt-6">
          <motion.div
            className="h-[3px] bg-portfolio-red origin-left"
            style={{ width: 'clamp(80px, 15vw, 200px)' }}
            variants={drawLine}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Tagline + photos row */}
        <div className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-end gap-8 md:gap-12">
          {/* Tagline — asterisk inline before text */}
          <motion.div
            className="flex-1 flex items-start gap-3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              className="asterisk shrink-0 mt-1"
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.8 }}
            >
              *
            </motion.span>
            <p className="text-lg md:text-xl text-portfolio-gray leading-relaxed max-w-md">
              {profile.tagline || 'Turning ideas into action.'}
            </p>
          </motion.div>

          {/* Hero photos — staggered scale+spring entrance */}
          <motion.div
            className="flex items-end gap-4 md:gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.45 } },
            }}
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

const photoVariants = {
  hidden: { opacity: 0, scale: 0.88, y: 28 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 75, damping: 17 },
  },
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
      <motion.div
        variants={photoVariants}
        className={`${className} bg-portfolio-border rounded-portfolio flex items-center justify-center shrink-0`}
        aria-label={alt}
      >
        <span className="text-portfolio-gray text-xs text-center px-2">
          Upload in /setting
        </span>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={photoVariants}
      className={`relative ${className} rounded-portfolio overflow-hidden shrink-0`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 140px, 200px"
        className="object-cover"
        priority
      />
    </motion.div>
  )
}
