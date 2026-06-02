'use client';

import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import dynamic from 'next/dynamic';

const AudioPlayerWidget = dynamic(() => import('../components/audio-player-widget'), { ssr: false });

export default function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme} defaultMode="system">
        <CssBaseline />
        <AudioPlayerWidget />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
