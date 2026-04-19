# CHUNK-V2-01 — Schema & Type Changes

## Files to edit
- `types/profile.ts`
- `models/Profile.ts`
- `components/settings/cleanProfileForSave.ts`

---

## 1. `types/profile.ts` — full replacement

Replace the entire file with:

```typescript
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
  icon?: string  // e.g. "react", "figma", "nextjs" — used as devicon class
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
  coverPhoto?: string  // Cloudinary URL — shown on experience overview slide
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
  introPhoto?: string  // Cloudinary URL — shown in Introduction section left column
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
```

---

## 2. `models/Profile.ts` — add new fields to Mongoose schema

Locate the existing schema definition. Make these targeted additions:

### In the `skillGroups` subdocument, change `tools` from `[String]` to an array of objects:
```typescript
tools: [
  {
    name: { type: String, default: '' },
    icon: { type: String, default: '' },
  }
]
```

### In the `experiences` subdocument, add `coverPhoto`:
```typescript
coverPhoto: { type: String, default: '' },
```

### At the top-level schema, add `introPhoto`:
```typescript
introPhoto: { type: String, default: '' },
```

---

## 3. `components/settings/cleanProfileForSave.ts` — update `pruneSkillGroups`

The `pruneSkillGroups` function currently filters out groups where all tools are empty strings. Update it to handle `ToolItem[]`:

Find the pruneSkillGroups function and replace the tools filtering line:

**Before (current):**
```typescript
const tools = group.tools.filter(t => t.trim())
```

**After:**
```typescript
const tools = (group.tools as Array<ToolItem | string>).map(t =>
  typeof t === 'string' ? { name: t, icon: '' } : t
).filter(t => t.name.trim())
```

Also add the import at the top of `cleanProfileForSave.ts`:
```typescript
import type { ToolItem } from '@/types/profile'
```

---

## 4. Backward compat note

Old documents in MongoDB have `tools: string[]`. When `Profile` is loaded from DB, Mongoose will return old string values as `{ name: '', icon: '' }` for new docs, but old docs still have strings. The `toClientProfile()` function in `pages/index.tsx` should normalize this. Add this normalization in `toClientProfile`:

In `pages/index.tsx`, find `toClientProfile` and add normalization for skillGroups:
```typescript
// Normalize legacy tools (string[]) to ToolItem[]
skillGroups: (raw.skillGroups || []).map((g: any) => ({
  groupName: g.groupName || '',
  tools: (g.tools || []).map((t: any) =>
    typeof t === 'string' ? { name: t, icon: '' } : { name: t.name || '', icon: t.icon || '' }
  ),
})),
```

Replace the existing `skillGroups` line in `toClientProfile` with the above.

---

## Verification

After implementing:
- `types/profile.ts` should have `ToolItem` type exported, `SkillGroup.tools: ToolItem[]`, `ExperienceItem.coverPhoto?: string`, `Profile.introPhoto?: string`
- `models/Profile.ts` should have matching Mongoose schema fields
- `cleanProfileForSave.ts` should import `ToolItem` and handle string-to-ToolItem coercion
- `pages/index.tsx` toClientProfile normalizes legacy string tools

Run `npx tsc --noEmit` — should pass with 0 errors.
