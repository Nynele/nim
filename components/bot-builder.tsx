'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Avatar, Button, Stack, Chip } from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { DiscordProfile } from './discord-message';

export default function BotBuilder() {
  const [name, setName] = useState('My Custom Bot');
  const [bio, setBio] = useState('I am a professional Discord bot tailored to your community needs.');
  const [avatar, setAvatar] = useState('https://cdn.discordapp.com/avatars/1355258099052580954/f50ad806b7e50b78c531ecb7e470535f.webp?size=1024');
  const [banner, setBanner] = useState('https://cdn.discordapp.com/banners/1355258099052580954/f10377ef69ce43fa5605d27b43588a12.webp?size=1024');
  const [tags, setTags] = useState(['Custom', 'Security', 'Fast']);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatar(url);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', lg: 'row' },
      gap: 4,
      width: '100%',
      maxWidth: 1000,
      mx: 'auto',
      p: { xs: 2, md: 4 },
      bgcolor: '#2b2d31', // Discord Dashboard Background
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.05)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
      textAlign: 'left'
    }}>
      {/* Settings Form */}
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ color: '#dbdee1', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', mb: 1 }}>
          App Icon
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={avatar} 
              sx={{ width: 100, height: 100, cursor: 'pointer', '&:hover': { opacity: 0.8 } }} 
            />
            <Box sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              bgcolor: '#5865f2',
              borderRadius: '50%',
              p: 0.5,
              display: 'flex',
              border: '4px solid #2b2d31'
            }}>
              <PhotoCameraIcon sx={{ fontSize: '1rem', color: '#fff' }} />
            </Box>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Button size="small" sx={{ color: '#00aff4', textTransform: 'none', fontWeight: 600 }}>Remove</Button>
          </Box>
        </Box>

        <Stack spacing={3}>
          <Box>
            <Typography sx={{ color: '#dbdee1', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', mb: 1 }}>
              Name
            </Typography>
            <TextField
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="standard"
              slotProps={{
                input: {
                  disableUnderline: true,
                  sx: {
                    bgcolor: '#1e1f22',
                    color: '#fff',
                    p: '10px 14px',
                    borderRadius: '4px',
                    border: '1px solid rgba(0,0,0,0.3)',
                    '&.Mui-focused': { border: '1px solid #5865f2' }
                  }
                }
              }}
            />
          </Box>

          <Box>
            <Typography sx={{ color: '#dbdee1', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', mb: 1 }}>
              Description (Maximum 400 characters)
            </Typography>
            <Typography sx={{ color: '#949ba4', fontSize: '0.8125rem', mb: 1 }}>
              Your description will appear in the About Me section of your bot's profile.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              variant="standard"
              slotProps={{
                input: {
                  disableUnderline: true,
                  sx: {
                    bgcolor: '#1e1f22',
                    color: '#fff',
                    p: '10px 14px',
                    borderRadius: '4px',
                    border: '1px solid rgba(0,0,0,0.3)',
                    '&.Mui-focused': { border: '1px solid #5865f2' }
                  }
                }
              }}
            />
          </Box>

          <Box>
            <Typography sx={{ color: '#dbdee1', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', mb: 1 }}>
              Tags (Maximum 5)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {tags.map((tag, i) => (
                <Chip 
                  key={i} 
                  label={tag} 
                  onDelete={() => setTags(tags.filter((_, index) => index !== i))}
                  sx={{ bgcolor: '#1e1f22', color: '#fff', '& .MuiChip-deleteIcon': { color: '#dbdee1' } }} 
                />
              ))}
            </Box>
            <TextField
              fullWidth
              placeholder="Add up to 5 tags..."
              variant="standard"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tags.length < 5) {
                  const target = e.target as HTMLInputElement;
                  if (target.value.trim()) {
                    setTags([...tags, target.value.trim()]);
                    target.value = '';
                  }
                }
              }}
              slotProps={{
                input: {
                  disableUnderline: true,
                  sx: {
                    bgcolor: '#1e1f22',
                    color: '#fff',
                    p: '10px 14px',
                    borderRadius: '4px',
                    border: '1px solid rgba(0,0,0,0.3)',
                  }
                }
              }}
            />
          </Box>
        </Stack>
      </Box>

      {/* Live Preview */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#232428', // Slightly darker preview background
        p: 4,
        borderRadius: '12px',
        border: '1px solid rgba(0,0,0,0.2)'
      }}>
        <Typography sx={{ color: '#dbdee1', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', mb: 3 }}>
          Live Profile Preview
        </Typography>
        <DiscordProfile
          name={name}
          username={name.toLowerCase().replace(/\s+/g, '_')}
          avatar={avatar}
          banner={banner}
          bio={bio}
          customStatus="🛡️ Custom Bot System"
        />
        <Typography sx={{ mt: 3, color: '#949ba4', fontSize: '0.8125rem', fontStyle: 'italic' }}>
          This is how your custom brand will look in Discord.
        </Typography>
      </Box>
    </Box>
  );
}
