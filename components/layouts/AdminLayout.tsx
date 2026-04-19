import Head from 'next/head'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function AdminLayout({ children }: Props) {
  return (
    <>
      <Head>
        <title>Settings — Portfolio Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {children}
      </div>
    </>
  )
}
