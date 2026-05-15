'use client';

import Link from 'next/link';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'motion/react';
import { Home as HomeIcon } from '@mui/icons-material';
import { useLanguage } from './language-context';

function AnimatedBackground() {
  return (
    <Box sx={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: -1, overflow: 'hidden', pointerEvents: 'none',
      bgcolor: 'background.default'
    }}>
      {/* Primary Blob */}
      <Box sx={{
        position: 'absolute', top: '-10%', left: '-10%', width: '60%', height: '60%',
        borderRadius: '50%', filter: 'blur(120px)', opacity: 0.15,
        background: 'radial-gradient(circle, var(--mui-palette-primary-main) 0%, transparent 70%)',
        animation: 'blobFloat 20s ease-in-out infinite alternate',
        '@keyframes blobFloat': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(15%, 10%) scale(1.1)' }
        }
      }} />
      {/* Secondary Blob */}
      <Box sx={{
        position: 'absolute', bottom: '-15%', right: '-5%', width: '50%', height: '50%',
        borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1,
        background: 'radial-gradient(circle, var(--mui-palette-secondary-main, #9c27b0) 0%, transparent 70%)',
        animation: 'blobFloatRev 25s ease-in-out infinite alternate',
        '@keyframes blobFloatRev': {
          '0%': { transform: 'translate(0, 0) scale(1.1)' },
          '100%': { transform: 'translate(-10%, -15%) scale(1)' }
        }
      }} />
      {/* Subtle Dot Grid Overlay */}
      <Box sx={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'radial-gradient(var(--mui-palette-text-primary) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />
    </Box>
  );
}

export default function NotFound() {
  const { t } = useLanguage();

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
      <AnimatedBackground />
      
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
          
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              mb: 2,
              letterSpacing: '-0.02em'
            }}
          >
            {t('404.title')}
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 6, 
              maxWidth: 400, 
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: '1.1rem'
            }}
          >
            {t('404.subtitle')}
          </Typography>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(var(--mui-palette-primary-mainChannel) / 0.3)',
                }
              }}
            >
              {t('404.button')}
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
