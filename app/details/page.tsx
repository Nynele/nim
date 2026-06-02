'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Container, Button, Typography, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { PROJECTS, WORK_EXPERIENCE } from '../data';
import { useLanguage } from '../language-context';
import { ProjectDetailContent, TopAppBar } from '../page';

const ShaderBackground = dynamic(() => import('../shader-background'), { ssr: false });

function DetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const type = searchParams.get('type') as 'project' | 'experience' | null;
  const { language } = useLanguage();

  if (!id || !type) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {language === 'es' ? 'Solicitud no válida' : 'Invalid Request'}
        </Typography>
        <Button component={Link} href="/" variant="contained" sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 'bold' }}>
          {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
        </Button>
      </Box>
    );
  }

  const item = type === 'project'
    ? PROJECTS.find((p) => p.id === id)
    : WORK_EXPERIENCE.find((w) => w.id === id);

  if (!item) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {language === 'es' ? 'Elemento no encontrado' : 'Item Not Found'}
        </Typography>
        <Button component={Link} href="/" variant="contained" sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 'bold' }}>
          {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 16, md: 20 }, mb: 8, position: 'relative', zIndex: 10 }}>
      {/* Back navigation button */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBackIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: '20px',
            px: 3,
            py: 1,
            border: '1px solid',
            borderColor: 'divider',
            color: 'text.primary',
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'primary.main',
            }
          }}
        >
          {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
        </Button>
      </Box>

      {/* Glassmorphic Container for details */}
      <Box
        sx={{
          borderRadius: '28px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'rgba(25, 22, 29, 0.92)',
          backdropFilter: 'blur(20px)',
          p: { xs: 3, md: 6 },
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
          '[data-mui-color-scheme="light"] &': {
            bgcolor: 'rgba(255, 255, 255, 0.96)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
          }
        }}
      >
        <ProjectDetailContent item={item} type={type} language={language} />
      </Box>
    </Container>
  );
}

export default function DetailsPage() {
  return (
    <Box sx={{ color: 'text.primary', minHeight: '100vh', position: 'relative', zIndex: 0 }}>
      <ShaderBackground />
      <TopAppBar />
      <Suspense fallback={
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      }>
        <DetailsContent />
      </Suspense>
    </Box>
  );
}
