import React from 'react'

import { primaryBtnCls } from '@/components/settings/settings-utils'
import type { UploadingState } from '@/components/settings/types'

export default function SettingToolbar({
  saving,
  uploading,
  onSave,
}: {
  saving: boolean
  uploading: UploadingState
  onSave: () => void
}) {
  const isUploading =
    uploading.avatar ||
    uploading.cv ||
    uploading.heroLeft ||
    uploading.heroRight ||
    uploading.introPhoto ||
    Object.values(uploading.expCoverUploading).some(Boolean)

  return (
    <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
      <div>
        <div className='flex items-center gap-2'>
          <h1 className='text-2xl font-semibold tracking-tight'>Edit Portfolio Profile</h1>
          <span className='rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200'>
            One page editor
          </span>
        </div>
        <p className='mt-1 text-sm text-zinc-400'>
          Saved changes appear on the site within 60 seconds.
        </p>
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <button
          type='button'
          onClick={onSave}
          disabled={saving || isUploading}
          className={`${primaryBtnCls} min-w-[160px]`}
        >
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </div>
    </div>
  )
}
