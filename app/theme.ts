'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-mui-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#5F687A',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: '#687082',
        },
        background: {
          default: '#FEF7FF',
          paper: '#FFFFFF',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#94A3B8',
          contrastText: '#0F172A',
        },
        secondary: {
          main: '#64748B',
        },
        background: {
          default: '#141218',
          paper: '#1D1B20',
        },
      },
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'var(--font-roboto), Roboto, sans-serif',
  },
});

export default theme;
