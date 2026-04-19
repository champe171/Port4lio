import ImageUploadSlot from './ImageUploadSlot'
import { textareaCls, labelCls, Section } from './settings-utils'
import type { Profile } from '@/types/profile'

interface Props {
  profile: Profile
  onChange: (updated: Partial<Profile>) => void
  onUpload: (field: 'introPhoto', file: File) => void
  uploading: { introPhoto?: boolean }
}

export default function IntroSection({ profile, onChange, onUpload, uploading }: Props) {
  return (
    <Section title="Introduction">
      <label className={labelCls}>
        Introduction Text
        <textarea
          rows={6}
          className={textareaCls}
          value={profile.introduction || ''}
          onChange={e => onChange({ introduction: e.target.value })}
          placeholder="Write a brief introduction about yourself..."
        />
      </label>

      <div className="mt-4">
        <p className={labelCls}>Introduction Photo</p>
        <p className="mb-3 text-xs text-zinc-500">
          Shown on the left side of the Introduction section (red background).
        </p>
        <ImageUploadSlot
          current={profile.introPhoto}
          isUploading={!!uploading.introPhoto}
          onSelect={file => onUpload('introPhoto', file)}
          placeholder="Intro photo"
        />
      </div>
    </Section>
  )
}
