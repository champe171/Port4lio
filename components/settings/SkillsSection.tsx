import { inputCls, labelCls, Section, primaryBtnCls } from './settings-utils'
import type { Profile, SkillGroup, ToolItem } from '@/types/profile'

interface Props {
  profile: Profile
  onChange: (updated: Partial<Profile>) => void
}

function toolsToText(tools: ToolItem[]): string {
  return tools.map(t => (t.icon ? `${t.name} | ${t.icon}` : t.name)).join('\n')
}

function textToTools(text: string): ToolItem[] {
  return text
    .split('\n')
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
    const updated = groups.map((g, i) => (i === index ? { ...g, [field]: value } : g))
    onChange({ skillGroups: updated })
  }

  const addGroup = () => {
    onChange({ skillGroups: [...groups, { groupName: '', tools: [] }] })
  }

  const removeGroup = (index: number) => {
    onChange({ skillGroups: groups.filter((_, i) => i !== index) })
  }

  return (
    <Section title="Skills & Tools">
      <p className="mb-4 text-sm text-zinc-500">
        <strong className="text-zinc-300">MY SKILLS</strong> panel shows group names as a bullet list.
        <br />
        <strong className="text-zinc-300">TOOLS</strong> panel shows tools as icon tiles. Enter one tool per line.
        <br />
        Format:{' '}
        <code className="rounded bg-zinc-800 px-1 text-zinc-200">Tool Name | devicon-slug</code> (icon is optional).
        <br />
        Example: <code className="rounded bg-zinc-800 px-1 text-zinc-200">React | react</code>
      </p>

      <div className="flex flex-col gap-8">
        {groups.map((group, i) => (
          <div key={i} className="flex flex-col gap-4 rounded-xl border border-zinc-700 p-4">
            <div className="flex items-center justify-between">
              <span className="block text-sm font-semibold text-zinc-300">Group {i + 1}</span>
              <button
                type="button"
                onClick={() => removeGroup(i)}
                className="text-xs text-red-400 transition hover:text-red-300"
              >
                Remove
              </button>
            </div>

            <label className={labelCls}>
              Group Name (shown in MY SKILLS list)
              <input
                type="text"
                className={inputCls}
                value={group.groupName}
                onChange={e => updateGroup(i, 'groupName', e.target.value)}
                placeholder="e.g. Frontend Development"
              />
            </label>

            <label className={labelCls}>
              Tools (one per line, format: <code className="text-zinc-400">Name | icon-slug</code>)
              <textarea
                rows={5}
                className="w-full min-h-[100px] rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/20"
                value={toolsToText(group.tools)}
                onChange={e => updateGroup(i, 'tools', textToTools(e.target.value))}
                placeholder={'React | react\nNext.js | nextjs\nTypeScript | typescript\nFigma | figma'}
              />
            </label>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addGroup}
        className={`${primaryBtnCls} mt-4 self-start`}
      >
        + Add Group
      </button>
    </Section>
  )
}
