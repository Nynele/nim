import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import MuiThemeProvider from './theme-provider'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { Roboto } from 'next/font/google'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://nim-fawn.vercel.app/'),
  alternates: {
    canonical: '/'
  },
  title: {
    default: 'Nim - Personal website template',
    template: '%s | Nim'
  },
  description:  'Nim is a free and open-source personal website template built with Next.js 15, React 19 and Motion-Primitives.',
};

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.variable}>
        <InitColorSchemeScript attribute="data-mui-color-scheme" defaultMode="system" />
        <MuiThemeProvider>
          <div className="flex min-h-screen w-full flex-col">
            {children}
          </div>
        </MuiThemeProvider>
      </body>
    </html>
  )
}
