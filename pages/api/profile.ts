import type { NextApiRequest, NextApiResponse } from 'next'

import { connectDatabase } from '@/lib/mongodb'
import { MAX_PROFILE_JSON_BYTES } from '@/lib/upload-limits'
import { PROFILE_DOCUMENT_ID, ProfileModel } from '@/models/Profile'
import { sendMail } from '@/lib/mailer'
import { requireOwnerAuth } from '@/lib/auth'
import type { Profile } from '@/types/profile'

type ProfileResponse =
  | { profile: Record<string, unknown> | null }
  | { ok: true; profile: Record<string, unknown> }
  | { error: string }

function toClientProfile(doc: Record<string, unknown>) {
  const { _id, createdAt, updatedAt, ...profile } = doc
  return profile
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ProfileResponse>) {
  try {
    await connectDatabase()

    if (req.method === 'GET') {
      const doc = await ProfileModel.findById(PROFILE_DOCUMENT_ID).lean()
      if (!doc) {
        return res.status(200).json({ profile: null })
      }
      return res.status(200).json({
        profile: toClientProfile(doc as Record<string, unknown>),
      })
    }

    if (req.method === 'POST') {
      if (!requireOwnerAuth(req, res)) return

      const contentType = req.headers['content-type'] ?? ''
      if (!contentType.includes('application/json')) {
        return res.status(415).json({ error: 'Expected Content-Type: application/json' })
      }

      const raw = JSON.stringify(req.body ?? {})
      const byteLength = new TextEncoder().encode(raw).length
      if (byteLength > MAX_PROFILE_JSON_BYTES) {
        return res
          .status(413)
          .json({ error: `Profile JSON exceeds ${MAX_PROFILE_JSON_BYTES / (1024 * 1024)} MB` })
      }

      const parsed = req.body as Profile

      const now = new Date()
      const updatedDoc = await ProfileModel.findOneAndUpdate(
        { _id: PROFILE_DOCUMENT_ID },
        {
          $set: {
            ...parsed,
            updatedAt: now,
          },
          $setOnInsert: {
            _id: PROFILE_DOCUMENT_ID,
            createdAt: now,
          },
        },
        { upsert: true, new: true, lean: true, runValidators: true }
      )

      if (!updatedDoc) {
        return res.status(500).json({ error: 'Failed to load updated profile' })
      }

      // Trigger ISR revalidation — fire and forget, non-fatal
      try {
        await res.revalidate('/')
      } catch (revalError) {
        console.warn('ISR revalidation failed:', revalError)
      }

      const summary = `Updated profile: ${parsed.fullName || parsed.username || '-'} at ${now.toISOString()}`
      try {
        await sendMail(
          process.env.MAIL_TO!,
          'Portfolio Updated',
          `
            <div>
              <h1>Portfolio Updated</h1>
              <p>Summary: ${summary}</p>
            </div>
          `
        )
      } catch {
        // Ignore mail failures
      }

      return res.status(200).json({
        ok: true,
        profile: toClientProfile(updatedDoc as Record<string, unknown>),
      })
    }

    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown server error'
    return res.status(500).json({ error: message })
  }
}
