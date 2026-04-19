import { inputCls, labelCls, Section } from './settings-utils'
import type { Profile } from '@/types/profile'

interface Props {
  profile: Profile
  onChange: (updates: Partial<Profile>) => void
}

export default function ContactSection({ profile, onChange }: Props) {
  return (
    <Section title="Contact">
      <label className={labelCls}>
        Phone
        <input className={inputCls} value={profile.phone || ''} onChange={e => onChange({ phone: e.target.value })} placeholder="+84 xxx xxx xxx" />
      </label>
      <label className={`${labelCls} mt-4`}>
        Email
        <input type="email" className={inputCls} value={profile.email || ''} onChange={e => onChange({ email: e.target.value })} />
      </label>
      <label className={`${labelCls} mt-4`}>
        LinkedIn URL
        <input type="url" className={inputCls} value={profile.linkedinUrl || ''} onChange={e => onChange({ linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/..." />
      </label>
    </Section>
  )
}
