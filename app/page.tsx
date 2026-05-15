'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Chip,
  Card,
  CardActionArea,
  CardContent,
  Avatar,
  Box,
  Container,
  useColorScheme,
  Skeleton,
  Menu,
  MenuItem,
} from '@mui/material';

import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  SettingsBrightness as SystemModeIcon,
  MusicNote as MusicNoteIcon,
  Verified as VerifiedIcon,
  Email as EmailIcon,
  ArrowOutward as ArrowOutwardIcon,
  Devices as DevicesIcon,
  Computer as ComputerIcon,
  Smartphone as SmartphoneIcon,
  Language as WebIcon,
  Translate as TranslateIcon,
} from '@mui/icons-material';

import {
  PROJECTS,
  WORK_EXPERIENCE,
  EMAIL,
  SOCIAL_LINKS,
  LocalizedString,
} from './data';

import { useLanguage } from './language-context';

// ── Helpers ────────────────────────────────────────────────────────────
const getLocalized = (val: LocalizedString, lang: 'en' | 'es') => {
  if (typeof val === 'string') return val;
  return val[lang];
};

// ── Scroll Animation Wrapper ───────────────────────────────────────────
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.65, 0.3, 0.9] }}
    >
      {children}
    </motion.div>
  );
}

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

  const handleClose = (lang?: 'en' | 'es') => {
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
      </Menu>
    </>
  );
}

// ── Music Image Fallback ──────────────────────────────────────────────
function MusicFallback() {
  return (
    <Box sx={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, var(--mui-palette-primary-main) 0%, #1a1a2e 100%)',
    }}>
      <Box sx={{
        position: 'absolute', top: -10, right: -10, width: 60, height: 60,
        borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)',
        animation: 'spin 12s linear infinite',
        '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
      }} />
      <Box sx={{
        position: 'absolute', bottom: 10, left: 10, width: 20, height: 20,
        borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)',
        animation: 'float 3s ease-in-out infinite',
        '@keyframes float': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      }} />
      <MusicNoteIcon sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        fontSize: 20, color: 'rgba(255,255,255,0.2)',
      }} />
    </Box>
  );
}

// ── Activity Icon with Fallback ────────────────────────────────────────
function ActivityIcon({ src, type }: { src: string | null; type: number }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return <MusicFallback />;
  }

  return (
    <Box
      component="img"
      src={src}
      onError={() => setError(true)}
      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}

// ── VR Headset Icon ──────────────────────────────────────────────────
function VrIcon({ sx }: { sx?: any }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      sx={{ ...sx, fill: 'currentColor' }}
    >
      <path d="M4 10.5A3.5 3.5 0 0 1 7.5 7h9A3.5 3.5 0 0 1 20 10.5V14a3 3 0 0 1-3 3h-.18a3 3 0 0 1-2.95-2.46l-.2-1.04a.75.75 0 0 0-.74-.6h-1.86a.75.75 0 0 0-.74.6l-.2 1.04A3 3 0 0 1 7.18 17H7a3 3 0 0 1-3-3v-3.5Zm2 0V14a1 1 0 0 0 1 1h.18a1 1 0 0 0 .98-.82l.2-1.04a2.75 2.75 0 0 1 2.7-2.24h1.86a2.75 2.75 0 0 1 2.7 2.24l.2 1.04a1 1 0 0 0 .98.82H17a1 1 0 0 0 1-1v-3.5A1.5 1.5 0 0 0 16.5 9h-9A1.5 1.5 0 0 0 6 10.5Z" />
    </Box>
  );
}

// ── Animated Background ───────────────────────────────────────────────
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

// ── Local Time Widget ──────────────────────────────────────────────────
function LocalTime() {
  const [time, setTime] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Europe/Madrid'
      }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Box sx={{ opacity: 0.6 }}>
      <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '0.6rem', letterSpacing: 1, display: 'block' }}>
        {t('time.local')}
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.75rem' }}>
        {time} CET
      </Typography>
    </Box>
  );
}

// ── Top App Bar ────────────────────────────────────────────────────────
function TopAppBar() {
  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(12px)', borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 'lg', width: '100%', mx: 'auto' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => window.scrollTo(0, 0)}>
          Nynele
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <LanguageSwitch />
          <ThemeSwitch />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// ── Project Image with Skeleton ────────────────────────────────────────
function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover' }}>
        <MusicNoteIcon sx={{ fontSize: 48, opacity: 0.3 }} />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onError={() => setError(true)}
      sx={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        bgcolor: 'action.hover'
      }}
    />
  );
}

// ── Discord Profile Widget ─────────────────────────────────────────────
function DiscordProfile() {
  const [data, setData] = useState<any>(null);
  const { t } = useLanguage();
  const DISCORD_ID = '799251427839049818';

  const fetchData = useCallback(async () => {
    // Discord Lanyard
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (e) { console.error(e); }
  }, [DISCORD_ID]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (!data) {
    return (
      <Card elevation={0} sx={{
        p: 2.5,
        borderRadius: '28px',
        border: 1,
        borderColor: 'divider',
        width: { xs: '100%', md: 360 },
        minHeight: 450,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Skeleton variant="circular" width={72} height={72} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="50%" height={16} />
          </Box>
        </Box>
        <Skeleton variant="rectangular" width="100%" height={140} sx={{ borderRadius: '16px' }} />
        <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: '16px' }} />
        <Skeleton variant="rectangular" width="100%" height={50} sx={{ borderRadius: '12px', mt: 'auto' }} />
      </Card>
    );
  }

  const statusColors: any = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' };
  const user = data.discord_user;

  // Avatar Decoration URL
  const decorationUrl = user.avatar_decoration_data
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png`
    : null;

  const AVATAR_SIZE = 72;
  const DECO_SIZE = AVATAR_SIZE * 1.2;

  return (
    <Card elevation={0} sx={{
      p: 2.5,
      borderRadius: '28px',
      border: 1,
      borderColor: 'divider',
      bgcolor: 'rgba(var(--mui-palette-background-paperChannel) / 0.7)',
      backdropFilter: 'blur(20px) saturate(180%)',
      width: { xs: '100%', md: 360 },
      position: 'relative',
      overflow: 'visible',
      transition: 'all 0.3s ease',
      '&:hover': { borderColor: 'primary.main', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }
    }}>
      {/* Header: Avatar + Name + Status */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ position: 'relative', width: AVATAR_SIZE, height: AVATAR_SIZE }}>
          {/* Avatar decoration */}
          {decorationUrl && (
            <Box
              component="img"
              src={decorationUrl}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: DECO_SIZE,
                height: DECO_SIZE,
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
                pointerEvents: 'none'
              }}
            />
          )}
          <Avatar
            src={`https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user.avatar}.png?size=128`}
            sx={{ width: AVATAR_SIZE, height: AVATAR_SIZE, border: 2, borderColor: 'divider' }}
          />
          <Box sx={{
            position: 'absolute', bottom: 2, right: 2, width: 18, height: 18,
            borderRadius: '50%', bgcolor: statusColors[data.discord_status] || statusColors.offline,
            border: '3px solid', borderColor: 'background.paper',
            boxShadow: '0 0 10px ' + (statusColors[data.discord_status] || statusColors.offline),
            zIndex: 3
          }} />
        </Box>

        <Box sx={{ minWidth: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1, mb: 0.6 }}>
                {user.global_name || user.username}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <Chip
                  label={`@${user.username}`}
                  size="small"
                  sx={{ height: 16, fontSize: '0.6rem', fontWeight: 'bold', borderRadius: '4px', bgcolor: 'action.hover' }}
                />
                <Box sx={{ display: 'flex', gap: 0.3, opacity: 0.5 }}>
                  {data.active_on_discord_desktop && <ComputerIcon sx={{ fontSize: 12 }} />}
                  {data.active_on_discord_mobile && <SmartphoneIcon sx={{ fontSize: 12 }} />}
                  {data.active_on_discord_web && <WebIcon sx={{ fontSize: 12 }} />}
                  {data.active_on_discord_vr && <VrIcon sx={{ width: 14, height: 14 }} />}
                </Box>
              </Box>
            </Box>
            <LocalTime />
          </Box>
          {/* Custom Status - Integrated below name */}
          {data.activities?.find((a: any) => a.type === 4) && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500, fontStyle: 'italic', opacity: 0.9 }}>
              {data.activities.find((a: any) => a.type === 4).emoji && <span>{data.activities.find((a: any) => a.type === 4).emoji.name}</span>}
              {data.activities.find((a: any) => a.type === 4).state}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Body: All Activities */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        {data.activities && data.activities.length > 0 ? (
          data.activities.map((activity: any, idx: number) => {
            // Skip custom status (already shown)
            if (activity.type === 4) return null;

            let imageUrl = null;
            if (activity.assets?.large_image) {
              if (activity.assets.large_image.startsWith('mp:external')) {
                imageUrl = 'https://' + activity.assets.large_image.split('https/')[1];
              } else {
                imageUrl = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
              }
            }

            return (
              <Box key={idx} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: 1, borderColor: 'divider' }}>
                  <ActivityIcon src={imageUrl} type={activity.type} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.6rem' }}>
                    {activity.type === 2 ? t('discord.listening') : activity.type === 0 ? t('discord.playing') : t('discord.activity')}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
                    {activity.name}
                  </Typography>
                  {(activity.details || activity.state) && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {activity.details || activity.state}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 1 }}>
            {t('discord.chilling')}
          </Typography>
        )}
      </Box>

      {/* Footer: Action Button */}
      <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<EmailIcon />}
          href={`https://discord.com/users/${DISCORD_ID}`}
          target="_blank"
          sx={{ borderRadius: '12px', fontWeight: 'bold', textTransform: 'none' }}
        >
          {t('discord.message')}
        </Button>
      </Box>
    </Card>
  );
}

// ── Page Component ─────────────────────────────────────────────────────
export default function Personal() {
  const { language, t } = useLanguage();

  return (
    <Box sx={{ color: 'text.primary', minHeight: '100vh', position: 'relative' }}>
      <AnimatedBackground />
      <TopAppBar />

      <Container maxWidth="md" sx={{ mt: { xs: 6, md: 10 } }}>

        {/* HERO SECTION */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box sx={{
            mb: 12,
            position: 'relative',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: { xs: 6, md: 10 }
          }}>
            {/* Simple static glow fallback behind hero */}
            <Box sx={{
              position: 'absolute', top: -50, left: -50, width: 300, height: 300,
              borderRadius: '50%', opacity: 0.05, filter: 'blur(80px)', pointerEvents: 'none',
              background: 'radial-gradient(circle, var(--mui-palette-primary-main) 0%, transparent 70%)',
            }} />

            <Box sx={{ flex: 1 }}>
              <Typography variant="h2" component="h1" sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.02em', fontSize: { xs: '2.5rem', md: '4rem' }, position: 'relative' }}>
                {language === 'en' ? (
                  <>Discord Designer <br /><Box component="span" sx={{ color: 'primary.main' }}>&</Box> Community Manager.</>
                ) : (
                  <>Diseñador de Discord <br /><Box component="span" sx={{ color: 'primary.main' }}>&</Box> Community Manager.</>
                )}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400, maxWidth: 600, lineHeight: 1.6 }}>
                {t('hero.subtitle')}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip
                  icon={<ArrowOutwardIcon />}
                  label="GitHub"
                  component="a"
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  clickable
                  variant="outlined"
                  sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                />
              </Box>
            </Box>

            <Box sx={{ flexShrink: 0, width: { xs: '100%', md: 'auto' } }}>
              <DiscordProfile />
            </Box>
          </Box>
        </motion.div>


        {/* PROJECTS SECTION */}
        <ScrollReveal>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>{t('section.projects')}</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4, mb: 12 }}>
            {PROJECTS.map((project, idx) => (
              <ScrollReveal key={project.id} delay={idx * 0.1}>
                <Card elevation={2} sx={{
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': { transform: 'translateY(-6px)', boxShadow: 10 },
                  '&:hover img': { transform: 'scale(1.05)' },
                  borderRadius: '24px',
                  overflow: 'hidden',
                  height: '100%',
                  transform: 'translateZ(0)', // Force GPU acceleration to avoid rendering artifacts
                  backfaceVisibility: 'hidden',
                }}>
                  <CardActionArea href={project.link} target="_blank" sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                    <Box sx={{ position: 'relative', p: 1.5, pb: 0 }}>
                      <Box sx={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3' }}>
                        {project.images && project.images.length > 0 ? (
                          <ProjectImage src={project.images[0]} alt={project.name} />
                        ) : (
                          <Box sx={{
                            width: '100%', height: '100%',
                            background: 'linear-gradient(135deg, var(--mui-palette-primary-main) 0%, var(--mui-palette-primary-dark, #4a3880) 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1,
                          }}>
                            <MusicNoteIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 'bold' }}>
                              {project.name}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{project.name}</Typography>
                        {project.verified && <VerifiedIcon color="primary" sx={{ fontSize: 20 }} />}
                        <ArrowOutwardIcon sx={{ ml: 'auto', opacity: 0.4, fontSize: 18 }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {getLocalized(project.description, language)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </ScrollReveal>
            ))}
          </Box>
        </ScrollReveal>

        {/* WORK EXPERIENCE — Timeline */}
        <ScrollReveal>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>{t('section.experience')}</Typography>
          <Box sx={{ position: 'relative', pl: { xs: 4, sm: 5 }, mb: 12 }}>
            {/* Timeline line */}
            <Box sx={{
              position: 'absolute', left: { xs: 15, sm: 19 }, top: 0, bottom: 0, width: 2,
              bgcolor: 'divider',
            }} />

            {WORK_EXPERIENCE.map((job, idx) => (
              <ScrollReveal key={job.id} delay={idx * 0.08}>
                <Box sx={{ position: 'relative', mb: 3 }}>
                  {/* Timeline dot */}
                  <Box sx={{
                    position: 'absolute', left: { xs: -25, sm: -29 }, top: 20, width: 12, height: 12,
                    borderRadius: '50%', bgcolor: getLocalized(job.end, language) === t('job.present') ? 'primary.main' : 'divider',
                    border: '2px solid', borderColor: 'background.default',
                    zIndex: 1,
                  }} />

                  <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: '20px', transition: 'all 0.2s', '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' } }}>
                    <CardActionArea href={job.link} target="_blank" sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 48, height: 48, fontSize: '1.1rem' }}>
                          {job.company.charAt(0)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{getLocalized(job.title, language)}</Typography>
                            {job.verified && <VerifiedIcon color="primary" sx={{ fontSize: 16 }} />}
                          </Box>
                          <Typography variant="body2" color="text.secondary">{job.company}</Typography>
                        </Box>
                        <Chip label={`${job.start} — ${getLocalized(job.end, language)}`} size="small" variant="outlined" sx={{ borderRadius: '8px', fontWeight: 'bold', fontSize: '0.7rem' }} />
                      </Box>
                    </CardActionArea>
                  </Card>
                </Box>
              </ScrollReveal>
            ))}
          </Box>
        </ScrollReveal>

      </Container>

      {/* FOOTER */}
      <Box sx={{ bgcolor: 'background.paper', py: 8, mt: 8, borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>{t('cta.title')}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t('cta.subtitle')}
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            href={SOCIAL_LINKS.discord} 
            target="_blank"
            startIcon={<EmailIcon />}
            sx={{ borderRadius: 8, px: 4, py: 1.5, fontWeight: 'bold' }}
          >
            {t('discord.message')}
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 6 }}>
            &copy; {new Date().getFullYear()} {t('footer.copy')}
          </Typography>
        </Container>
      </Box>

    </Box>
  );
}
