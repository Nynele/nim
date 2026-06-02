'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Chip,
  Card,
  CardContent,
  Avatar,
  Box,
  Container,
  useColorScheme,
  Skeleton,
  Menu,
  MenuItem,
  Tooltip,
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
  Groups as GroupsIcon,
  SportsEsports as GameIcon,
} from '@mui/icons-material';

import {
  PROJECTS,
  REPOSITORIES,
  WORK_EXPERIENCE,
  EMAIL,
  SOCIAL_LINKS,
  LocalizedString,
} from './data';

import { useLanguage } from './language-context';
import dynamic from 'next/dynamic';

import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogDescription,
} from '@/components/ui/morphing-dialog';

const ShaderBackground = dynamic(() => import('./shader-background'), { ssr: false });
const KofiModal = dynamic(() => import('./kofi-modal'), { ssr: false });

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

// In-memory cache & animation control to prevent reloading animations on language/route change
let hasAnimated = false;
let cachedDiscordData: any = null;
let cachedBadges: any[] = [];

// ── Helpers ────────────────────────────────────────────────────────────
const getLocalized = (val: LocalizedString, lang: 'en' | 'es' | 'it' | 'fr' | 'de' | 'pt') => {
  if (typeof val === 'string') return val;
  return val[lang];
};

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
          onClick={() => {
            if (typeof window !== 'undefined') {
              if (window.location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.location.href = '/';
              }
            }
          }}
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
            {t('nav.home')}
          </Button>
          <Button
            component={Link}
            href="/showcase"
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
        bgcolor: 'action.hover',
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    />
  );
}

// ── Image Carousel / Gallery ────────────────────────────────────────
function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      {/* Main Image View */}
      <Box sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        aspectRatio: '16/9',
        mb: 1.5,
        position: 'relative',
        border: 1,
        borderColor: 'divider',
        bgcolor: 'action.hover',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <ProjectImage src={images[activeIndex]} alt={`${alt} - screenshot ${activeIndex + 1}`} />
        
        {/* Navigation Dots Overlay */}
        {images.length > 1 && (
          <Box sx={{
            position: 'absolute',
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            bgcolor: 'rgba(0,0,0,0.6)',
            px: 1.5,
            py: 0.8,
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            zIndex: 5
          }}>
            {images.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setActiveIndex(idx)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: activeIndex === idx ? 'primary.main' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'primary.light', transform: 'scale(1.2)' }
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <Box sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 0.5,
          '::-webkit-scrollbar': { height: '6px' },
          '::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.15)', borderRadius: '3px' },
          '::-webkit-scrollbar-track': { bgcolor: 'transparent' }
        }}>
          {images.map((img, idx) => (
            <Box
              key={idx}
              onClick={() => setActiveIndex(idx)}
              sx={{
                width: 80,
                height: 48,
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0,
                cursor: 'pointer',
                border: '2px solid',
                borderColor: activeIndex === idx ? 'primary.main' : 'transparent',
                transition: 'all 0.2s',
                opacity: activeIndex === idx ? 1 : 0.6,
                '&:hover': { opacity: 1, borderColor: activeIndex === idx ? 'primary.main' : 'divider' }
              }}
            >
              <Box component="img" src={img} alt={`${alt} thumbnail ${idx + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

// ── Discord Server Invite Widget ──────────────────────────────────────
function DiscordServerInvite({ name, banner, members, online, link, t }: { name: string; banner: string; members: string; online?: string; link: string; t: any }) {
  // Use custom online count if provided, otherwise estimate it (12% of members)
  const onlineCount = online 
    ? online 
    : (() => {
        const memberNum = parseInt(members.replace(/[^0-9]/g, '')) || 10000;
        const count = Math.floor(memberNum * 0.12);
        return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '+';
      })();

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2.5,
      p: 2,
      borderRadius: '16px',
      border: 1,
      borderColor: 'divider',
      bgcolor: 'rgba(255, 255, 255, 0.02)',
      '[data-mui-color-scheme="light"] &': {
        bgcolor: 'rgba(0, 0, 0, 0.03)',
      },
      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
      mb: 3,
      flexWrap: 'wrap'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#43b581' }} />
        <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.72rem', color: 'text.secondary' }}>
          {onlineCount} Online
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#747f8d' }} />
        <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.72rem', color: 'text.secondary' }}>
          {members} Members
        </Typography>
      </Box>
    </Box>
  );
}

// ── Project & Experience Detail Page Component ────────────────────────
function ProjectDetailContent({ item, type, language }: {
  item: any;
  type: 'project' | 'experience';
  language: 'en' | 'es' | 'it' | 'fr' | 'de' | 'pt';
}) {
  const { t } = useLanguage();
  
  // Resolve item details
  const name = type === 'project' ? item.name : item.company;
  const link = item.link || '#';
  const isDiscord = 
    item.type === 'discord' || 
    (link && (link.includes('discord.gg') || link.includes('discord.com') || link.includes('discord'))) || 
    !!item.serverId ||
    name.toLowerCase().includes('enginefall') ||
    name.toLowerCase().includes('rules of engagement') ||
    name.toLowerCase().includes('dawnlands');

  const subtitle = type === 'project' 
    ? (isDiscord ? t('project.filter.discord') : t('project.filter.dev')) 
    : getLocalized(item.title, language);
  const description = getLocalized(item.description, language);
  const gameInfo = item.gameInfo ? getLocalized(item.gameInfo, language) : null;
  const members = item.members || null;
  const online = item.online || null;
  const images = item.images || [];
  const skills = item.skills || [];
  const verified = item.verified || false;

  // Steam details helper
  const getSteamDetails = (nameStr: string) => {
    const n = nameStr.toLowerCase();
    if (n.includes('enginefall')) {
      return {
        appId: '2437390',
        reviews: 'Upcoming (2026)',
        critic: 'TBD',
        developer: 'Red Rover Interactive',
        publisher: 'Red Rover Interactive'
      };
    }
    if (n.includes('rules') || n.includes('grey state')) {
      return {
        appId: '3978820',
        reviews: 'Upcoming (2026)',
        critic: 'TBD',
        developer: 'Grey State Studio',
        publisher: 'Tencent Games'
      };
    }
    if (n.includes('dawnlands')) {
      return {
        appId: '2197910',
        reviews: 'Mixed (1,631 reviews)',
        critic: 'N/A',
        developer: 'Seasun Games Pte. Ltd.',
        publisher: 'Seasun Games Pte. Ltd.'
      };
    }
    return null;
  };

  const steam = getSteamDetails(name);

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Header Area */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 4.5, pr: 5 }}>
        {/* Sleek App Icon / Game avatar */}
        <Avatar
          variant="rounded"
          src={item.logo}
          sx={{
            width: 64,
            height: 64,
            borderRadius: '16px',
            bgcolor: item.logo ? 'transparent' : 'primary.main',
            color: 'primary.contrastText',
            fontWeight: 900,
            fontSize: '1.6rem',
            border: item.logo ? 'none' : '1px solid',
            borderColor: 'divider',
            background: item.logo ? 'none' : `linear-gradient(135deg, var(--mui-palette-primary-main) 0%, #1c1921 100%)`,
            boxShadow: item.logo ? '0 4px 16px rgba(0, 0, 0, 0.15)' : 'none'
          }}
        >
          {!item.logo && name.charAt(0)}
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          {/* Top Rank Badge / Tag */}
          {steam && (
            <Chip
              label={name.toLowerCase().includes('engine') ? '⭐ TOP MULTIPLAYER' : '🔥 MOST ANTICIPATED'}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.62rem',
                fontWeight: 'bold',
                borderRadius: '4px',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                mb: 0.8,
                letterSpacing: 0.5
              }}
            />
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="h5" sx={{ fontWeight: 'black', color: 'text.primary' }}>
              {name}
            </Typography>
            {verified && <VerifiedIcon sx={{ color: '#23a55a', fontSize: 20 }} />}
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5, display: 'block', color: 'primary.main' }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>

      {/* Two Column Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.85fr 1.15fr' },
        gap: 4
      }}>
        {/* Left Column (Screenshots & Descriptions) */}
        <Box sx={{ minWidth: 0 }}>
          {/* Screenshot Carousel */}
          {images.length > 0 ? (
            <ImageCarousel images={images} alt={name} />
          ) : (
            <Box sx={{
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: '16px',
              mb: 3,
              background: `linear-gradient(135deg, ${item.languageColor || 'var(--mui-palette-primary-main)'} 0%, #1c1921 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 1.5,
              p: 3,
              position: 'relative',
              overflow: 'hidden',
              border: 1,
              borderColor: 'divider'
            }}>
              <ComputerIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)' }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 900, textAlign: 'center' }}>{name}</Typography>
              {item.language && (
                <Chip label={item.language} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 'bold' }} />
              )}
            </Box>
          )}

          {/* Description Section */}
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ color: 'text.primary', fontSize: '0.88rem', lineHeight: 1.6, mb: 4 }}>
              {description}
            </Typography>
          </Box>
 
          {/* Game Overview Info */}
          {gameInfo && (
            <Box sx={{ mt: 4, p: 2.5, borderRadius: '16px', bgcolor: 'action.hover', border: '1px dashed', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <GameIcon color="primary" sx={{ fontSize: 22 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.primary', fontSize: '0.78rem', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  {t('dialog.game_overview')}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6, fontSize: '0.88rem' }}>
                {gameInfo}
              </Typography>
            </Box>
          )}
 
          {/* Applied Skills */}
          {skills.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary', fontSize: '0.72rem', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                {t('dialog.applied_skills')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {skills.map((skill: string) => (
                  <Chip key={skill} label={skill} size="small" variant="outlined" sx={{ borderRadius: '8px', fontWeight: 'bold', fontSize: '0.65rem' }} />
                ))}
              </Box>
            </Box>
          )}
        </Box>
 
        {/* Right Column (Outbound Buttons, Invite widget, Meta info) */}
        <Box>
          {/* Action Links */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
            {/* Primary Action Button (Visit Web / Server) */}
            <Button
              fullWidth
              variant="contained"
              href={link}
              target="_blank"
              endIcon={<ArrowOutwardIcon />}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 'bold',
                textTransform: 'none',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                boxShadow: '0 4px 14px rgba(var(--mui-palette-primary-mainChannel) / 0.2)'
              }}
            >
              {isDiscord
                ? t('dialog.visit_server')
                : (type === 'experience'
                    ? t('dialog.visit_site')
                    : (name.includes('Designer') ? t('dialog.visit_site') : t('dialog.visit_repo')))}
            </Button>
          </Box>

          {/* Community Invite Box (Discord Server invite theme) */}
          {members && (
            <DiscordServerInvite
              name={`${name} Official`}
              banner={images[0] || ''}
              members={members}
              online={online}
              link={link}
              t={t}
            />
          )}

          {/* Steam / Meta Review Widget */}
          {steam && (
            <Box sx={{
              borderRadius: '16px',
              border: 1,
              borderColor: 'divider',
              p: 2,
              bgcolor: 'rgba(255,255,255,0.02)',
              mb: 3
            }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', mb: 1.5 }}>
                Reviews
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    Steam Reviews
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: steam.reviews.toLowerCase().includes('mixed') ? 'warning.main' : 'success.main' }}>
                    {steam.reviews}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    Metacritic
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {steam.critic}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Details Table */}
          <Box sx={{
            borderRadius: '16px',
            border: 1,
            borderColor: 'divider',
            p: 2,
            bgcolor: 'action.hover'
          }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', mb: 1.5 }}>
              Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              {type === 'experience' && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                      Role
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'right' }}>
                      {getLocalized(item.title, language)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                      Duration
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'right' }}>
                      {`${item.start} — ${getLocalized(item.end, language)}`}
                    </Typography>
                  </Box>
                </>
              )}
              {steam && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                      Developer
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'right' }}>
                      {steam.developer}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                      Publisher
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'right' }}>
                      {steam.publisher}
                    </Typography>
                  </Box>
                </>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  Platform
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'right' }}>
                  {steam ? 'Discord / Steam / PC' : (type === 'project' && item.type === 'dev' ? 'Web / CLI' : 'Discord')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Close Button overlay removed */}
    </Box>
  );
}

// ── Discord Profile Widget ─────────────────────────────────────────────
function DiscordProfile() {
  const [data, setData] = useState<any>(cachedDiscordData);
  const [badges, setBadges] = useState<any[]>(cachedBadges);
  const { t } = useLanguage();
  const DISCORD_ID = '799251427839049818';

  const fetchData = useCallback(async () => {
    // Discord Lanyard
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        cachedDiscordData = json.data;
      }
    } catch (e) { console.error(e); }

    // Fetch badges from dstn.to and equicord.org
    try {
      const resolvedBadges: any[] = [];

      // 1. dstn.to Badges
      try {
        const dstnRes = await fetch(`https://dcdn.dstn.to/profile/${DISCORD_ID}`);
        if (dstnRes.ok) {
          const dstnJson = await dstnRes.json();
          if (dstnJson && dstnJson.badges) {
            dstnJson.badges.forEach((b: any) => {
              resolvedBadges.push({
                id: b.id,
                description: b.description,
                iconUrl: `https://cdn.discordapp.com/badge-icons/${b.icon}.png`,
                link: b.link
              });
            });
          }
        }
      } catch (e) {
        console.error("Failed to fetch dstn.to badges:", e);
      }

      // 2. Equicord Badges
      try {
        const equiRes = await fetch(`https://badges.equicord.org/${DISCORD_ID}`);
        if (equiRes.ok) {
          const equiJson = await equiRes.json();
          if (equiJson && equiJson.badges) {
            const translatorBadge = equiJson.badges.find((b: any) => b.tooltip === 'Equicord Translator');
            if (translatorBadge) {
              resolvedBadges.push({
                id: 'equicord_translator',
                description: translatorBadge.tooltip,
                iconUrl: translatorBadge.badge,
                link: 'https://equicord.org'
              });
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch equicord badges:", e);
      }

      setBadges(resolvedBadges);
      cachedBadges = resolvedBadges;
    } catch (e) {
      console.error("Failed to resolve badges:", e);
    }
  }, [DISCORD_ID]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (!data) {
    return (
      <Card elevation={0} suppressHydrationWarning sx={{
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
    <Card elevation={0} suppressHydrationWarning sx={{
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
      {/* Header: Avatar & Custom Status Speech Bubble */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5, position: 'relative' }}>
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

        {/* Speech Bubble (Custom Status) pointing to Avatar */}
        {(() => {
          const customStatus = data.activities?.find((a: any) => a.type === 4);
          if (!customStatus) return null;
          const emoji = customStatus.emoji;
          return (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
              pl: 0.8,
              pr: 1.5,
              py: 0.6,
              borderRadius: '14px',
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              maxWidth: '220px',
              zIndex: 4,
            }}>
              {emoji && (
                emoji.id ? (
                  <Box
                    component="img"
                    src={`https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`}
                    alt={emoji.name}
                    sx={{ width: 16, height: 16, objectFit: 'contain' }}
                  />
                ) : (
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>{emoji.name}</span>
                )
              )}
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.75rem', lineHeight: 1.2 }}>
                {customStatus.state}
              </Typography>
            </Box>
          );
        })()}
      </Box>

      {/* Profile User Info Column */}
      <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', mb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 0, mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              {user.global_name || user.username}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip
                label={`@${user.username}`}
                size="small"
                sx={{ height: 18, fontSize: '0.65rem', fontWeight: 'bold', borderRadius: '6px', bgcolor: 'action.hover' }}
              />
              <Box sx={{ display: 'flex', gap: 0.3, opacity: 0.5 }}>
                {data.active_on_discord_desktop && <ComputerIcon sx={{ fontSize: 13 }} />}
                {data.active_on_discord_mobile && <SmartphoneIcon sx={{ fontSize: 13 }} />}
                {data.active_on_discord_web && <WebIcon sx={{ fontSize: 13 }} />}
                {data.active_on_discord_vr && <VrIcon sx={{ width: 14, height: 14 }} />}
              </Box>
            </Box>
          </Box>
          <LocalTime />
        </Box>

        {/* Profile Badges Capsule (Discord-style) */}
        {badges && badges.length > 0 && (
          <Box sx={{
            display: 'flex',
            gap: 0.6,
            alignItems: 'center',
            px: 1,
            py: 0.3,
            borderRadius: '8px',
            bgcolor: 'rgba(0, 0, 0, 0.05)',
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.08)',
            alignSelf: 'flex-start',
            boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.03)',
            '[data-mui-color-scheme="dark"] &': {
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05)'
            },
            '.dark &': {
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05)'
            }
          }}>
            {badges.map((badge: any) => (
              <Tooltip key={badge.id} title={badge.description} arrow>
                <Box
                  component="a"
                  href={badge.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    '&:hover': { transform: 'scale(1.2)' }
                  }}
                >
                  <Box
                    component="img"
                    src={badge.iconUrl}
                    alt={badge.description}
                    sx={{ width: 16, height: 16, objectFit: 'contain' }}
                  />
                </Box>
              </Tooltip>
            ))}
          </Box>
        )}
      </Box>

      {/* Body: All Activities */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        {data.activities && data.activities.length > 0 ? (
          data.activities.map((activity: any, idx: number) => {
            // Skip custom status (already shown in speech bubble)
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
  const [isKofiOpen, setIsKofiOpen] = useState(false);


  useEffect(() => {
    hasAnimated = true;
  }, []);

  return (
    <Box sx={{ color: 'text.primary', minHeight: '100vh', position: 'relative', zIndex: 0 }}>
      <ShaderBackground />
      <TopAppBar />

      <Container maxWidth="md" sx={{ mt: { xs: 14, md: 18 } }}>

        {/* HERO SECTION */}
        <motion.div 
          initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={hasAnimated ? { duration: 0 } : { duration: 0.6 }}
        >
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
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400, maxWidth: 600, lineHeight: 1.6 }}>
                <FadeText>
                  {t('hero.subtitle')}
                </FadeText>
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
                <Chip
                  icon={<ArrowOutwardIcon />}
                  label="Ko-fi"
                  onClick={() => setIsKofiOpen(true)}
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
          <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />
            <FadeText inline>{t('section.projects')}</FadeText>
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4, mb: 12 }}>
            {PROJECTS.map((project: any, idx: number) => (
              <ScrollReveal key={project.id} delay={idx * 0.1}>
                <Link
                  href={`/details?id=${project.id}&type=project`}
                  style={{ height: '100%', display: 'block', textDecoration: 'none' }}
                >
                  <Card elevation={0} suppressHydrationWarning sx={{
                    transition: 'all 0.2s',
                    border: 1,
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' },
                    '&:hover img': { transform: 'scale(1.025)' },
                    borderRadius: '24px',
                    overflow: 'hidden',
                    height: '100%',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                  }}>
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                      <Box sx={{ position: 'relative', p: 1.5, pb: 0 }}>
                        <Box sx={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3', position: 'relative', bgcolor: '#0d0d0f' }}>
                          {project.logo ? (
                            <img
                              src={project.logo}
                              alt={`${project.name} logo`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                          ) : project.images && project.images.length > 0 ? (
                            <ProjectImage src={project.images[0]} alt={project.name} />
                          ) : (
                            <Box sx={{
                              width: '100%', height: '100%',
                              background: `linear-gradient(135deg, ${project.languageColor || 'var(--mui-palette-primary-main)'} 0%, #1c1921 100%)`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1.5, p: 2
                            }}>
                              <ComputerIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold', textAlign: 'center' }}>
                                {project.name}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, color: 'text.primary' }}>{project.name}</Typography>
                          {project.verified && <VerifiedIcon color="primary" sx={{ fontSize: 20 }} />}
                          <ArrowOutwardIcon sx={{ ml: 'auto', color: 'primary.main', opacity: 0.7, fontSize: 18 }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <FadeText>
                            {getLocalized(project.description, language)}
                          </FadeText>
                        </Typography>
                      </CardContent>
                    </Box>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </Box>
        </ScrollReveal>

        {/* WORK EXPERIENCE */}
        <ScrollReveal>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
            <FadeText inline>{t('section.experience')}</FadeText>
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 12 }}>
            
            {/* Active Roles Column */}
            <Box>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                <FadeText inline>{t('experience.active')}</FadeText>
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {WORK_EXPERIENCE.filter((job: any) => getLocalized(job.end, language) === t('job.present')).map((job: any, idx: number) => (
                  <ScrollReveal key={job.id} delay={idx * 0.08}>
                    <Link href={`/details?id=${job.id}&type=experience`} style={{ width: '100%', textDecoration: 'none' }}>
                      <Card elevation={0} suppressHydrationWarning sx={{ height: 96, border: 1, borderColor: 'divider', borderRadius: '20px', overflow: 'hidden', transition: 'all 0.2s', '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' } }}>
                        <Box sx={{ height: '100%' }}>
                          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', gap: 2, px: 2.5 }}>
                            <Avatar src={job.logo} sx={{ bgcolor: job.logo ? 'transparent' : 'primary.main', color: 'primary.contrastText', width: 48, height: 48, fontSize: '1.1rem', fontWeight: 'bold' }}>
                              {!job.logo && job.company.charAt(0)}
                            </Avatar>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2, color: 'text.primary' }}>
                                  <FadeText inline>{getLocalized(job.title, language)}</FadeText>
                                </Typography>
                                {job.verified && <VerifiedIcon color="primary" sx={{ fontSize: 16 }} />}
                              </Box>
                              <Typography variant="body2" color="text.secondary">{job.company}</Typography>
                            </Box>
                            <Chip label={`${job.start} — ${getLocalized(job.end, language)}`} size="small" variant="outlined" sx={{ borderRadius: '8px', fontWeight: 'bold', fontSize: '0.7rem', flexShrink: 0 }} />
                          </Box>
                        </Box>
                      </Card>
                    </Link>
                  </ScrollReveal>
                ))}
              </Box>
            </Box>

            {/* Past Roles Column */}
            <Box>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'divider' }} />
                <FadeText inline>{t('experience.past')}</FadeText>
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {WORK_EXPERIENCE.filter((job: any) => getLocalized(job.end, language) !== t('job.present')).map((job: any, idx: number) => (
                  <ScrollReveal key={job.id} delay={idx * 0.08}>
                    <Link href={`/details?id=${job.id}&type=experience`} style={{ width: '100%', textDecoration: 'none' }}>
                      <Card elevation={0} suppressHydrationWarning sx={{ height: 96, border: 1, borderColor: 'divider', borderRadius: '20px', overflow: 'hidden', transition: 'all 0.2s', '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' } }}>
                        <Box sx={{ height: '100%' }}>
                          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', gap: 2, px: 2.5 }}>
                            <Avatar src={job.logo} sx={{ bgcolor: job.logo ? 'transparent' : 'action.hover', color: 'text.secondary', border: job.logo ? 'none' : '1px solid', borderColor: 'divider', width: 48, height: 48, fontSize: '1.1rem', fontWeight: 'bold' }}>
                              {!job.logo && job.company.charAt(0)}
                            </Avatar>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2, color: 'text.primary' }}>
                                  <FadeText inline>{getLocalized(job.title, language)}</FadeText>
                                </Typography>
                                {job.verified && <VerifiedIcon color="primary" sx={{ fontSize: 16 }} />}
                              </Box>
                              <Typography variant="body2" color="text.secondary">{job.company}</Typography>
                            </Box>
                            <Chip label={`${job.start} — ${getLocalized(job.end, language)}`} size="small" variant="outlined" sx={{ borderRadius: '8px', fontWeight: 'bold', fontSize: '0.7rem', flexShrink: 0 }} />
                          </Box>
                        </Box>
                      </Card>
                    </Link>
                  </ScrollReveal>
                ))}
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
      <KofiModal open={isKofiOpen} onClose={() => setIsKofiOpen(false)} />
    </Box>
  );
}
