import mongoose, { Schema } from 'mongoose'

export const PROFILE_DOCUMENT_ID = process.env.PROFILE_DOCUMENT_ID!

// --- sub-schemas ---

const socialLinkSchema = new Schema(
  { link: { type: String, default: '' }, icon: { type: String, default: '' }, name: { type: String, default: '' } },
  { _id: false }
)

const educationSchema = new Schema(
  {
    schoolName: { type: String, default: '' },
    major: { type: String, default: '' },
    start: { type: String, default: '' },
    end: { type: String, default: '' },
  },
  { _id: false }
)

const certificateSchema = new Schema(
  { link: { type: String, default: '' }, name: { type: String, default: '' } },
  { _id: false }
)

const skillGroupSchema = new Schema(
  {
    groupName: { type: String, default: '' },
    tools: [
      {
        name: { type: String, default: '' },
        icon: { type: String, default: '' },
      },
    ],
  },
  { _id: false }
)

const experienceSchema = new Schema(
  {
    company: { type: String, default: '' },
    role: { type: String, default: '' },
    period: { type: String, default: '' },
    summary: { type: String, default: '' },
    coverPhoto: { type: String, default: '' },
    // Case-study mode (detailed)
    problem: { type: String, default: '' },
    strategy: { type: String, default: '' },
    execution: { type: [String], default: [] },
    result: { type: [String], default: [] },
    metrics: { type: String, default: '' },
    // Simple mode (highlights only)
    highlights: { type: [String], default: [] },
  },
  { _id: false }
)

// --- main profile schema ---

const profileSchema = new Schema(
  {
    _id: { type: String, default: PROFILE_DOCUMENT_ID },
    // Basics
    cv: { type: String, default: '' },
    fullName: { type: String, default: '' },
    username: { type: String, default: '' },
    avatar: { type: String, default: '' },
    socials: { type: [socialLinkSchema], default: [] },
    // Hero section
    tagline: { type: String, default: '' },
    heroPhotoLeft: { type: String, default: '' },
    heroPhotoRight: { type: String, default: '' },
    // Introduction section
    introduction: { type: String, default: '' },
    introPhoto: { type: String, default: '' },
    // Education section
    education: { type: [educationSchema], default: [] },
    certificates: { type: [certificateSchema], default: [] },
    // Skills section
    skillGroups: { type: [skillGroupSchema], default: [] },
    // Experience section
    experiences: { type: [experienceSchema], default: [] },
    // Contact section
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    // Timestamps
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { collection: 'profile', versionKey: false }
)

if (process.env.NODE_ENV !== 'production' && mongoose.models.Profile) {
  delete mongoose.models.Profile
}

export const ProfileModel = mongoose.model('Profile', profileSchema)
