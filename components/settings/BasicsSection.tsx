import React from 'react'

import type { Profile } from '@/types/profile'
import { MAX_UPLOAD_BYTES } from '@/lib/upload-limits'
import Section from '@/components/settings/Section'
import type { UploadingState } from '@/components/settings/types'
import Spinner from '@/components/settings/Spinner'
import {
  MAX_UPLOAD_MB_LABEL,
  inputCls,
  labelCls,
  uploadAssetToCloudinary,
} from '@/components/settings/settings-utils'

export default function BasicsSection({
  profile,
  setProfile,
  uploading,
  setUploading,
  setError,
}: {
  profile: Profile
  setProfile: React.Dispatch<React.SetStateAction<Profile>>
  uploading: UploadingState
  setUploading: React.Dispatch<React.SetStateAction<UploadingState>>
  setError: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const fileInputCls = `${inputCls} file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-2.5 file:py-1.5 file:text-xs file:font-medium file:text-zinc-200 hover:file:bg-zinc-700`

  return (
    <Section title='Basics' badge='name, avatar, CV' defaultOpen>
      <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
        <div className='space-y-2'>
          <label className={labelCls}>Full name</label>
          <input
            className={inputCls}
            value={profile.fullName}
            onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))}
            placeholder='Your full name'
          />
        </div>

        <div className='space-y-2'>
          <label className={labelCls}>Username</label>
          <input
            className={inputCls}
            value={profile.username}
            onChange={e => setProfile(p => ({ ...p, username: e.target.value }))}
            placeholder='Your name/handle'
          />
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between gap-3'>
            <label className={labelCls}>CV (File)</label>
            {uploading.cv ? <Spinner className='text-zinc-300' /> : null}
          </div>
          <p className='text-xs text-zinc-400'>
            Max {MAX_UPLOAD_MB_LABEL} MB. Uploaded to Cloudinary; Save stores the URL only.
          </p>
          <input
            type='file'
            accept='application/pdf,.pdf,.doc,.docx'
            disabled={uploading.cv}
            className={fileInputCls}
            onChange={async e => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (!file) return
              if (file.size > MAX_UPLOAD_BYTES) {
                setError(`File must be ${MAX_UPLOAD_MB_LABEL} MB or smaller`)
                return
              }
              setError(null)
              setUploading(u => ({ ...u, cv: true }))
              try {
                const url = await uploadAssetToCloudinary(file, 'cv')
                setProfile(p => ({ ...p, cv: url }))
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Upload failed')
              } finally {
                setUploading(u => ({ ...u, cv: false }))
              }
            }}
          />
          {uploading.cv ? <p className='text-xs text-zinc-400'>Uploading...</p> : null}
          {profile.cv ? (
            <a className='text-xs text-cyan-300 underline underline-offset-2' href={profile.cv} target='_blank' rel='noreferrer'>
              Current CV
            </a>
          ) : null}
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between gap-3'>
            <label className={labelCls}>Avatar</label>
            {uploading.avatar ? <Spinner className='text-zinc-300' /> : null}
          </div>
          <p className='text-xs text-zinc-400'>Max {MAX_UPLOAD_MB_LABEL} MB. Uploads immediately.</p>
          <input
            type='file'
            accept='image/*'
            disabled={uploading.avatar}
            className={fileInputCls}
            onChange={async e => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (!file) return
              if (file.size > MAX_UPLOAD_BYTES) {
                setError(`Image must be ${MAX_UPLOAD_MB_LABEL} MB or smaller`)
                return
              }
              setError(null)
              setUploading(u => ({ ...u, avatar: true }))
              try {
                const url = await uploadAssetToCloudinary(file, 'avatar')
                setProfile(p => ({ ...p, avatar: url }))
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Upload failed')
              } finally {
                setUploading(u => ({ ...u, avatar: false }))
              }
            }}
          />
          {uploading.avatar ? <p className='text-xs text-zinc-400'>Uploading...</p> : null}
          {profile.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar} alt='Avatar preview' className='h-24 w-24 rounded-full object-cover' />
          ) : (
            <div className='text-xs text-zinc-500'>Optional</div>
          )}
        </div>
      </div>
    </Section>
  )
}
