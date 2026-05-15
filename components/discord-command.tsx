'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface DiscordCommandProps {
  command: string;
  description: string;
  args?: { name: string; type: string; required?: boolean }[];
}

export default function DiscordCommand({ command, description, args }: DiscordCommandProps) {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 0.5,
      p: 2,
      bgcolor: '#2b2d31',
      borderRadius: '12px',
      border: 1,
      borderColor: 'rgba(255,255,255,0.05)',
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: '#313338',
        borderColor: 'primary.main',
        transform: 'translateX(8px)'
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ 
          color: '#00a8fc', // Discord Command Blue
          fontWeight: 700,
          fontSize: '1.1rem',
          fontFamily: 'monospace'
        }}>
          /{command}
        </Typography>
        {args?.map((arg, i) => (
          <Box key={i} sx={{ 
            bgcolor: '#1e1f22', 
            px: 1, 
            py: 0.2, 
            borderRadius: '4px',
            border: 1,
            borderColor: 'rgba(255,255,255,0.1)'
          }}>
            <Typography sx={{ 
              color: '#b5bac1', 
              fontSize: '0.8rem',
              fontFamily: 'monospace'
            }}>
              {arg.name}
              {arg.required && <span style={{ color: '#f23f43' }}>*</span>}
            </Typography>
          </Box>
        ))}
      </Box>
      <Typography sx={{ color: '#dbdee1', fontSize: '0.9rem', opacity: 0.8 }}>
        {description}
      </Typography>
    </Box>
  );
}
