'use client';

import React from 'react';
import { Dialog, DialogContent, IconButton, Box, Zoom } from '@mui/material';
import { Close as CloseIcon, Launch as LaunchIcon } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';

interface KofiModalProps {
  open: boolean;
  onClose: () => void;
}

// MIUI 6 / Google springy zoom transition on enter, clean fast exit
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { in?: boolean; children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  const isEntering = props.in;
  return (
    <Zoom
      ref={ref}
      {...props}
      style={{
        transformOrigin: 'center center',
        transitionTimingFunction: isEntering
          ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Springy bounce curve on enter (MIUI 6/Material)
          : 'cubic-bezier(0.25, 1, 0.5, 1)',   // Smooth ease-out on exit (no bounce)
        ...props.style,
      }}
      timeout={{
        enter: 450,
        exit: 220, // Faster, clean fade-out on close
      }}
    />
  );
});

export default function KofiModal({ open, onClose }: KofiModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      disableScrollLock
      slots={{ transition: Transition }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(20px) saturate(180%)', // Apple glass backdrop blur
            backgroundColor: 'rgba(0, 0, 0, 0.55)', // Dimmed overlay
          },
        },
        paper: {
          sx: {
            borderRadius: '24px',
            bgcolor: 'rgba(255, 255, 255, 0.9)', // Apple Frosted Glass white
            backdropFilter: 'blur(20px) saturate(180%)',
            overflow: 'visible',
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            height: '650px',
            maxHeight: '85vh',
            m: 2,
            boxShadow: '0 24px 64px -12px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.4)', // White glass outline
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {/* Frosted Glass Floating Open in New Tab Button */}
      <IconButton
        component="a"
        href="https://ko-fi.com/nynele"
        target="_blank"
        aria-label="open in new tab"
        sx={{
          position: 'absolute',
          right: 50,
          top: -46,
          color: '#ffffff',
          zIndex: 10,
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px) saturate(180%)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.25)',
            borderColor: 'rgba(255, 255, 255, 0.35)',
            transform: 'scale(1.08)',
          },
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <LaunchIcon />
      </IconButton>

      {/* Frosted Glass Floating Close Button */}
      <IconButton
        onClick={onClose}
        aria-label="close"
        sx={{
          position: 'absolute',
          right: 0,
          top: -46,
          color: '#ffffff',
          zIndex: 10,
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px) saturate(180%)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.25)',
            borderColor: 'rgba(255, 255, 255, 0.35)',
            transform: 'scale(1.08)',
          },
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '24px' }}>
        <Box sx={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
          <iframe
            src="https://ko-fi.com/nynele/?hidefeed=true&widget=true&embed=true"
            style={{ 
              width: '100%', 
              height: '100%', 
              border: 'none', 
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 0,
              borderRadius: '24px',
            }}
            title="Ko-fi Donation Widget"
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
