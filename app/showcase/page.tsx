'use client';

import { motion } from 'motion/react';
import {
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  AppBar,
  Toolbar,
  useColorScheme,
  Menu,
  MenuItem,
} from '@mui/material';

import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  SettingsBrightness as SystemModeIcon,
  Translate as TranslateIcon,
  Email as EmailIcon,
  Launch as LaunchIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../language-context';
import { SOCIAL_LINKS, PROJECTS, WORK_EXPERIENCE } from '../data';
import DiscordMessage from '../../components/discord-message';
import BotBuilder from '../../components/bot-builder';

function AnimatedBackground() {
  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none', bgcolor: 'background.default' }}>
      <Box sx={{ position: 'absolute', top: '-10%', left: '-10%', width: '60%', height: '60%', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.15, background: 'radial-gradient(circle, var(--mui-palette-primary-main) 0%, transparent 70%)' }} />
      <Box sx={{ position: 'absolute', bottom: '-15%', right: '-5%', width: '50%', height: '50%', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1, background: 'radial-gradient(circle, var(--mui-palette-secondary-main, #9c27b0) 0%, transparent 70%)' }} />
    </Box>
  );
}

function TopAppBar() {
  const { mode, setMode } = useColorScheme();
  const { setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  useEffect(() => setMounted(true), []);
  const handleToggle = () => { if (mode === 'light') setMode('dark'); else if (mode === 'dark') setMode('system'); else setMode('light'); };
  const handleLangClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleLangClose = (lang?: 'en' | 'es') => { if (lang) setLanguage(lang); setAnchorEl(null); };
  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(12px)', borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 'lg', width: '100%', mx: 'auto' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nynele</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handleLangClick} color="inherit"><TranslateIcon /></IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleLangClose()}>
            <MenuItem onClick={() => handleLangClose('en')}>English</MenuItem>
            <MenuItem onClick={() => handleLangClose('es')}>Español</MenuItem>
          </Menu>
          <IconButton onClick={handleToggle} color="inherit">
            {!mounted ? <SystemModeIcon /> : mode === 'light' ? <LightModeIcon /> : mode === 'dark' ? <DarkModeIcon /> : <SystemModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function FeatureShowcase({ title, description, reverse, message }: { title: string, description: string, reverse?: boolean, message: React.ReactNode }) {
  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Box sx={{ display: 'flex', gap: 8, alignItems: 'center', flexDirection: { xs: 'column', md: reverse ? 'row-reverse' : 'row' } }}>
        <Box sx={{ flex: 1, width: '100%' }}>
          <motion.div initial={{ opacity: 0, x: reverse ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-0.02em' }}>{title}</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.2rem', lineHeight: 1.7 }}>{description}</Typography>
          </motion.div>
        </Box>
        <Box sx={{ flex: 1, width: '100%' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <Box sx={{ p: 1, borderRadius: '24px', bgcolor: '#1e1f22', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', border: 1, borderColor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center' }}>
              {message}
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}

export default function PitchPage() {
  const { t } = useLanguage();

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', color: 'text.primary' }}>
      <AnimatedBackground />
      <TopAppBar />
      <Container maxWidth="lg">
        {/* HERO SECTION */}
        <Box sx={{ py: { xs: 10, md: 15 }, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Typography variant="h1" sx={{
              fontWeight: 900, mb: 3,
              fontSize: { xs: '3.5rem', md: '6rem' },
              letterSpacing: '-0.04em',
              lineHeight: 1,
              background: 'linear-gradient(135deg, var(--mui-palette-primary-main) 0%, #9c27b0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {t('pitch.hero.title')}
            </Typography>
            <Typography variant="h5" sx={{ mb: 6, maxWidth: 800, mx: 'auto', color: 'text.secondary', fontWeight: 400 }}>
              {t('pitch.hero.subtitle')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<EmailIcon />}
                href={SOCIAL_LINKS.discord}
                target="_blank"
                sx={{ borderRadius: '12px', fontWeight: 'bold', textTransform: 'none', px: 5, py: 1.5, fontSize: '1rem' }}
              >
                {t('pitch.final.button')}
              </Button>
            </Box>
          </motion.div>
        </Box>

        {/* FEATURE SHOWCASES */}
        <Box sx={{ pb: 15 }}>
          <FeatureShowcase
            title={t('pitch.feature.mod.title')}
            description={t('pitch.feature.mod.desc')}
            message={
              <DiscordMessage
                authorName="Sledge"
                tagText="APP"
                authorAvatar="https://cdn.discordapp.com/avatars/1457170648383094825/0d6d2fdeb219b8ef63f46cb102ad221c.webp?size=1024"
                timestamp="5/13/2026 12:19 PM"
                embeds={[{ 
                  color: '#f23f43',
                  title: t('pitch.example.mod.title'),
                  description: t('pitch.example.mod.desc'),
                  fields: [
                    { name: t('pitch.example.mod.field.overview'), value: '', inline: false },
                    { name: t('pitch.example.mod.field.user'), value: 'abdo_84177 (1488940616934101214)', inline: false },
                    { name: t('pitch.example.mod.field.channel'), value: '# roe-fanart', inline: false },
                    { name: t('pitch.example.mod.field.incident'), value: 'inc-1778667593603-355691', inline: false }
                  ],
                  footer: 'Status: Open'
                }]}
                buttons={[
                  { label: t('pitch.example.mod.btn.ban'), color: 'danger' },
                  { label: t('pitch.example.mod.btn.history'), color: 'secondary' },
                  { label: t('pitch.example.mod.btn.dismiss'), color: 'success' },
                  { label: t('pitch.example.mod.btn.evidence'), color: 'secondary', icon: <LaunchIcon sx={{ fontSize: '1rem' }} /> },
                ]}
              />
            }
          />

          <FeatureShowcase
            reverse
            title={t('pitch.feature.notifications.title')}
            description={t('pitch.feature.notifications.desc')}
            message={
              <DiscordMessage
                authorName="MeliasBot"
                tagText="APP"
                authorAvatar="https://cdn.discordapp.com/avatars/1355258099052580954/f50ad806b7e50b78c531ecb7e470535f.webp?size=1024"
                timestamp="6/22/2025 10:29 PM"
                content={t('pitch.example.notif.msg')}
                embeds={[{
                  color: '#ff0000',
                  title: t('pitch.example.notif.embed.title'),
                  description: t('pitch.example.notif.embed.desc'),
                  image: 'https://cdn.discordapp.com/avatars/1355258099052580954/f50ad806b7e50b78c531ecb7e470535f.webp?size=1024',
                  imageAspectRatio: '16 / 9'
                }]}
              />
            }
          />

          <FeatureShowcase
            title={t('pitch.feature.embeds.title')}
            description={t('pitch.feature.embeds.desc')}
            message={
              <DiscordMessage
                authorName="MeliasBot"
                tagText="APP"
                authorAvatar="https://cdn.discordapp.com/avatars/1355258099052580954/f50ad806b7e50b78c531ecb7e470535f.webp?size=1024"
                timestamp="4/3/2025 10:42 AM"
                embeds={[
                  {
                    color: '#e6411d',
                    image: 'https://media.discordapp.net/attachments/1356305121939685628/1356953423563591871/normativas_embed.png?ex=6a07ac1b&is=6a065a9b&hm=4b2148959cf5044c883763f709e1f1be8ad72793096ef79c84cdc2218449cfe7&=&format=webp&quality=lossless'
                  },
                  {
                    color: '#e6411d',
                    description: t('pitch.example.rules.desc'),
                    fields: [
                      { name: t('pitch.example.rules.f1'), value: t('pitch.example.rules.f1.v'), inline: true },
                      { name: t('pitch.example.rules.f2'), value: t('pitch.example.rules.f2.v'), inline: true },
                      { name: t('pitch.example.rules.f3'), value: t('pitch.example.rules.f3.v'), inline: true },
                      { name: t('pitch.example.rules.f4'), value: t('pitch.example.rules.f4.v'), inline: true },
                      { name: t('pitch.example.rules.f5'), value: t('pitch.example.rules.f5.v'), inline: true },
                      { name: t('pitch.example.rules.f6'), value: t('pitch.example.rules.f6.v'), inline: true },
                    ],
                    footerImage: 'https://media.discordapp.net/attachments/1356305121939685628/1356305222070173927/barra.png?ex=6a07f36b&is=6a06a1eb&hm=fd7fbf800c9a050cff907aeeb3496f75011b20ff95780a6df8f5325d23e4aded&=&format=webp&quality=lossless&width=1872&height=20',
                    footer: t('pitch.example.rules.footer')
                  }
                ]}
                buttons={[
                  { label: t('pitch.example.rules.btn1'), color: 'secondary', icon: <LaunchIcon sx={{ fontSize: '1rem' }} /> },
                  { label: t('pitch.example.rules.btn2'), color: 'secondary', icon: <LaunchIcon sx={{ fontSize: '1rem' }} /> },
                ]}
              />
            }
          />

          <FeatureShowcase
            reverse
            title={t('pitch.feature.custom.title')}
            description={t('pitch.feature.custom.desc')}
            message={<BotBuilder />}
          />
        </Box>

        {/* TRUSTED BY SECTION */}
        <Box sx={{ textAlign: 'center', py: 10, mb: 10, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="overline" sx={{ fontWeight: 'bold', color: 'text.secondary', letterSpacing: 2, display: 'block', mb: 4 }}>
            TRUSTED BY
          </Typography>
          <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            <Box
              sx={{
                display: 'inline-flex',
                gap: { xs: 2, md: 3 },
                animation: 'marquee 40s linear infinite',
                '@keyframes marquee': {
                  '0%': { transform: 'translateX(0)' },
                  '100%': { transform: 'translateX(-50%)' }
                },
                '&:hover': {
                  animationPlayState: 'paused'
                }
              }}
            >
              {[...WORK_EXPERIENCE, ...WORK_EXPERIENCE].map((work, index) => {
                const projectImage = PROJECTS.find(p => p.name.includes(work.company) || work.company.includes(p.name))?.images[0];

                return (
                  <Box
                    key={index}
                    component="a"
                    href={work.link}
                    target="_blank"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 3,
                      py: 1.5,
                      borderRadius: '16px',
                      bgcolor: 'rgba(255,255,255,0.03)',
                      border: 1,
                      borderColor: 'rgba(255,255,255,0.05)',
                      textDecoration: 'none',
                      color: 'text.primary',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.08)',
                        borderColor: 'rgba(255,255,255,0.1)',
                      }
                    }}
                  >
                    {projectImage && (
                      <Box
                        component="img"
                        src={projectImage}
                        alt={work.company}
                        sx={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                      />
                    )}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      {work.company}
                    </Typography>
                    {work.verified && (
                      <VerifiedIcon sx={{ fontSize: '1.2rem', color: '#43b581' }} />
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Container>

      {/* FOOTER */}
      <Box sx={{ py: 10, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} Nynele Studio. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}