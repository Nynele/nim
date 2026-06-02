'use client';
import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Chip,
  Avatar,
  Box,
  useColorScheme,
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
  ArrowOutward as ArrowOutwardIcon,
  Computer as ComputerIcon,
  Translate as TranslateIcon,
  Groups as GroupsIcon,
  SportsEsports as GameIcon,
} from '@mui/icons-material';

import { LocalizedString } from './data';
import { useLanguage } from './language-context';

// ── Helpers ────────────────────────────────────────────────────────────
export const getLocalized = (val: LocalizedString, lang: 'en' | 'es' | 'it' | 'fr' | 'de' | 'pt') => {
  if (typeof val === 'string') return val;
  return val[lang];
};

// ── Theme Switch ───────────────────────────────────────────────────────
function ThemeSwitch() {
  const { mode, setMode } = useColorScheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const icons: Record<string, React.ReactNode> = {
    light: <LightModeIcon fontSize="small" />,
    dark: <DarkModeIcon fontSize="small" />,
    system: <SystemModeIcon fontSize="small" />,
  };

  return (
    <>
      <Tooltip title="Theme">
        <Button
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ minWidth: 36, px: 1, borderRadius: '12px', color: 'text.secondary' }}
        >
          {icons[mode || 'system']}
        </Button>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { borderRadius: '16px', border: 1, borderColor: 'divider' } } }}>
        {['light', 'dark', 'system'].map((m) => (
          <MenuItem key={m} selected={mode === m}
            onClick={() => { setMode(m as any); setAnchorEl(null); }}
            sx={{ borderRadius: '8px', mx: 0.5, gap: 1.5, fontSize: '0.875rem' }}>
            {icons[m]}{m.charAt(0).toUpperCase() + m.slice(1)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// ── Language Switch ────────────────────────────────────────────────────
function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const langs = ['en', 'es', 'it', 'fr', 'de', 'pt'] as const;

  return (
    <>
      <Tooltip title="Language">
        <Button
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ minWidth: 36, px: 1, borderRadius: '12px', color: 'text.secondary', gap: 0.5, fontSize: '0.75rem', fontWeight: 'bold' }}
        >
          <TranslateIcon fontSize="small" />
          {language.toUpperCase()}
        </Button>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { borderRadius: '16px', border: 1, borderColor: 'divider' } } }}>
        {langs.map((lang) => (
          <MenuItem key={lang} selected={language === lang}
            onClick={() => { setLanguage(lang); setAnchorEl(null); }}
            sx={{ borderRadius: '8px', mx: 0.5, fontSize: '0.875rem', fontWeight: language === lang ? 'bold' : 'normal' }}>
            {lang.toUpperCase()}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// ── Top App Bar ────────────────────────────────────────────────────────
export function TopAppBar() {
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

// ── Project Image with error fallback ─────────────────────────────────
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

// ── Discord Server Invite Widget ───────────────────────────────────────
function DiscordServerInvite({ members, online }: { name: string; banner: string; members: string; online?: string; link: string; t: any }) {
  const onlineCount = online
    ? online
    : (() => {
        const memberNum = parseInt(members.replace(/[^0-9]/g, '')) || 10000;
        const count = Math.floor(memberNum * 0.12);
        return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '+';
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
      '[data-mui-color-scheme="light"] &': { bgcolor: 'rgba(0, 0, 0, 0.03)' },
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

// ── Project & Experience Detail Page Component ─────────────────────────
export function ProjectDetailContent({ item, type, language }: {
  item: any;
  type: 'project' | 'experience';
  language: 'en' | 'es' | 'it' | 'fr' | 'de' | 'pt';
}) {
  const { t } = useLanguage();

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

  const getSteamDetails = (nameStr: string) => {
    const n = nameStr.toLowerCase();
    if (n.includes('enginefall')) {
      return { appId: '2437390', reviews: 'Upcoming (2026)', critic: 'TBD', developer: 'Red Rover Interactive', publisher: 'Red Rover Interactive' };
    }
    if (n.includes('rules') || n.includes('grey state')) {
      return { appId: '3978820', reviews: 'Upcoming (2026)', critic: 'TBD', developer: 'Grey State Studio', publisher: 'Tencent Games' };
    }
    if (n.includes('dawnlands')) {
      return { appId: '2197910', reviews: 'Mixed (1,631 reviews)', critic: 'N/A', developer: 'Seasun Games Pte. Ltd.', publisher: 'Seasun Games Pte. Ltd.' };
    }
    return null;
  };

  const steam = getSteamDetails(name);

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Header Area */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 4.5, pr: 5 }}>
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
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.85fr 1.15fr' }, gap: 4 }}>
        {/* Left Column */}
        <Box sx={{ minWidth: 0 }}>
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

          <Box sx={{ mt: 3 }}>
            <Typography sx={{ color: 'text.primary', fontSize: '0.88rem', lineHeight: 1.6, mb: 4 }}>
              {description}
            </Typography>
          </Box>

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

        {/* Right Column */}
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
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

          {steam && (
            <Box sx={{ borderRadius: '16px', border: 1, borderColor: 'divider', p: 2, bgcolor: 'rgba(255,255,255,0.02)', mb: 3 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', mb: 1.5 }}>
                Reviews
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>Steam Reviews</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: steam.reviews.toLowerCase().includes('mixed') ? 'warning.main' : 'success.main' }}>
                    {steam.reviews}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>Metacritic</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{steam.critic}</Typography>
                </Box>
              </Box>
            </Box>
          )}

          <Box sx={{ borderRadius: '16px', border: 1, borderColor: 'divider', p: 2, bgcolor: 'action.hover' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', mb: 1.5 }}>
              Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              {type === 'experience' && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>Role</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'right' }}>
                      {getLocalized(item.title, language)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>Duration</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'right' }}>
                      {`${item.start} — ${getLocalized(item.end, language)}`}
                    </Typography>
                  </Box>
                </>
              )}
              {steam && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>Developer</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'right' }}>{steam.developer}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>Publisher</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'right' }}>{steam.publisher}</Typography>
                  </Box>
                </>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>Platform</Typography>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'right' }}>
                  {steam ? 'Discord / Steam / PC' : (type === 'project' && item.type === 'dev' ? 'Web / CLI' : 'Discord')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
