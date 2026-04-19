import AppProvider from '@/context/AppContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import type { ReactNode } from 'react'

function App({ Component, pageProps }: AppProps & { Component: { getLayout?: (page: ReactNode) => ReactNode } }) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page)
  return (
    <AppProvider>
      {getLayout(<Component {...pageProps} />)}
    </AppProvider>
  )
}

export default App
