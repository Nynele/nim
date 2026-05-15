import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import MuiThemeProvider from './theme-provider'
import { LanguageProvider } from './language-context'
import CustomCursor from './custom-cursor'
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
    default: 'Nynele - Portfolio',
    template: '%s | Nynele'
  },
  description: 'Nynele - Discord Designer & Community Manager. Expertise in server infrastructure, permissions, and community engagement.',
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
        <LanguageProvider>
          <MuiThemeProvider>
            <CustomCursor />
            <div className="flex min-h-screen w-full flex-col">
              {children}
            </div>
          </MuiThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
