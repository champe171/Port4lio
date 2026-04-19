import type {
  Certificate,
  EducationItem,
  ExperienceItem,
  Profile,
  SocialLink,
  SkillGroup,
  ToolItem,
} from '@/types/profile'
import { MAX_UPLOAD_BYTES, formatMaxUploadMb } from '@/lib/upload-limits'
import { resolveIconCode } from '@/utils/iconResolver'

export const MAX_UPLOAD_MB_LABEL = formatMaxUploadMb()

export const labelCls = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-400'
export const inputCls =
  'w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/20'
export const textareaCls =
  'w-full min-h-[88px] rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/20'
export const secondaryBtnCls =
  'rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800'
export const ghostBtnCls =
  'rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800/80'
export const primaryBtnCls =
  'rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60'

export async function uploadAssetToCloudinary(
  file: File,
  kind: 'avatar' | 'cv' | 'hero-left' | 'hero-right' | 'intro-photo' | 'exp-cover',
): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`File must be ${MAX_UPLOAD_MB_LABEL} MB or smaller`)
  }
  const fd = new FormData()
  fd.append('file', file)
  fd.append('kind', kind)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  const data = (await res.json()) as { url?: string; error?: string }
  if (!res.ok) throw new Error(data?.error || 'Upload failed')
  if (!data.url) throw new Error('Upload returned no URL')
  return data.url
}

export function makeEmptyProfile(): Profile {
  return {
    cv: '',
    fullName: '',
    username: '',
    avatar: '',
    socials: [],
    tagline: '',
    heroPhotoLeft: '',
    heroPhotoRight: '',
    introduction: '',
    education: [],
    certificates: [],
    skillGroups: [],
    experiences: [],
    phone: '',
    email: '',
    linkedinUrl: '',
  }
}

export function normalizeProfile(raw: any): Profile {
  const empty = makeEmptyProfile()
  if (!raw || typeof raw !== 'object') return empty
  const profile: Profile = { ...empty, ...raw }

  profile.socials = Array.isArray(raw.socials) ? (raw.socials as any[]) : []
  profile.education = Array.isArray(raw.education) ? (raw.education as EducationItem[]) : []
  profile.certificates = Array.isArray(raw.certificates) ? (raw.certificates as Certificate[]) : []
  profile.skillGroups = Array.isArray(raw.skillGroups) ? (raw.skillGroups as SkillGroup[]) : []
  profile.experiences = Array.isArray(raw.experiences) ? (raw.experiences as ExperienceItem[]) : []

  profile.fullName = String(profile.fullName ?? '')
  profile.username = String(profile.username ?? '')
  profile.tagline = String(profile.tagline ?? '')
  profile.heroPhotoLeft = String(profile.heroPhotoLeft ?? '')
  profile.heroPhotoRight = String(profile.heroPhotoRight ?? '')
  profile.introduction = String(profile.introduction ?? '')
  profile.phone = String(profile.phone ?? '')
  profile.email = String(profile.email ?? '')
  profile.linkedinUrl = String(profile.linkedinUrl ?? '')
  profile.avatar = profile.avatar ? String(profile.avatar) : ''
  profile.cv = profile.cv ? String(profile.cv) : ''

  profile.socials = profile.socials.map(s => {
    const name = String((s as any)?.name ?? '')
    const link = String((s as any)?.link ?? '')
    const rawIcon = String((s as any)?.icon ?? '')
    const rawType = String((s as any)?.type ?? '')
    const icon = rawIcon || resolveIconCode(rawType) || rawType || ''
    return { name, link, icon }
  })

  profile.skillGroups = profile.skillGroups.map(g => ({
    groupName: String(g.groupName ?? ''),
    tools: Array.isArray(g.tools)
      ? (g.tools as Array<ToolItem | string>).map((t): ToolItem => {
          if (typeof t === 'string') return { name: String(t ?? '').trim(), icon: '' }
          return {
            name: String((t as ToolItem)?.name ?? '').trim(),
            icon: (t as ToolItem)?.icon ? String((t as ToolItem).icon) : undefined,
          }
        }).filter(t => t.name)
      : [],
  }))

  profile.experiences = profile.experiences.map(exp => ({
    company: String((exp as any).company ?? ''),
    role: String((exp as any).role ?? ''),
    period: String((exp as any).period ?? ''),
    summary: String((exp as any).summary ?? ''),
    coverPhoto: (exp as any).coverPhoto ? String((exp as any).coverPhoto) : undefined,
    problem: String((exp as any).problem ?? ''),
    strategy: String((exp as any).strategy ?? ''),
    execution: Array.isArray((exp as any).execution) ? (exp as any).execution.map(String) : [],
    result: Array.isArray((exp as any).result) ? (exp as any).result.map(String) : [],
    metrics: String((exp as any).metrics ?? ''),
    highlights: Array.isArray((exp as any).highlights) ? (exp as any).highlights.map(String) : [],
  }))

  return profile
}

// Re-export Section for settings components that import it from here
export { default as Section } from './Section'
