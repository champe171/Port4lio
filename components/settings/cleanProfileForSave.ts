import type {
  Certificate,
  EducationItem,
  ExperienceItem,
  Profile,
  SkillGroup,
  SocialLink,
  ToolItem,
} from '@/types/profile'

function trimOrEmpty(value: string | undefined): string {
  return String(value ?? '').trim()
}

function isBlank(value: string | undefined): boolean {
  return trimOrEmpty(value) === ''
}

function pruneSocials(socials: SocialLink[]): SocialLink[] {
  return socials
    .map(s => ({ name: trimOrEmpty(s.name), icon: trimOrEmpty(s.icon), link: trimOrEmpty(s.link) }))
    .filter(s => !isBlank(s.name) || !isBlank(s.icon) || !isBlank(s.link))
}

function pruneEducation(education: EducationItem[]): EducationItem[] {
  return education
    .map(item => ({
      schoolName: trimOrEmpty(item.schoolName),
      major: trimOrEmpty(item.major),
      start: trimOrEmpty(item.start),
      end: trimOrEmpty(item.end),
    }))
    .filter(item => !isBlank(item.schoolName) || !isBlank(item.major))
}

function pruneCertificates(certificates: Certificate[]): Certificate[] {
  return certificates
    .map(c => ({ name: trimOrEmpty(c.name), link: trimOrEmpty(c.link) }))
    .filter(c => !isBlank(c.name))
}

function pruneSkillGroups(groups: SkillGroup[]): SkillGroup[] {
  return groups
    .map(g => ({
      groupName: trimOrEmpty(g.groupName),
      tools: (g.tools as Array<ToolItem | string>)
        .map(t =>
          typeof t === 'string'
            ? { name: trimOrEmpty(t), icon: '' }
            : { name: trimOrEmpty(t.name), icon: trimOrEmpty(t.icon) },
        )
        .filter(t => t.name.trim()),
    }))
    .filter(g => !isBlank(g.groupName) || g.tools.length > 0)
}

function pruneExperiences(experiences: ExperienceItem[]): ExperienceItem[] {
  return experiences
    .map(exp => ({
      company: trimOrEmpty(exp.company),
      role: trimOrEmpty(exp.role),
      period: trimOrEmpty(exp.period),
      summary: trimOrEmpty(exp.summary),
      coverPhoto: trimOrEmpty(exp.coverPhoto),
      problem: trimOrEmpty(exp.problem),
      strategy: trimOrEmpty(exp.strategy),
      execution: (exp.execution ?? []).map(s => trimOrEmpty(s)).filter(Boolean),
      result: (exp.result ?? []).map(s => trimOrEmpty(s)).filter(Boolean),
      metrics: trimOrEmpty(exp.metrics),
      highlights: (exp.highlights ?? []).map(s => trimOrEmpty(s)).filter(Boolean),
    }))
    .filter(exp => !isBlank(exp.company) || !isBlank(exp.role))
}

export function cleanProfileForSave(profile: Profile): Partial<Profile> {
  const cleaned: Partial<Profile> = {
    ...profile,
    fullName: trimOrEmpty(profile.fullName),
    username: trimOrEmpty(profile.username),
    avatar: trimOrEmpty(profile.avatar),
    tagline: trimOrEmpty(profile.tagline),
    heroPhotoLeft: trimOrEmpty(profile.heroPhotoLeft),
    heroPhotoRight: trimOrEmpty(profile.heroPhotoRight),
    introduction: trimOrEmpty(profile.introduction),
    introPhoto: trimOrEmpty(profile.introPhoto),
    phone: trimOrEmpty(profile.phone),
    email: trimOrEmpty(profile.email),
    linkedinUrl: trimOrEmpty(profile.linkedinUrl),
    socials: pruneSocials(profile.socials ?? []),
    education: pruneEducation(profile.education ?? []),
    certificates: pruneCertificates(profile.certificates ?? []),
    skillGroups: pruneSkillGroups(profile.skillGroups ?? []),
    experiences: pruneExperiences(profile.experiences ?? []),
  }

  if (!cleaned.socials?.length) delete cleaned.socials
  if (!cleaned.education?.length) delete cleaned.education
  if (!cleaned.certificates?.length) delete cleaned.certificates
  if (!cleaned.skillGroups?.length) delete cleaned.skillGroups
  if (!cleaned.experiences?.length) delete cleaned.experiences

  return cleaned
}
