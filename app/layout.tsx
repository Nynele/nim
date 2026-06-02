import type { Metadata, Viewport } from 'next'
import './globals.css'
import MuiThemeProvider from './theme-provider'
import { LanguageProvider } from './language-context'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { Roboto } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'

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
      <body className={`${roboto.className} ${roboto.variable}`} suppressHydrationWarning>
        <InitColorSchemeScript attribute="data-mui-color-scheme" defaultMode="system" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Debug overlay for errors
              window.addEventListener('error', (event) => {
                const el = document.createElement('div');
                el.style.position = 'fixed';
                el.style.bottom = '10px';
                el.style.left = '10px';
                el.style.background = 'rgba(255, 0, 0, 0.9)';
                el.style.color = 'white';
                el.style.padding = '10px';
                el.style.zIndex = '99999';
                el.style.fontSize = '12px';
                el.style.fontFamily = 'monospace';
                el.style.maxHeight = '200px';
                el.style.overflow = 'auto';
                el.innerText = 'ERROR: ' + event.message + '\\nSource: ' + event.filename + ':' + event.lineno;
                document.body.appendChild(el);
              });
              
              window.addEventListener('unhandledrejection', (event) => {
                const el = document.createElement('div');
                el.style.position = 'fixed';
                el.style.bottom = '10px';
                el.style.left = '10px';
                el.style.background = 'rgba(255, 0, 0, 0.9)';
                el.style.color = 'white';
                el.style.padding = '10px';
                el.style.zIndex = '99999';
                el.style.fontSize = '12px';
                el.style.fontFamily = 'monospace';
                el.innerText = 'PROMISE REJECTION: ' + event.reason;
                document.body.appendChild(el);
              });
            `
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Block right click
              document.addEventListener('contextmenu', (e) => e.preventDefault());

              // Block selectstart event except for input elements
              document.addEventListener('selectstart', (e) => {
                const target = e.target;
                if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target.isContentEditable || (target.getAttribute && target.getAttribute('contenteditable') === 'true')))) {
                  return true;
                }
                e.preventDefault();
              });

              // Block keyboard shortcuts for developer tools and view source
              document.addEventListener('keydown', (e) => {
                // Disable F12
                if (e.key === 'F12') {
                  e.preventDefault();
                  return false;
                }

                // Check key codes (case-insensitive for characters)
                const key = e.key.toLowerCase();

                // Ctrl+Shift+I/J/C/K (Windows/Linux) or Cmd+Opt+I/J/C/K (macOS)
                const isDevToolsCombo = 
                  ((e.ctrlKey && e.shiftKey) || (e.metaKey && e.altKey)) && 
                  (key === 'i' || key === 'j' || key === 'c' || key === 'k');

                // Ctrl+U (Windows/Linux) or Cmd+Opt+U / Cmd+U (macOS)
                const isViewSourceCombo = 
                  ((e.ctrlKey || e.metaKey) && key === 'u') || 
                  (e.metaKey && e.altKey && key === 'u');

                // Ctrl+S / Cmd+S (Save Page)
                const isSavePageCombo = (e.ctrlKey || e.metaKey) && key === 's';

                if (isDevToolsCombo || isViewSourceCombo || isSavePageCombo) {
                  e.preventDefault();
                  return false;
                }
              });
            `
          }}
        />
        <LanguageProvider>
          <MuiThemeProvider>
            <div className="flex min-h-screen w-full flex-col">
              {children}
            </div>
            <Analytics />
          </MuiThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
