'use client';

import Link from 'next/link';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import { Home as HomeIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import ShaderBackground from './shader-background';
const translations = {
  en: {
    title: 'Page not found',
    subtitle: "The page you are looking for doesn't exist or has been moved. Don't worry, even the best designers get lost sometimes.",
    button: 'Back to Home'
  },
  es: {
    title: 'Página no encontrada',
    subtitle: 'La página que buscas no existe o ha sido movida. No te preocupes, hasta los mejores diseñadores se pierden a veces.',
    button: 'Volver al Inicio'
  },
  it: {
    title: 'Pagina non trovata',
    subtitle: 'La pagina che stai cercando non esiste o è stata spostata. Non preoccuparti, anche i migliori designer si perdono a volte.',
    button: 'Torna alla Home'
  },
  fr: {
    title: 'Page non trouvée',
    subtitle: "La page que vous recherchez n'existe pas ou a été déplacée. Ne vous inquiétez pas, même les meilleurs designers se perdent parfois.",
    button: "Retour à l'accueil"
  },
  de: {
    title: 'Seite nicht gefunden',
    subtitle: 'Die gesuchte Seite existiert nicht oder wurde verschoben. Keine Sorge, selbst die besten Designer verlieren mal den Weg.',
    button: 'Zurück zur Startseite'
  },
  pt: {
    title: 'Página não encontrada',
    subtitle: 'A página que procura não existe ou foi movida. Não se preocupe, até os melhores designers se perdem às vezes.',
    button: 'Voltar ao Início'
  }
};

const languages: ('en' | 'es' | 'it' | 'fr' | 'de' | 'pt')[] = ['en', 'es', 'it', 'fr', 'de', 'pt'];

export default function NotFound() {
  const [localLang, setLocalLang] = useState<'en' | 'es' | 'it' | 'fr' | 'de' | 'pt'>('en');

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalLang((prev) => {
        const nextIndex = (languages.indexOf(prev) + 1) % languages.length;
        return languages[nextIndex];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const t = translations[localLang];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      color: 'text.primary',
      textAlign: 'center',
      px: 2
    }}>
      <ShaderBackground />
      
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
        >
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 900, 
              fontSize: { xs: '6rem', md: '10rem' },
              lineHeight: 1,
              mb: 2,
              background: 'linear-gradient(135deg, var(--mui-palette-primary-main) 0%, var(--mui-palette-secondary-main, #9c27b0) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(var(--mui-palette-primary-mainChannel) / 0.3))',
              letterSpacing: '-0.05em'
            }}
          >
            404
          </Typography>
          
          {/* Only the title and subtitle transition / fade out */}
          <AnimatePresence mode="wait">
            <motion.div
              key={localLang}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 2,
                  letterSpacing: '-0.02em'
                }}
              >
                {t.title}
              </Typography>
              
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mb: 6, 
                  maxWidth: 400, 
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: '1.1rem',
                  minHeight: '80px' // Keep height consistent to prevent layout shift
                }}
              >
                {t.subtitle}
              </Typography>
            </motion.div>
          </AnimatePresence>

          {/* Button container stays completely fixed in place */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'inline-block' }}
          >
            <Button
              component={Link}
              href="/"
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              sx={{
                borderRadius: '16px',
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 8px 32px rgba(var(--mui-palette-primary-mainChannel) / 0.2)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  boxShadow: '0 12px 40px rgba(var(--mui-palette-primary-mainChannel) / 0.4)',
                }
              }}
            >
              {/* Only the inner text of the button changes smoothly with a quick crossfade */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={localLang}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {t.button}
                </motion.span>
              </AnimatePresence>
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
