import { inputCls, labelCls, Section } from './settings-utils'
import type { Profile } from '@/types/profile'
import type { UploadingState } from './types'
import ImageUploadSlot from './ImageUploadSlot'

interface Props {
  profile: Profile
  onChange: (updates: Partial<Profile>) => void
  uploading: UploadingState
  onUpload: (file: File, kind: 'hero-left' | 'hero-right') => Promise<void>
}

export default function HeroSection({ profile, onChange, uploading, onUpload }: Props) {
  return (
    <Section title="Hero">
      <label className={labelCls}>
        Tagline
        <input
          className={inputCls}
          value={profile.tagline || ''}
          onChange={e => onChange({ tagline: e.target.value })}
          placeholder="Turning ideas into action..."
          maxLength={120}
        />
      </label>

      <div className="flex gap-6 flex-wrap mt-4">
        <div>
          <p className={labelCls}>Left Photo</p>
          <ImageUploadSlot
            current={profile.heroPhotoLeft}
            isUploading={uploading.heroLeft}
            onSelect={file => onUpload(file, 'hero-left')}
            placeholder="Upload left photo"
          />
        </div>
        <div>
          <p className={labelCls}>Right Photo</p>
          <ImageUploadSlot
            current={profile.heroPhotoRight}
            isUploading={uploading.heroRight}
            onSelect={file => onUpload(file, 'hero-right')}
            placeholder="Upload right photo"
          />
        </div>
      </div>
    </Section>
  )
}
