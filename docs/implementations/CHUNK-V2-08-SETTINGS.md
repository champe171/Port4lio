# CHUNK-V2-08 — Settings Editor Updates

## Files to edit
- `components/settings/IntroSection.tsx`
- `components/settings/SkillsSection.tsx`
- `components/settings/ExperienceSection.tsx`
- `pages/setting.tsx`
- `pages/api/upload.ts`

---

## 1. `components/settings/IntroSection.tsx` — add introPhoto upload

### Current state
Has a `<textarea>` for `introduction` text only.

### Target
Add an `ImageUploadSlot` for `introPhoto` below the textarea.

Replace the entire file:

```tsx
import { ImageUploadSlot } from './ImageUploadSlot'
import type { Profile } from '@/types/profile'

interface Props {
  profile: Profile
  onChange: (updated: Partial<Profile>) => void
  onUpload: (field: 'introPhoto', file: File) => void
  uploading: { introPhoto?: boolean }
}

export default function IntroSection({ profile, onChange, onUpload, uploading }: Props) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-black text-xl text-gray-900">Introduction</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Introduction Text</label>
        <textarea
          rows={6}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-portfolio-red"
          value={profile.introduction || ''}
          onChange={e => onChange({ introduction: e.target.value })}
          placeholder="Write a brief introduction about yourself..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Introduction Photo</label>
        <p className="text-xs text-gray-500 mb-3">
          Shown on the left side of the Introduction section (red background).
        </p>
        <ImageUploadSlot
          label="Intro Photo"
          currentUrl={profile.introPhoto}
          onFileSelect={file => onUpload('introPhoto', file)}
          uploading={uploading.introPhoto}
        />
      </div>
    </section>
  )
}
```

---

## 2. `components/settings/SkillsSection.tsx` — add icon field per tool

### Current state
Each group has a `groupName` input and a `tools` textarea (comma-separated strings).

### Target
Each group still has `groupName` and `tools` textarea, but each tool now needs a name + optional icon slug. Use a structured textarea with one tool per line in format `name | icon` (icon is optional):

Replace the tools input section. The format `name | icon` means:
- `React | react` → `{ name: 'React', icon: 'react' }`
- `Figma` → `{ name: 'Figma', icon: '' }`

Update the tools parsing/serialization in `SkillsSection.tsx`:

**Serialization** (ToolItem[] → string for textarea):
```typescript
function toolsToText(tools: ToolItem[]): string {
  return tools.map(t => t.icon ? `${t.name} | ${t.icon}` : t.name).join('\n')
}
```

**Parsing** (string → ToolItem[]):
```typescript
function textToTools(text: string): ToolItem[] {
  return text.split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const parts = line.split('|').map(p => p.trim())
      return { name: parts[0] || '', icon: parts[1] || '' }
    })
}
```

Replace the entire `components/settings/SkillsSection.tsx`:

```tsx
import { useState } from 'react'
import type { Profile, SkillGroup, ToolItem } from '@/types/profile'

interface Props {
  profile: Profile
  onChange: (updated: Partial<Profile>) => void
}

function toolsToText(tools: ToolItem[]): string {
  return tools.map(t => t.icon ? `${t.name} | ${t.icon}` : t.name).join('\n')
}

function textToTools(text: string): ToolItem[] {
  return text.split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const parts = line.split('|').map(p => p.trim())
      return { name: parts[0] || '', icon: parts[1] || '' }
    })
}

export default function SkillsSection({ profile, onChange }: Props) {
  const groups: SkillGroup[] = profile.skillGroups || []

  const updateGroup = (index: number, field: keyof SkillGroup, value: string | ToolItem[]) => {
    const updated = groups.map((g, i) =>
      i === index ? { ...g, [field]: value } : g
    )
    onChange({ skillGroups: updated })
  }

  const addGroup = () => {
    onChange({ skillGroups: [...groups, { groupName: '', tools: [] }] })
  }

  const removeGroup = (index: number) => {
    onChange({ skillGroups: groups.filter((_, i) => i !== index) })
  }

  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-black text-xl text-gray-900">Skills & Tools</h2>

      <p className="text-sm text-gray-500">
        <strong>MY SKILLS</strong> panel shows group names as a bullet list.<br />
        <strong>TOOLS</strong> panel shows tools as icon tiles. Enter one tool per line.<br />
        Format: <code className="bg-gray-100 px-1 rounded">Tool Name | devicon-slug</code> (icon is optional).<br />
        Example: <code className="bg-gray-100 px-1 rounded">React | react</code>
      </p>

      <div className="flex flex-col gap-8">
        {groups.map((group, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">Group {i + 1}</label>
              <button
                type="button"
                onClick={() => removeGroup(i)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Group Name (shown in MY SKILLS list)</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-portfolio-red"
                value={group.groupName}
                onChange={e => updateGroup(i, 'groupName', e.target.value)}
                placeholder="e.g. Frontend Development"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Tools (one per line, format: <code>Name | icon-slug</code>)
              </label>
              <textarea
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-portfolio-red"
                value={toolsToText(group.tools)}
                onChange={e => updateGroup(i, 'tools', textToTools(e.target.value))}
                placeholder={"React | react\nNext.js | nextjs\nTypeScript | typescript\nFigma | figma"}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addGroup}
        className="self-start px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        + Add Group
      </button>
    </section>
  )
}
```

---

## 3. `components/settings/ExperienceSection.tsx` — add coverPhoto upload

Add an `ImageUploadSlot` for `coverPhoto` inside each experience entry, below the Period field.

Inside the experience card section, add after the Period input:

```tsx
<div>
  <label className="block text-xs text-gray-500 mb-1">Cover Photo (shown on Experience overview slide)</label>
  <ImageUploadSlot
    label="Cover Photo"
    currentUrl={exp.coverPhoto}
    onFileSelect={file => onUpload(i, 'coverPhoto', file)}
    uploading={uploading[i]?.coverPhoto}
  />
</div>
```

The `onUpload` prop signature for ExperienceSection needs to change to accept an index:
```typescript
onUpload: (index: number, field: 'coverPhoto', file: File) => void
```

And update the `ImageUploadSlot` import if not already present:
```typescript
import { ImageUploadSlot } from './ImageUploadSlot'
```

---

## 4. `pages/setting.tsx` — wire up new upload fields

### Add `introPhoto` to uploading state
Find `UploadingState` usage (or the `uploading` state object). Ensure it includes:
```typescript
introPhoto: boolean
```

### Add handler for `introPhoto` upload
In the `handleUpload` function (or wherever `hero-left`, `hero-right` uploads are handled), add a case for `'intro-photo'`:

```typescript
case 'intro-photo':
  url = await uploadAssetToCloudinary(file, 'intro-photo')
  setProfile(p => ({ ...p, introPhoto: url }))
  break
```

### Pass `onUpload` to `IntroSection`
In the settings form where `<IntroSection>` is rendered, pass:
```tsx
<IntroSection
  profile={profile}
  onChange={handleChange}
  onUpload={(field, file) => handleUpload(field, file)}
  uploading={{ introPhoto: uploading.introPhoto }}
/>
```

### Pass `onUpload` to `ExperienceSection`
Update the `ExperienceSection` call to pass an upload handler that handles `coverPhoto` per experience index. The URL goes into `profile.experiences[index].coverPhoto`.

---

## 5. `pages/api/upload.ts` — allow new kinds

Find `ALLOWED_KINDS` array and add `'intro-photo'` and `'exp-cover'`:

```typescript
const ALLOWED_KINDS = ['avatar', 'cv', 'hero-left', 'hero-right', 'intro-photo', 'exp-cover'] as const
```

Also add the folder routing for new kinds:
```typescript
case 'intro-photo':
  folder = 'portfolio/intro'
  break
case 'exp-cover':
  folder = 'portfolio/experience'
  break
```

---

## 6. `components/settings/cleanProfileForSave.ts` — add pruneExperiencePhotos

The `introPhoto` and `coverPhoto` fields are already strings — no pruning needed. But ensure `pruneExperiences` doesn't strip `coverPhoto`:

Find `pruneExperiences` and confirm the spread includes all fields. If it maps fields explicitly, add `coverPhoto: e.coverPhoto || ''` to the mapped object.

---

## Verification
- `/setting` page compiles without TypeScript errors
- Intro section in settings shows photo upload slot
- Each experience entry in settings shows a cover photo upload slot
- Skills section shows per-line tool entry with icon hint text
- Uploading an intro photo updates `profile.introPhoto`
- Uploading a cover photo updates `profile.experiences[i].coverPhoto`
- Saving the profile persists new fields to MongoDB
