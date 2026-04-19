export type SocialLink = {
  link: string
  icon: string
  name: string
}

export type EducationItem = {
  schoolName: string
  major: string
  start: string
  end: string
}

export type Certificate = {
  link: string
  name: string
}

// Each tool now has an optional icon slug (for devicon CDN)
export type ToolItem = {
  name: string
  icon?: string // e.g. "react", "figma", "nextjs" — used as devicon class
}

export type SkillGroup = {
  groupName: string
  tools: ToolItem[]
}

export type ExperienceItem = {
  company: string
  role: string
  period: string
  summary: string
  coverPhoto?: string // Cloudinary URL — shown on experience overview slide
  // Case-study mode
  problem: string
  strategy: string
  execution: string[]
  result: string[]
  metrics: string
  // Simple mode
  highlights: string[]
}

export type Profile = {
  // Basics
  cv?: string
  fullName: string
  username: string
  avatar?: string
  socials: SocialLink[]
  // Hero
  tagline: string
  heroPhotoLeft: string
  heroPhotoRight: string
  // Introduction
  introduction: string
  introPhoto?: string // Cloudinary URL — shown in Introduction section left column
  // Education
  education: EducationItem[]
  certificates: Certificate[]
  // Skills
  skillGroups: SkillGroup[]
  // Experience
  experiences: ExperienceItem[]
  // Contact
  phone: string
  email: string
  linkedinUrl: string
}
