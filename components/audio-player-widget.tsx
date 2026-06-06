'use client';

import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography, Tooltip, Menu, MenuItem, Slider } from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  SkipNext as NextIcon,
  SkipPrevious as PrevIcon,
  MusicNote as MusicIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as VolumeOffIcon,
  GraphicEq as EquallizerIcon,
  KeyboardDoubleArrowRight as CollapseIcon
} from '@mui/icons-material';
import { AudioManager } from '../lib/audio-manager';
import { useLanguage } from '../app/language-context';

export default function AudioPlayerWidget() {
  const { t, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [artistText, setArtistText] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [volume, setVolumeState] = useState(80);
  const [prevVolume, setPrevVolume] = useState(80);
  const [coverError, setCoverError] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [prevDiscordTrack, setPrevDiscordTrack] = useState<{ title: string; artist: string; coverUrl: string | null; youtubeVideoId: string | null } | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setCoverError(false);
  }, [currentTrackIndex, youtubeVideoId]);

  useEffect(() => {
    setMounted(true);
    const manager = AudioManager.getInstance();
    
    // Load collapsed state from localStorage
    const savedCollapsed = localStorage.getItem('portfolio_music_player_collapsed');
    if (savedCollapsed === 'true') {
      setIsCollapsed(true);
    }
    
    // Subscribe to player state changes
    const unsubscribe = manager.subscribe(() => {
      setIsPlaying(manager.isPlaying);
      setCurrentTrackIndex(manager.currentTrackIndex);
      setYoutubeVideoId(manager.youtubeVideoId);
      setArtistText(manager.tracks[manager.currentTrackIndex]?.artist ?? '');
      setVolumeState(manager.volume);
      setPrevDiscordTrack(manager.previousDiscordTrack);
    });

    // Sync initial state
    setIsPlaying(manager.isPlaying);
    setCurrentTrackIndex(manager.currentTrackIndex);
    setYoutubeVideoId(manager.youtubeVideoId);
    setArtistText(manager.tracks[manager.currentTrackIndex]?.artist ?? '');
    setVolumeState(manager.volume);
    setPrevDiscordTrack(manager.previousDiscordTrack);

    // Sync Discord presence on mount if live track is selected
    if (manager.currentTrackIndex === 0) {
      manager.syncDiscordMusic(true);
    }

    return () => unsubscribe();
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('portfolio_music_player_collapsed', String(next));
      return next;
    });
  };

  useEffect(() => {
    if (isPlaying) {
      setHasPlayed(true);
    }
  }, [isPlaying]);

  // Sync translated labels into AudioManager whenever language changes
  useEffect(() => {
    const manager = AudioManager.getInstance();
    manager.setLabels({
      syncing:         t('audio.status.syncing'),
      connecting:      t('audio.status.connecting'),
      searchingAlt:    (n: number) => t('audio.status.searching_alt').replace('{n}', String(n)),
      searching:       (title: string) => t('audio.status.searching').replace('{title}', title),
      ytmSynced:       t('audio.status.ytm_synced'),
      ytmAlt:          (n: number) => t('audio.status.ytm_alt').replace('{n}', String(n)),
      spotifySynced:   t('audio.status.spotify_synced'),
      spotifyAlt:      (n: number) => t('audio.status.spotify_alt').replace('{n}', String(n)),
      albumSynced:     t('audio.status.album_synced'),
      albumAlt:        (n: number) => t('audio.status.album_alt').replace('{n}', String(n)),
      noMusicTitle:    t('audio.status.no_music_title'),
      noMusicArtist:   t('audio.status.no_music_artist'),
      searchFailed:    t('audio.status.search_failed'),
      syncErrorTitle:  t('audio.status.sync_error_title'),
      syncErrorArtist: t('audio.status.sync_error_artist'),
    });
  }, [language, t]);


  if (!mounted) return null;

  const manager = AudioManager.getInstance();

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    manager.togglePlay();
  };

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    manager.nextTrack();
  };

  const handlePrevTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    manager.prevTrack();
  };

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectTrack = (idx: number) => {
    manager.setTrack(idx);
    handleCloseMenu();
  };

  const handleVolumeChange = (e: Event, newValue: number | number[]) => {
    const vol = newValue as number;
    setVolumeState(vol);
    manager.setVolume(vol);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (volume > 0) {
      setPrevVolume(volume);
      setVolumeState(0);
      manager.setVolume(0);
    } else {
      const targetVol = prevVolume > 0 ? prevVolume : 80;
      setVolumeState(targetVol);
      manager.setVolume(targetVol);
    }
  };

  const formatTrackProgress = (current: number, total: number) => {
    return t('audio.track_progress')
      .replace('{current}', String(current))
      .replace('{total}', String(total));
  };

  const getTrackCover = (track: any, idx: number) => {
    if (idx === 0 && manager.currentTrackIndex === 0) {
      return manager.coverUrl || null;
    }
    if (track?.coverUrl) return track.coverUrl;
    if (track?.youtubeVideoId) {
      return `https://img.youtube.com/vi/${track.youtubeVideoId}/hqdefault.jpg`;
    }
    return null;
  };

  const currentTrack = manager.tracks[currentTrackIndex];
  const nextTrackIndex = (currentTrackIndex + 1) % manager.tracks.length;
  const nextTrack = manager.tracks.length > 1 ? manager.tracks[nextTrackIndex] : null;

  const isLiveTrack = currentTrack?.id === 'live';
  const showPreviousTrack = isLiveTrack && prevDiscordTrack !== null;
  const showNextTrack = !isLiveTrack && nextTrack !== null;
  const showTopPanel = showPreviousTrack || showNextTrack;

  return (
    <Box
      suppressHydrationWarning
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.75,
        pointerEvents: 'none',
        transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        '&:hover': {
          transform: isCollapsed ? 'none' : 'translateY(-2px)'
        },
        '&:hover .player-card': {
          borderColor: isCollapsed ? 'divider' : 'primary.main',
        }
      }}
    >
      {/* Unified Attached Top Panel */}
      {showTopPanel && (
        <Box
          className="player-card"
          sx={{
            alignSelf: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.6,
            borderRadius: '16px',
            bgcolor: 'rgba(var(--mui-palette-background-paperChannel) / 0.75)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: 1,
            borderColor: 'divider',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            pointerEvents: (isCollapsed || !isPlaying) ? 'none' : 'auto',
            zIndex: 1,
            position: 'relative',
            transform: isCollapsed 
              ? 'translateX(calc(100% + 24px))' 
              : (isPlaying ? 'translateY(0)' : 'translateY(calc(100% + 6px))'),
            opacity: isCollapsed ? 0 : (isPlaying ? 1 : 0),
            transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
          }}
        >
          {showNextTrack && nextTrack && (
            <>
              <Box 
                component="img"
                src={getTrackCover(nextTrack, nextTrackIndex) || undefined}
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '6px',
                  objectFit: 'cover',
                  bgcolor: 'action.selected',
                  border: 1,
                  borderColor: 'divider'
                }}
                onError={(e: any) => {
                  e.target.style.display = 'none';
                }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 160 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 800, 
                    fontSize: '0.6rem', 
                    color: 'primary.main', 
                    textTransform: 'uppercase', 
                    letterSpacing: 0.8,
                    lineHeight: 1
                  }}
                >
                  {language === 'es' ? 'Siguiente pista' : 'Next Track'}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 700, 
                    fontSize: '0.68rem', 
                    color: 'text.primary',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    mt: 0.1
                  }}
                >
                  {nextTrack.title}
                </Typography>
              </Box>
            </>
          )}

          {showPreviousTrack && prevDiscordTrack && (
            <>
              <Box 
                component="img"
                src={prevDiscordTrack.coverUrl || undefined}
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '6px',
                  objectFit: 'cover',
                  bgcolor: 'action.selected',
                  border: 1,
                  borderColor: 'divider'
                }}
                onError={(e: any) => {
                  e.target.style.display = 'none';
                }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 160 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 800, 
                    fontSize: '0.55rem', 
                    color: 'primary.main', 
                    textTransform: 'uppercase', 
                    letterSpacing: 0.8,
                    lineHeight: 1
                  }}
                >
                  {t('audio.previously_played')}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 700, 
                    fontSize: '0.68rem', 
                    color: 'text.primary',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    mt: 0.1,
                    lineHeight: 1.1
                  }}
                >
                  {prevDiscordTrack.title}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 500, 
                    fontSize: '0.6rem', 
                    color: 'text.secondary',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1
                  }}
                >
                  {prevDiscordTrack.artist}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      )}

      {/* Main Player Widget */}
      <Box
        className="player-card"
        suppressHydrationWarning
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.75,
          borderRadius: '30px',
          bgcolor: 'rgba(var(--mui-palette-background-paperChannel) / 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: 1,
          borderColor: 'divider',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          transform: isCollapsed ? 'translateX(calc(100% + 24px))' : 'translateX(0)',
          opacity: isCollapsed ? 0 : 1,
          pointerEvents: isCollapsed ? 'none' : 'auto',
          transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          zIndex: 2,
          position: 'relative'
        }}
      >
        {/* Equalizer / Album Cover */}
        <Tooltip title={t('audio.select_track')} arrow>
          <IconButton 
            onClick={handleOpenMenu}
            size="small"
            sx={{ 
              p: 0,
              width: 30,
              height: 30,
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              bgcolor: 'action.selected',
              color: isPlaying ? 'primary.main' : 'text.secondary',
              '&::after': isPlaying ? {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: isPlaying && getTrackCover(currentTrack, currentTrackIndex) && !coverError ? '50%' : '8px',
                border: '2px solid var(--mui-palette-primary-main)',
                animation: 'ripple 1.5s infinite ease-in-out',
                '@keyframes ripple': {
                  '0%': { transform: 'scale(0.8)', opacity: 1 },
                  '100%': { transform: 'scale(1.3)', opacity: 0 }
                }
              } : {}
            }}
          >
            {getTrackCover(currentTrack, currentTrackIndex) && !coverError ? (
              <Box 
                component="img"
                src={getTrackCover(currentTrack, currentTrackIndex) || undefined}
                onError={() => setCoverError(true)}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: isPlaying ? '50%' : '8px',
                  transition: 'all 0.5s ease',
                  animation: isPlaying ? 'spin 12s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }}
              />
            ) : (
              isPlaying ? (
                <EquallizerIcon 
                  sx={{ 
                    fontSize: 20,
                    animation: 'pulse 1.2s infinite ease-in-out',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.15)' }
                    }
                  }} 
                />
              ) : (
                <MusicIcon sx={{ fontSize: 20 }} />
              )
            )}
          </IconButton>
        </Tooltip>

        {/* Track Info */}
        <Box sx={{ maxWidth: { xs: 120, sm: 180 }, minWidth: 60, display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="caption" 
            sx={{ 
              fontWeight: 800, 
              fontSize: '0.65rem', 
              color: 'primary.main', 
              letterSpacing: 0.3, 
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {youtubeVideoId 
              ? (currentTrack.id === 'live' ? artistText : currentTrack.artist)
              : (isPlaying ? t('audio.lofi_background') : t('audio.status.no_music_artist'))
            }
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              fontWeight: 700, 
              color: 'text.primary', 
              fontSize: '0.7rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              mt: -0.2
            }}
          >
            {youtubeVideoId 
              ? currentTrack.title 
              : (isPlaying ? t('audio.playing_lofi') : t('audio.status.no_music_title'))
            }
          </Typography>
          {manager.tracks.length > 1 && (
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 600, 
                color: 'text.secondary', 
                fontSize: '0.6rem',
                mt: 0.1
              }}
            >
              {formatTrackProgress(currentTrackIndex + 1, manager.tracks.length)}
            </Typography>
          )}
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, borderLeft: 1, borderColor: 'divider', pl: 1 }}>
          {/* Previous Button */}
          {manager.tracks.length > 1 && (
            <Tooltip title={language === 'es' ? 'Pista anterior' : 'Previous track'} arrow>
              <IconButton 
                onClick={handlePrevTrack} 
                size="small" 
                sx={{ 
                  p: 0.4,
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.2)',
                    color: 'primary.main'
                  }
                }}
              >
                <PrevIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title={isPlaying ? t('audio.pause') : `${t('audio.play')} - ${currentTrack.title}`} arrow>
            <IconButton 
              onClick={handleTogglePlay} 
              size="small" 
              sx={{ 
                p: 0.4,
                color: 'text.primary',
                bgcolor: isPlaying ? 'rgba(var(--mui-palette-primary-mainChannel) / 0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.2)',
                  color: 'primary.main'
                }
              }}
            >
              {isPlaying ? <PauseIcon sx={{ fontSize: 18 }} /> : <PlayIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Tooltip>

          {manager.tracks.length > 1 && (
            <Tooltip title={language === 'es' ? 'Siguiente pista' : 'Next track'} arrow>
              <IconButton 
                onClick={handleNextTrack} 
                size="small" 
                sx={{ 
                  p: 0.4,
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.2)',
                    color: 'primary.main'
                  }
                }}
              >
                <NextIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}

          {/* Volume Control */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              ml: 0.5, 
              gap: 0.5,
              '&:hover .volume-slider-container': {
                width: '50px',
                opacity: 1,
                ml: 0.5
              }
            }}
          >
            <Tooltip title={volume === 0 ? (language === 'es' ? 'Activar sonido' : 'Unmute') : (language === 'es' ? 'Silenciar' : 'Mute')} arrow>
              <IconButton
                size="small"
                onClick={handleToggleMute}
                sx={{ p: 0.4, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                {volume === 0 ? <VolumeOffIcon sx={{ fontSize: 18 }} /> : <VolumeIcon sx={{ fontSize: 18 }} />}
              </IconButton>
            </Tooltip>
            <Box
              className="volume-slider-container"
              sx={{
                width: '0px',
                opacity: 0,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                transition: 'width 0.3s ease, opacity 0.2s ease, margin 0.3s ease'
              }}
            >
              <Slider
                size="small"
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
                min={0}
                max={100}
                sx={{
                  width: 50,
                  color: 'primary.main',
                  '& .MuiSlider-thumb': {
                    width: 8,
                    height: 8,
                    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                    '&:before': {
                      boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                    },
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: `0px 0px 0px 8px rgba(var(--mui-palette-primary-mainChannel) / 0.16)`,
                    },
                    '&.Mui-active': {
                      width: 12,
                      height: 12,
                    },
                  },
                  '& .MuiSlider-rail': {
                    opacity: 0.28,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Collapse Button */}
          <Tooltip title={t('audio.collapse')} arrow>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapse();
              }}
              size="small"
              sx={{
                p: 0.4,
                color: 'text.secondary',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.2)',
                  color: 'primary.main',
                  transform: 'scale(1.05)'
                },
                '&:hover .collapse-arrow': {
                  transform: 'translateX(2px)'
                }
              }}
            >
              <CollapseIcon 
                className="collapse-arrow" 
                sx={{ 
                  fontSize: 18, 
                  transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)' 
                }} 
              />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Floating Expand Handle */}
      <Tooltip title={t('audio.expand')} arrow>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            toggleCollapse();
          }}
          size="medium"
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'rgba(var(--mui-palette-background-paperChannel) / 0.7)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: 1,
            borderColor: 'divider',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            color: isPlaying ? 'primary.main' : 'text.secondary',
            transform: isCollapsed ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(180deg)',
            opacity: isCollapsed ? 1 : 0,
            pointerEvents: isCollapsed ? 'auto' : 'none',
            transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              bgcolor: 'rgba(var(--mui-palette-background-paperChannel) / 0.85)',
              transform: isCollapsed ? 'scale(1.08) rotate(0deg)' : 'scale(0) rotate(180deg)',
              borderColor: 'primary.main'
            },
            '&::after': isPlaying ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid var(--mui-palette-primary-main)',
              animation: 'ripple 1.5s infinite ease-in-out',
              '@keyframes ripple': {
                '0%': { transform: 'scale(0.8)', opacity: 1 },
                '100%': { transform: 'scale(1.3)', opacity: 0 }
              }
            } : {}
          }}
        >
          {isPlaying ? (
            <EquallizerIcon 
              sx={{ 
                fontSize: 20,
                animation: 'pulse 1.2s infinite ease-in-out',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.15)' }
                }
              }} 
            />
          ) : (
            <MusicIcon sx={{ fontSize: 20 }} />
          )}
        </IconButton>
      </Tooltip>

      {/* Track Selection Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        disableScrollLock
        transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              borderRadius: '20px',
              mb: 1.5,
              minWidth: 240,
              p: 1,
              overflow: 'visible',
              filter: 'drop-shadow(0px 8px 24px rgba(0,0,0,0.15))',
              border: 1,
              borderColor: 'divider',
              bgcolor: 'rgba(var(--mui-palette-background-paperChannel) / 0.85)',
              backdropFilter: 'blur(20px)',
              '& .MuiList-root': {
                p: 0,
              },
            }
          }
        }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider', mb: 1 }}>
          <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: 1 }}>
            {t('audio.live_sync_menu')}
          </Typography>
        </Box>
        <MenuItem
          onClick={() => {
            manager.syncDiscordMusic(false);
            handleCloseMenu();
          }}
          sx={{
            borderRadius: '12px',
            mb: 0.5,
            py: 1,
            px: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'action.hover',
              transform: 'scale(1.02)'
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {t('audio.force_refresh')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
              {t('audio.force_refresh_desc')}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem
          onClick={() => {
            manager.resetSearchOffset();
            handleCloseMenu();
          }}
          sx={{
            borderRadius: '12px',
            mb: 0,
            py: 1,
            px: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'action.hover',
              transform: 'scale(1.02)'
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {t('audio.reset_search')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
              {t('audio.reset_search_desc')}
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      {/* Hidden YouTube Player Iframe */}
      {youtubeVideoId && hasPlayed && (
        <iframe
          id="yt-player"
          key={youtubeVideoId}
          width="0"
          height="0"
          src={`https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&autoplay=1&controls=0&mute=0`}
          title="YouTube Player"
          frameBorder="0"
          allow="autoplay"
          style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
          onLoad={() => {
            const iframe = document.getElementById('yt-player') as HTMLIFrameElement;
            iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [volume] }), '*');
          }}
        />
      )}
    </Box>
  );
}
