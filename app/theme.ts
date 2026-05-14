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
          main: '#6750A4',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: '#625B71',
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
          main: '#D0BCFF',
          contrastText: '#381E72',
        },
        secondary: {
          main: '#CCC2DC',
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
