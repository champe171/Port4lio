import Nav from '@/components/Nav'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PortfolioLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-portfolio-cream text-portfolio-black">
      <Nav />
      <main>{children}</main>
    </div>
  )
}
