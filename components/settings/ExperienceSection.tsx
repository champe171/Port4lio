import ImageUploadSlot from './ImageUploadSlot'
import { inputCls, textareaCls, labelCls, Section, primaryBtnCls, ghostBtnCls } from './settings-utils'
import type { Profile, ExperienceItem } from '@/types/profile'
import type { UploadingState } from './types'

interface Props {
  profile: Profile
  onChange: (updates: Partial<Profile>) => void
  onUpload: (index: number, field: 'coverPhoto', file: File) => void
  uploading: UploadingState
}

function emptyExp(): ExperienceItem {
  return {
    company: '', role: '', period: '', summary: '',
    problem: '', strategy: '',
    execution: [], result: [], metrics: '', highlights: [],
  }
}

function updateBullets(raw: string): string[] {
  return raw.split('\n').map(s => s.trim()).filter(Boolean)
}

export default function ExperienceSection({ profile, onChange, onUpload, uploading }: Props) {
  const experiences = profile.experiences ?? []

  const update = (i: number, patch: Partial<ExperienceItem>) => {
    const next = experiences.map((e, idx) => (idx === i ? { ...e, ...patch } : e))
    onChange({ experiences: next })
  }

  const addExp = () => onChange({ experiences: [...experiences, emptyExp()] })
  const removeExp = (i: number) =>
    onChange({ experiences: experiences.filter((_, idx) => idx !== i) })

  return (
    <Section title="Experience">
      <div className="flex flex-col gap-8">
        {experiences.map((exp, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={labelCls}>
                Company
                <input className={inputCls} value={exp.company} onChange={e => update(i, { company: e.target.value })} />
              </label>
              <label className={labelCls}>
                Role
                <input className={inputCls} value={exp.role} onChange={e => update(i, { role: e.target.value })} />
              </label>
              <label className={labelCls}>
                Period
                <input className={inputCls} value={exp.period} onChange={e => update(i, { period: e.target.value })} placeholder="Jan 2023 — Present" />
              </label>
            </div>

            <div>
              <p className={labelCls}>Cover Photo (shown on Experience overview slide)</p>
              <ImageUploadSlot
                current={exp.coverPhoto}
                isUploading={!!uploading.expCoverUploading[i]}
                onSelect={file => onUpload(i, 'coverPhoto', file)}
                placeholder="Cover photo"
              />
            </div>

            <label className={labelCls}>
              Summary
              <textarea className={textareaCls} rows={3} value={exp.summary} onChange={e => update(i, { summary: e.target.value })} />
            </label>

            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-2">
              Case Study Mode (fill Problem to enable)
            </p>

            <label className={labelCls}>
              Problem
              <textarea className={textareaCls} rows={2} value={exp.problem} onChange={e => update(i, { problem: e.target.value })} placeholder="Leave empty for highlights-only mode" />
            </label>
            <label className={labelCls}>
              Strategy
              <textarea className={textareaCls} rows={2} value={exp.strategy} onChange={e => update(i, { strategy: e.target.value })} />
            </label>
            <label className={labelCls}>
              Execution (one bullet per line)
              <textarea className={textareaCls} rows={4} value={exp.execution.join('\n')} onChange={e => update(i, { execution: updateBullets(e.target.value) })} />
            </label>
            <label className={labelCls}>
              Results (one bullet per line)
              <textarea className={textareaCls} rows={3} value={exp.result.join('\n')} onChange={e => update(i, { result: updateBullets(e.target.value) })} />
            </label>
            <label className={labelCls}>
              Highlights (one bullet per line — used when Problem is empty)
              <textarea className={textareaCls} rows={3} value={exp.highlights.join('\n')} onChange={e => update(i, { highlights: updateBullets(e.target.value) })} />
            </label>
            <label className={labelCls}>
              Metrics (displayed in a results block)
              <input className={inputCls} value={exp.metrics} onChange={e => update(i, { metrics: e.target.value })} placeholder="ROAS 11.9 | CTR 30.5% | Conversion 4.8%" />
            </label>

            <button className={ghostBtnCls} onClick={() => removeExp(i)}>
              Remove experience
            </button>
          </div>
        ))}
      </div>
      <button className={`${primaryBtnCls} mt-4`} onClick={addExp}>
        + Add experience
      </button>
    </Section>
  )
}
