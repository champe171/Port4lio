import type { ReactNode } from 'react'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import PortfolioLayout from '@/components/layouts/PortfolioLayout'
import HeroSection from '@/components/portfolio/HeroSection'
import IntroSection from '@/components/portfolio/IntroSection'
import EducationSection from '@/components/portfolio/EducationSection'
import SkillsSection from '@/components/portfolio/SkillsSection'
import ExperienceSection from '@/components/portfolio/ExperienceSection'
import ContactSection from '@/components/portfolio/ContactSection'
import { connectDatabase } from '@/lib/mongodb'
import { ProfileModel, PROFILE_DOCUMENT_ID } from '@/models/Profile'
import type { Profile } from '@/types/profile'

function toClientProfile(doc: Record<string, unknown>): Profile {
  const { _id, __v, createdAt, updatedAt, ...rest } = doc
  const raw = rest as Record<string, unknown>
  const skillGroupsRaw = raw.skillGroups
  const skillGroupsList = Array.isArray(skillGroupsRaw) ? skillGroupsRaw : []
  return {
    ...raw,
    // Normalize legacy tools (string[]) to ToolItem[]
    skillGroups: skillGroupsList.map((g: any) => ({
      groupName: g.groupName || '',
      tools: (g.tools || []).map((t: any) =>
        typeof t === 'string' ? { name: t, icon: '' } : { name: t.name || '', icon: t.icon || '' },
      ),
    })),
  } as Profile
}

export const getStaticProps: GetStaticProps<{ profile: Profile | null }> = async () => {
  try {
    await connectDatabase()
    const doc = await ProfileModel.findById(PROFILE_DOCUMENT_ID).lean()
    return {
      props: { profile: doc ? toClientProfile(doc as Record<string, unknown>) : null },
      revalidate: 60,
    }
  } catch (err) {
    console.error('getStaticProps: failed to load profile', err)
    return { props: { profile: null }, revalidate: 30 }
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default function IndexPage({ profile }: Props) {
  if (!profile) {
    return (
      <div className="min-h-screen bg-portfolio-cream flex items-center justify-center">
        <p className="text-portfolio-gray">Profile not found. Configure in /setting.</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{profile.fullName ? `${profile.fullName} | Portfolio` : 'Portfolio'}</title>
      </Head>
      <HeroSection profile={profile} />
      <IntroSection profile={profile} />
      <EducationSection profile={profile} />
      <SkillsSection profile={profile} />
      <ExperienceSection profile={profile} />
      <ContactSection profile={profile} />
    </>
  )
}

IndexPage.getLayout = (page: ReactNode) => (
  <PortfolioLayout>{page}</PortfolioLayout>
)
