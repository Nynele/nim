'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
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
import { SOCIAL_LINKS, WORK_EXPERIENCE } from '../data';
import dynamic from 'next/dynamic';

const DiscordMessage = dynamic(() => import('../../components/discord-message'), { ssr: false });
const BotBuilder = dynamic(() => import('../../components/bot-builder'), { ssr: false });
const ShaderBackground = dynamic(() => import('../shader-background'), { ssr: false });

function FadeText({ children, inline = false }: { children: React.ReactNode; inline?: boolean }) {
  const { language } = useLanguage();
  return (
    <motion.span
      key={language}
      initial={{ opacity: 0.35, filter: 'blur(4px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ display: inline ? 'inline-block' : 'block' }}
    >
      {children}
    </motion.span>
  );
}

// In-memory flag to prevent reloading animations on language/route change
let hasAnimated = false;

// ── Theme Switch ───────────────────────────────────────────────────────
function ThemeSwitch() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fix for scroll jump on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  if (!mounted) return <IconButton disabled><SystemModeIcon /></IconButton>;

  const handleToggle = () => {
    if (mode === 'light') setMode('dark');
    else if (mode === 'dark') setMode('system');
    else setMode('light');
  };

  return (
    <IconButton onClick={handleToggle} color="inherit">
      {mode === 'light' ? <LightModeIcon /> : mode === 'dark' ? <DarkModeIcon /> : <SystemModeIcon />}
    </IconButton>
  );
}

// ── Language Switch ────────────────────────────────────────────────────
function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (lang?: 'en' | 'es' | 'it' | 'fr' | 'de' | 'pt') => {
    if (lang) setLanguage(lang);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} color="inherit">
        <TranslateIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        disableScrollLock
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              borderRadius: '24px',
              mt: 1.5,
              minWidth: 180,
              p: 1,
              overflow: 'visible',
              filter: 'drop-shadow(0px 8px 24px rgba(0,0,0,0.15))',
              border: 1,
              borderColor: 'divider',
              bgcolor: 'rgba(var(--mui-palette-background-paperChannel) / 0.8)',
              backdropFilter: 'blur(20px)',
              '& .MuiList-root': {
                p: 0,
              },
            }
          }
        }}
      >
        <MenuItem 
          onClick={() => handleClose('en')} 
          selected={language === 'en'}
          sx={{
            borderRadius: '16px',
            mb: 0.5,
            py: 1.5,
            px: 2,
            fontWeight: language === 'en' ? 'bold' : 'medium',
            transition: 'all 0.2s ease',
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': { bgcolor: 'primary.dark' }
            },
            '&:hover': {
              bgcolor: 'action.hover',
              transform: 'scale(1.02)'
            }
          }}
        >
          English
        </MenuItem>
        <MenuItem 
          onClick={() => handleClose('es')} 
          selected={language === 'es'}
          sx={{
            borderRadius: '16px',
            mb: 0.5,
            py: 1.5,
            px: 2,
            fontWeight: language === 'es' ? 'bold' : 'medium',
            transition: 'all 0.2s ease',
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': { bgcolor: 'primary.dark' }
            },
            '&:hover': {
              bgcolor: 'action.hover',
              transform: 'scale(1.02)'
            }
          }}
        >
          Español
        </MenuItem>
        <MenuItem 
          onClick={() => handleClose('it')} 
          selected={language === 'it'}
          sx={{
            borderRadius: '16px',
            mb: 0.5,
            py: 1.5,
            px: 2,
            fontWeight: language === 'it' ? 'bold' : 'medium',
            transition: 'all 0.2s ease',
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': { bgcolor: 'primary.dark' }
            },
            '&:hover': {
              bgcolor: 'action.hover',
              transform: 'scale(1.02)'
            }
          }}
        >
          Italiano
        </MenuItem>
        <MenuItem 
          onClick={() => handleClose('fr')} 
          selected={language === 'fr'}
          sx={{
            borderRadius: '16px',
            mb: 0.5,
            py: 1.5,
            px: 2,
            fontWeight: language === 'fr' ? 'bold' : 'medium',
            transition: 'all 0.2s ease',
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': { bgcolor: 'primary.dark' }
            },
            '&:hover': {
              bgcolor: 'action.hover',
              transform: 'scale(1.02)'
            }
          }}
        >
          Français
        </MenuItem>
        <MenuItem 
          onClick={() => handleClose('de')} 
          selected={language === 'de'}
          sx={{
            borderRadius: '16px',
            mb: 0.5,
            py: 1.5,
            px: 2,
            fontWeight: language === 'de' ? 'bold' : 'medium',
            transition: 'all 0.2s ease',
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': { bgcolor: 'primary.dark' }
            },
            '&:hover': {
              bgcolor: 'action.hover',
              transform: 'scale(1.02)'
            }
          }}
        >
          Deutsch
        </MenuItem>
        <MenuItem 
          onClick={() => handleClose('pt')} 
          selected={language === 'pt'}
          sx={{
            borderRadius: '16px',
            py: 1.5,
            px: 2,
            fontWeight: language === 'pt' ? 'bold' : 'medium',
            transition: 'all 0.2s ease',
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': { bgcolor: 'primary.dark' }
            },
            '&:hover': {
              bgcolor: 'action.hover',
              transform: 'scale(1.02)'
            }
          }}
        >
          Português
        </MenuItem>
      </Menu>
    </>
  );
}

function TopAppBar() {
  const { t } = useLanguage();
  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        top: { xs: '12px', md: '20px' },
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 24px)',
        maxWidth: '800px',
        zIndex: 1100,
        borderRadius: '30px',
        border: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        background: 'rgba(20, 18, 24, 0.65)',
        backdropFilter: 'blur(20px) saturate(190%)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'rgba(255, 255, 255, 0.15)',
          boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
        },
        '[data-mui-color-scheme="light"] &': {
          background: 'rgba(255, 255, 255, 0.65)',
          borderColor: 'rgba(0, 0, 0, 0.06)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.08), inset 0 1px 1px 0 rgba(255, 255, 255, 0.5)',
          '&:hover': {
            borderColor: 'rgba(0, 0, 0, 0.12)',
            boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.12), inset 0 1px 1px 0 rgba(255, 255, 255, 0.6)',
          }
        }
      }}
      suppressHydrationWarning
    >
      <Toolbar sx={{ justifyContent: 'space-between', width: '100%', px: 3, minHeight: '64px', position: 'relative' }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Nynele
        </Typography>

        {/* Center Navigation Links */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, md: 1.5 }
          }}
        >
          <Button
            component={Link}
            href="/"
            sx={{
              borderRadius: '20px',
              px: 2,
              py: 0.5,
              fontWeight: 'medium',
              textTransform: 'none',
              color: 'text.secondary',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: 'text.primary',
                bgcolor: 'action.hover',
              }
            }}
          >
            {t('nav.home')}
          </Button>
          <Button
            component={Link}
            href="/showcase"
            sx={{
              borderRadius: '20px',
              px: 2,
              py: 0.5,
              fontWeight: 'bold',
              textTransform: 'none',
              color: 'primary.main',
              bgcolor: 'action.selected',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'action.hover',
                color: 'primary.main',
              }
            }}
          >
            {t('nav.showcase')}
          </Button>
        </Box>

        {/* Right side controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LanguageSwitch />
          <ThemeSwitch />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// ── Scroll Animation Wrapper ───────────────────────────────────────────
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const skip = hasAnimated;
  return (
    <motion.div
      initial={skip ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={skip ? { duration: 0 } : { duration: 0.5, delay, ease: [0.2, 0.65, 0.3, 0.9] }}
    >
      {children}
    </motion.div>
  );
}

function FeatureShowcase({ title, description, reverse, message }: { title: string, description: string, reverse?: boolean, message: React.ReactNode }) {
  const skip = hasAnimated;
  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Box sx={{ display: 'flex', gap: 8, alignItems: 'center', flexDirection: { xs: 'column', md: reverse ? 'row-reverse' : 'row' } }}>
        <Box sx={{ flex: 1, width: '100%' }}>
          <motion.div 
            initial={skip ? { opacity: 1, x: 0 } : { opacity: 0, x: reverse ? 30 : -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={skip ? { duration: 0 } : { duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] }}
          >
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-0.02em', fontSize: { xs: '2rem', md: '3rem' } }}>
              <FadeText inline>{title}</FadeText>
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.7 }}>
              <FadeText>{description}</FadeText>
            </Typography>
          </motion.div>
        </Box>
        <Box sx={{ flex: 1, width: '100%' }}>
          <motion.div 
            initial={skip ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }} 
            transition={skip ? { duration: 0 } : { duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] }}
          >
            <Box 
              suppressHydrationWarning
              sx={{ 
                p: { xs: 1.5, md: 2.5 }, 
                borderRadius: '28px', 
                bgcolor: 'rgba(var(--mui-palette-background-paperChannel) / 0.5)', 
                backdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)', 
                border: 1, 
                borderColor: 'divider', 
                display: 'flex', 
                justifyContent: 'center',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                }
              }}
            >
              {message}
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}

export default function PitchPage() {
  const { language, t } = useLanguage();

  useEffect(() => {
    hasAnimated = true;
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', color: 'text.primary', overflowX: 'hidden', zIndex: 0 }}>
      <ShaderBackground />
      <TopAppBar />

      {/* Ambient background glow */}
      <Box sx={{
        position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: 300, md: 600 }, height: { xs: 300, md: 600 },
        borderRadius: '50%', opacity: 0.06, filter: 'blur(100px)', pointerEvents: 'none',
        background: 'radial-gradient(circle, var(--mui-palette-primary-main) 0%, transparent 70%)',
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, mt: { xs: 12, md: 16 } }}>
        {/* HERO SECTION */}
        <Box sx={{ pt: { xs: 4, md: 6 }, pb: { xs: 10, md: 15 }, textAlign: 'center' }}>
          <motion.div 
            initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={hasAnimated ? { duration: 0 } : { duration: 0.6 }}
          >
            <Typography variant="h1" sx={{
              fontWeight: 900, mb: 3,
              fontSize: { xs: '3.5rem', md: '5.5rem' },
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
            }}>
              <FadeText>
                {language === 'en' || language === 'de' ? (
                  <>Discord Designer <br /><Box component="span" sx={{ color: 'primary.main' }}>&</Box> Community Manager.</>
                ) : language === 'fr' ? (
                  <>Designer Discord <br /><Box component="span" sx={{ color: 'primary.main' }}>&</Box> Community Manager.</>
                ) : language === 'it' ? (
                  <>Designer di Discord <br /><Box component="span" sx={{ color: 'primary.main' }}>&</Box> Community Manager.</>
                ) : language === 'pt' ? (
                  <>Designer de Discord <br /><Box component="span" sx={{ color: 'primary.main' }}>&</Box> Community Manager.</>
                ) : (
                  <>Diseñador de Discord <br /><Box component="span" sx={{ color: 'primary.main' }}>&</Box> Community Manager.</>
                )}
              </FadeText>
            </Typography>
            <Typography variant="h5" sx={{ mb: 6, maxWidth: 800, mx: 'auto', color: 'text.secondary', fontWeight: 400, px: 2, lineHeight: 1.6 }}>
              <FadeText>
                {t('pitch.hero.subtitle')}
              </FadeText>
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
                <FadeText inline>{t('pitch.final.button')}</FadeText>
              </Button>
            </Box>
          </motion.div>
        </Box>

        {/* FEATURE SHOWCASES */}
        <Box sx={{ pb: 15 }}>
          <ScrollReveal>
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
          </ScrollReveal>

          <ScrollReveal>
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
          </ScrollReveal>

          <ScrollReveal>
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
          </ScrollReveal>

          <ScrollReveal>
            <FeatureShowcase
              reverse
              title={t('pitch.feature.custom.title')}
              description={t('pitch.feature.custom.desc')}
              message={<BotBuilder />}
            />
          </ScrollReveal>
        </Box>

        {/* TRUSTED BY SECTION */}
        <ScrollReveal>
          <Box sx={{ textAlign: 'center', py: 10, mb: 10, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="overline" sx={{ fontWeight: 'bold', color: 'text.secondary', letterSpacing: 2, display: 'block', mb: 4 }}>
              <FadeText inline>{t('pitch.trusted_by')}</FadeText>
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
                {[...WORK_EXPERIENCE, ...WORK_EXPERIENCE].map((work: any, index: number) => {
                  const logo = work.logo || null;

                  return (
                    <Box
                      key={index}
                      component="a"
                      href={work.link}
                      target="_blank"
                      suppressHydrationWarning
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        px: 3,
                        py: 1.5,
                        borderRadius: '16px',
                        bgcolor: 'rgba(var(--mui-palette-background-paperChannel) / 0.5)',
                        backdropFilter: 'blur(10px) saturate(140%)',
                        border: 1,
                        borderColor: 'divider',
                        textDecoration: 'none',
                        color: 'text.primary',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        '&:hover': {
                          bgcolor: 'rgba(var(--mui-palette-background-paperChannel) / 0.8)',
                          borderColor: 'primary.main',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      {logo && (
                        <Box
                          component="img"
                          src={logo}
                          alt={work.company}
                          sx={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
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
        </ScrollReveal>
      </Container>

      {/* FOOTER */}
      <Box sx={{ bgcolor: 'background.paper', py: 8, mt: 8, borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            <FadeText>{t('cta.title')}</FadeText>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            <FadeText>{t('cta.subtitle')}</FadeText>
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            href={SOCIAL_LINKS.discord} 
            target="_blank"
            startIcon={<EmailIcon />}
            sx={{ borderRadius: 8, px: 4, py: 1.5, fontWeight: 'bold' }}
          >
            <FadeText inline>{t('discord.message')}</FadeText>
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 6 }}>
            <FadeText inline>&copy; {new Date().getFullYear()} {t('footer.copy')}</FadeText>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
