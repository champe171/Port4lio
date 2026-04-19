'use client'

import React, { useEffect, useMemo, useState } from 'react'

import type { Profile } from '@/types/profile'
import { MAX_PROFILE_JSON_BYTES } from '@/lib/upload-limits'
import { getIconCatalog } from '@/utils/iconResolver'
import { useApp } from '@/context/AppContext'
import IconPickerModal from '@/components/settings/IconPickerModal'
import SkillsSection from '@/components/settings/SkillsSection'
import SettingLoading from '@/components/settings/SettingLoading'
import SettingToolbar from '@/components/settings/SettingToolbar'
import SettingErrorBanner from '@/components/settings/SettingErrorBanner'
import BasicsSection from '@/components/settings/BasicsSection'
import SocialsSection from '@/components/settings/SocialsSection'
import HeroSection from '@/components/settings/HeroSection'
import IntroSection from '@/components/settings/IntroSection'
import ExperienceSection from '@/components/settings/ExperienceSection'
import EducationSection from '@/components/settings/EducationSection'
import CertificatesSection from '@/components/settings/CertificatesSection'
import ContactSection from '@/components/settings/ContactSection'
import OwnerAuthGate from '@/components/settings/OwnerAuthGate'
import AdminLayout from '@/components/layouts/AdminLayout'
import {
  makeEmptyProfile,
  normalizeProfile,
  uploadAssetToCloudinary,
} from '@/components/settings/settings-utils'
import type { IconPickerTarget, UploadingState } from '@/components/settings/types'
import { cleanProfileForSave } from '@/components/settings/cleanProfileForSave'
import type { ReactNode } from 'react'

function Setting() {
  const { profile: appProfile, setProfile: setAppProfile } = useApp()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile>(() => makeEmptyProfile())
  const [iconPickerTarget, setIconPickerTarget] = useState<IconPickerTarget>(null)
  const [iconQuery, setIconQuery] = useState('')

  const [uploading, setUploading] = useState<UploadingState>({
    avatar: false,
    cv: false,
    heroLeft: false,
    heroRight: false,
    introPhoto: false,
    expCoverUploading: {},
  })

  useEffect(() => {
    if (!appProfile) return
    setProfile(normalizeProfile(appProfile))
    setLoading(false)
  }, [appProfile])

  useEffect(() => {
    setLoading(appProfile == null)
  }, [appProfile])

  const iconCatalog = useMemo(() => getIconCatalog(), [])
  const filteredIcons = useMemo(() => {
    const q = iconQuery.trim().toLowerCase()
    if (!q) return iconCatalog
    return iconCatalog.filter(
      item => item.code.toLowerCase().includes(q) || item.name.toLowerCase().includes(q)
    )
  }, [iconCatalog, iconQuery])

  async function onSave() {
    setSaving(true)
    setError(null)
    try {
      const body = cleanProfileForSave(profile)

      const json = JSON.stringify(body)
      if (new TextEncoder().encode(json).length > MAX_PROFILE_JSON_BYTES) {
        throw new Error(`Profile data exceeds ${MAX_PROFILE_JSON_BYTES / (1024 * 1024)} MB`)
      }

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to save profile')
      if (data?.profile) {
        const next = normalizeProfile(data.profile)
        setAppProfile(next)
        setProfile(next)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (
    file: File,
    kind: 'avatar' | 'cv' | 'hero-left' | 'hero-right' | 'intro-photo' | 'exp-cover',
    expIndex?: number,
  ) => {
    const setBusy = (busy: boolean) => {
      setUploading(prev => {
        if (kind === 'exp-cover' && typeof expIndex === 'number') {
          const next = { ...prev.expCoverUploading }
          if (busy) next[expIndex] = true
          else delete next[expIndex]
          return { ...prev, expCoverUploading: next }
        }
        if (kind === 'intro-photo') {
          return { ...prev, introPhoto: busy }
        }
        const uploadKey =
          kind === 'hero-left' ? 'heroLeft' : kind === 'hero-right' ? 'heroRight' : kind
        return { ...prev, [uploadKey]: busy }
      })
    }

    setBusy(true)
    try {
      const url = await uploadAssetToCloudinary(file, kind)
      if (kind === 'intro-photo') {
        setProfile(p => ({ ...p, introPhoto: url }))
      } else if (kind === 'exp-cover' && typeof expIndex === 'number') {
        setProfile(p => {
          const exps = [...(p.experiences ?? [])]
          const cur = exps[expIndex]
          if (!cur) return p
          exps[expIndex] = { ...cur, coverPhoto: url }
          return { ...p, experiences: exps }
        })
      } else {
        const fieldMap: Record<'avatar' | 'cv' | 'hero-left' | 'hero-right', keyof Profile> = {
          avatar: 'avatar',
          cv: 'cv',
          'hero-left': 'heroPhotoLeft',
          'hero-right': 'heroPhotoRight',
        }
        setProfile(prev => ({ ...prev, [fieldMap[kind as keyof typeof fieldMap]]: url }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  const applyIconCode = (iconCode: string) => {
    if (!iconPickerTarget) return

    if (iconPickerTarget.kind === 'social') {
      setProfile(p => {
        const next = [...p.socials]
        const cur = next[iconPickerTarget.socialIndex]
        if (!cur) return p
        next[iconPickerTarget.socialIndex] = { ...cur, icon: iconCode }
        return { ...p, socials: next }
      })
    }

    setIconPickerTarget(null)
    setIconQuery('')
  }

  const onChange = (updates: Partial<Profile>) => {
    setProfile(p => ({ ...p, ...updates }))
  }

  if (loading) return <SettingLoading />

  return (
    <OwnerAuthGate>
      <div className='z-50 relative min-h-screen bg-zinc-950/50 text-zinc-100 pt-12'>
        <div className='mx-auto max-w-6xl px-4 py-10'>
          <SettingToolbar
            saving={saving}
            uploading={uploading}
            onSave={onSave}
          />

          <SettingErrorBanner message={error} />

          <div className='space-y-6'>
            <BasicsSection
              profile={profile}
              setProfile={setProfile}
              uploading={uploading}
              setUploading={setUploading}
              setError={setError}
            />
            <SocialsSection
              profile={profile}
              setProfile={setProfile}
              setIconPickerTarget={setIconPickerTarget}
            />
            <HeroSection
              profile={profile}
              onChange={onChange}
              uploading={uploading}
              onUpload={handleUpload}
            />
            <IntroSection
              profile={profile}
              onChange={onChange}
              onUpload={(field, file) => {
                if (field === 'introPhoto') void handleUpload(file, 'intro-photo')
              }}
              uploading={{ introPhoto: uploading.introPhoto }}
            />
            <EducationSection profile={profile} setProfile={setProfile} />
            <CertificatesSection profile={profile} setProfile={setProfile} />
            <SkillsSection profile={profile} onChange={onChange} />
            <ExperienceSection
              profile={profile}
              onChange={onChange}
              onUpload={(index, field, file) => {
                if (field === 'coverPhoto') void handleUpload(file, 'exp-cover', index)
              }}
              uploading={uploading}
            />
            <ContactSection profile={profile} onChange={onChange} />
          </div>

          <IconPickerModal
            open={!!iconPickerTarget}
            iconQuery={iconQuery}
            onQueryChange={setIconQuery}
            filteredIcons={filteredIcons}
            onSelect={applyIconCode}
            onClose={() => {
              setIconPickerTarget(null)
              setIconQuery('')
            }}
          />
        </div>
      </div>
    </OwnerAuthGate>
  )
}

Setting.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>

export default Setting
