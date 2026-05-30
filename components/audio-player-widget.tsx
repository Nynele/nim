'use client';

import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography, Tooltip, Menu, MenuItem } from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  SkipNext as NextIcon,
  MusicNote as MusicIcon,
  VolumeUp as VolumeIcon,
  GraphicEq as EquallizerIcon
} from '@mui/icons-material';
import { AudioManager } from '../lib/audio-manager';
import { useLanguage } from '../app/language-context';

export default function AudioPlayerWidget() {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const manager = AudioManager.getInstance();
    
    // Subscribe to player state changes
    const unsubscribe = manager.subscribe(() => {
      setIsPlaying(manager.isPlaying);
      setCurrentTrackIndex(manager.currentTrackIndex);
      setYoutubeVideoId(manager.youtubeVideoId);
    });

    // Sync initial state
    setIsPlaying(manager.isPlaying);
    setCurrentTrackIndex(manager.currentTrackIndex);
    setYoutubeVideoId(manager.youtubeVideoId);

    // Sync Discord presence on mount if live track is selected
    if (manager.currentTrackIndex === 0) {
      manager.syncDiscordMusic(true);
    }

    return () => unsubscribe();
  }, []);

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

  const currentTrack = manager.tracks[currentTrackIndex];

  return (
    <Box
      suppressHydrationWarning
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1,
        borderRadius: '30px',
        bgcolor: 'rgba(var(--mui-palette-background-paperChannel) / 0.7)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: 1,
        borderColor: 'divider',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 12px 40px rgba(var(--mui-palette-primary-mainChannel) / 0.2)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      {/* Equalizer / Music Icon */}
      <Tooltip title="Select Track" arrow>
        <IconButton 
          onClick={handleOpenMenu}
          size="small"
          sx={{ 
            color: isPlaying ? 'primary.main' : 'text.secondary',
            position: 'relative',
            '&::after': isPlaying ? {
              content: '""',
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid var(--mui-palette-primary-main)',
              animation: 'ripple 1.5s infinite ease-in-out',
              '@keyframes ripple': {
                '0%': { transform: 'scale(0.8)', opacity: 1 },
                '100%': { transform: 'scale(1.5)', opacity: 0 }
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

      {/* Track Info */}
      <Box sx={{ maxWidth: { xs: 120, sm: 180 }, minWidth: 60, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="caption" 
          sx={{ 
            fontWeight: 800, 
            fontSize: '0.7rem', 
            color: 'primary.main', 
            letterSpacing: 0.5, 
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {currentTrack.id === 'live' ? currentTrack.artist : (isPlaying ? 'Playing Lo-Fi' : 'Lo-Fi Background')}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            fontWeight: 700, 
            color: 'text.primary', 
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            mt: -0.3
          }}
        >
          {currentTrack.title}
        </Typography>
      </Box>

      {/* Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, borderLeft: 1, borderColor: 'divider', pl: 1 }}>
        <Tooltip title={isPlaying ? 'Pause' : 'Play Lo-Fi Ambient'} arrow>
          <IconButton 
            onClick={handleTogglePlay} 
            size="small" 
            sx={{ 
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
      </Box>

      {/* Track Selection Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              borderRadius: '20px',
              mb: 1.5,
              minWidth: 220,
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
            Live Sync Menu
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
              Force Refresh Sync
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
              Re-fetch active Discord presence
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
              Reset Video Search
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
              Reset to first search result
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      {/* Hidden YouTube Player Iframe */}
      {currentTrack.id === 'live' && youtubeVideoId && (
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
        />
      )}
    </Box>
  );
}
