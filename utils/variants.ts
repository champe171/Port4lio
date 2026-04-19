import type { Variants } from 'framer-motion'

// Shared easing curve — expo out
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

// Fade up — spring-based, used by SectionWrapper default
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 56 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 70, damping: 18, mass: 0.8 },
  },
}

// Clip reveal — mask-slides-up reveal for headings (needs overflow-hidden parent)
export const clipReveal: Variants = {
  hidden: { y: '105%' },
  visible: {
    y: '0%',
    transition: { type: 'spring', stiffness: 80, damping: 20, mass: 0.9 },
  },
}

// Fade in — pure opacity, no movement
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: EXPO },
  },
}

// Slide in from left
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 70, damping: 18 },
  },
}

// Slide in from right
export const slideRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 70, damping: 18 },
  },
}

// Draw line — scaleX 0→1, needs transformOrigin: 'left'
export const drawLine: Variants = {
  hidden: { scaleX: 0, opacity: 1 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: EXPO },
  },
}

// Stagger container — tight children stagger
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
}

// Stagger container (fast) — for dense lists
export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045, delayChildren: 0 },
  },
}

// Word reveal — clip mask, used in hero (needs overflow-hidden wrapper per word)
export const wordSlide: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { type: 'spring', stiffness: 90, damping: 22, mass: 0.85 },
  },
}

// Stagger item — child of staggerContainer
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 20 },
  },
}

// Scale in — decorative elements (asterisk, badges)
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 18 },
  },
}
