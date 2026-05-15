'use client';

import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordMessageProps {
  authorName: string;
  authorAvatar: string;
  isBot?: boolean;
  tagText?: string;
  timestamp?: string;
  content?: string;
  embeds?: {
    color?: string;
    title?: string;
    description?: string;
    fields?: DiscordEmbedField[];
    footer?: string;
    image?: string;
    imageAspectRatio?: string;
    footerImage?: string;
    thumbnail?: string;
    author?: { name: string; icon?: string };
  }[];
  buttons?: { label: string; color?: 'primary' | 'secondary' | 'success' | 'danger' | 'gray'; icon?: React.ReactNode }[];
}

// Helper to render basic Discord markdown (**bold**, `code`)
const renderDiscordMarkdown = (text: string) => {
  if (!text) return null;

  // Split by code blocks first
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const codeText = part.slice(1, -1);
      return (
        <Box key={i} component="span" sx={{
          fontFamily: 'monospace',
          bgcolor: '#202225',
          color: '#00aff4', // Blue-ish code text like in the image
          px: 0.8,
          py: 0.3,
          borderRadius: '4px',
          fontSize: '0.9em',
          display: 'block', // To match the block-like appearance in the image
          my: 1,
          border: '1px solid rgba(0,0,0,0.2)',
          lineHeight: 1.5,
        }}>
          {codeText}
        </Box>
      );
    }

    // Handle bold in the non-code parts
    const subParts = part.split(/(\*\*[^*]+\*\*)/g);
    return subParts.map((subPart, j) => {
      if (subPart.startsWith('**') && subPart.endsWith('**')) {
        return (
          <Box key={`${i}-${j}`} component="span" sx={{ fontWeight: 700, color: '#f2f3f5' }}>
            {subPart.slice(2, -2)}
          </Box>
        );
      }
      return subPart;
    });
  });
};

export default function DiscordMessage({
  authorName,
  authorAvatar,
  isBot = true,
  tagText = 'BOT',
  timestamp = 'Today at 1:43 PM',
  content,
  embeds,
  buttons,
}: DiscordMessageProps) {
  return (
    <Box sx={{
      display: 'flex',
      gap: 2,
      p: 2,
      bgcolor: '#313338', // Discord Chat Background
      borderRadius: '8px',
      color: '#dbdee1',
      fontFamily: 'gg sans, "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
      textAlign: 'left',
      width: '100%',
      maxWidth: 600,
      mx: 'auto',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    }}>
      <Avatar src={authorAvatar} sx={{ width: 40, height: 40 }} />
      
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography sx={{ fontWeight: 600, color: '#f2f3f5', fontSize: '1rem' }}>
            {authorName}
          </Typography>
          {isBot && (
            <Box sx={{
              bgcolor: '#5865f2',
              color: 'white',
              fontSize: '0.625rem',
              fontWeight: 700,
              px: 0.6,
              py: 0.1,
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: 0.2
            }}>
              {tagText === 'BOT' && <Box component="span" sx={{ fontSize: '0.8rem', mt: -0.2 }}>✓</Box>} {tagText}
            </Box>
          )}
          <Typography sx={{ fontSize: '0.75rem', color: '#949ba4' }}>
            {timestamp}
          </Typography>
        </Box>

        {content && (
          <Typography sx={{ fontSize: '1rem', lineHeight: 1.375, mb: 1, whiteSpace: 'pre-wrap' }}>
            {renderDiscordMarkdown(content)}
          </Typography>
        )}

        {embeds && embeds.map((embed, index) => (
          <Box key={index} sx={{
            mt: 1,
            p: 1.5,
            bgcolor: '#2b2d31', // Discord Embed Background
            borderRadius: '4px',
            borderLeft: `4px solid ${embed.color || '#1e1f22'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            maxWidth: 520,
            position: 'relative',
          }}>
            {embed.author && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                {embed.author.icon && <Avatar src={embed.author.icon} sx={{ width: 24, height: 24 }} />}
                <Typography sx={{ fontWeight: 600, color: '#f2f3f5', fontSize: '0.875rem' }}>
                  {embed.author.name}
                </Typography>
              </Box>
            )}
            {embed.title && (
              <Typography sx={{ fontWeight: 600, color: '#f2f3f5', fontSize: '1rem' }}>
                {embed.title}
              </Typography>
            )}
            {embed.description && (
              <Typography sx={{ 
                fontSize: '0.875rem', 
                lineHeight: 1.3, 
                color: '#dbdee1',
                whiteSpace: 'pre-wrap',
              }}>
                {renderDiscordMarkdown(embed.description)}
              </Typography>
            )}
            
            {embed.fields && (
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '16px 0', // Spacing between rows
                mt: 1,
                width: '100%'
              }}>
                {embed.fields.map((field, i) => (
                  <Box key={i} sx={{ 
                    width: field.inline ? '50%' : '100%', 
                    pr: field.inline ? 1 : 0,
                    boxSizing: 'border-box'
                  }}>
                    <Typography sx={{ fontWeight: 600, color: '#f2f3f5', fontSize: '0.875rem', mb: 0.2 }}>
                      {field.name}
                    </Typography>
                    <Box sx={{ 
                      borderLeft: '2px solid #6d6f78', // Discord-style quote border
                      pl: 1, 
                      ml: 0.2,
                    }}>
                      <Typography sx={{ fontSize: '0.8125rem', color: '#dbdee1', lineHeight: 1.3 }}>
                        {renderDiscordMarkdown(field.value)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {embed.image && (
              <Box sx={{
                mt: 1,
                borderRadius: '8px',
                overflow: 'hidden',
                width: '100%',
                aspectRatio: embed.imageAspectRatio,
              }}>
                <Box
                  component="img"
                  src={embed.image}
                  sx={{
                    width: '100%',
                    display: 'block',
                    ...(embed.imageAspectRatio ? { height: '100%', objectFit: 'cover' } : {}),
                  }}
                />
              </Box>
            )}

            {embed.footerImage && (
              <Box sx={{
                mt: 1.5,
                mb: 1,
                width: '100%',
                height: '12px', // Slightly taller for the barra
                overflow: 'hidden'
              }}>
                <Box component="img" src={embed.footerImage} sx={{ width: '100%', height: '100%', objectFit: 'fill' }} />
              </Box>
            )}

            {embed.footer && (
              <Typography sx={{ fontSize: '0.75rem', color: '#949ba4', mt: 1 }}>
                {embed.footer}
              </Typography>
            )}

            {embed.thumbnail && (
              <Box sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 80,
                height: 80,
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <Box component="img" src={embed.thumbnail} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            )}
          </Box>
        ))}

        {buttons && (
          <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
            {buttons.map((btn, i) => {
              const colors = {
                danger: { bg: '#da373c', hover: '#a12828' },
                success: { bg: '#248046', hover: '#1a6334' },
                primary: { bg: '#5865f2', hover: '#4752c4' },
                secondary: { bg: '#4e5058', hover: '#6d6f78' },
                gray: { bg: '#4e5058', hover: '#6d6f78' },
              };
              const color = colors[btn.color || 'gray'];
              return (
                <Box key={i} sx={{
                  bgcolor: color.bg,
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: '3px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  '&:hover': { bgcolor: color.hover }
                }}>
                  {btn.label}
                  {btn.icon}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ── Discord Profile Component ───────────────────────────────────────────

interface DiscordProfileProps {
  name: string;
  username: string;
  avatar: string;
  banner: string;
  bio: string;
  customStatus?: string;
  badges?: React.ReactNode[];
}

export function DiscordProfile({ name, username, avatar, banner, bio, customStatus, badges }: DiscordProfileProps) {
  return (
    <Box sx={{
      width: 340,
      bgcolor: '#111214', // Discord Profile Background
      borderRadius: '8px',
      overflow: 'hidden',
      color: '#f2f3f5',
      fontFamily: 'gg sans, "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
      boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
      textAlign: 'left'
    }}>
      {/* Banner */}
      <Box sx={{
        height: 120,
        width: '100%',
        backgroundImage: `url(${banner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }} />

      {/* Profile Content */}
      <Box sx={{ p: '16px', pt: 0, position: 'relative' }}>
        {/* Avatar */}
        <Box sx={{
          position: 'relative',
          mt: -5,
          mb: 1,
        }}>
          <Avatar 
            src={avatar} 
            sx={{ 
              width: 94, 
              height: 94, 
              border: '6px solid #111214',
              bgcolor: '#111214'
            }} 
          />
          <Box sx={{
            position: 'absolute',
            bottom: 6,
            right: 0,
            width: 24,
            height: 24,
            bgcolor: '#23a559', // Online status
            borderRadius: '50%',
            border: '4px solid #111214'
          }} />
        </Box>

        {/* Info */}
        <Box sx={{ bgcolor: '#1e1f22', borderRadius: '8px', p: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#fff' }}>
            {name}
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: '#dbdee1', mb: 1 }}>
            {username}
          </Typography>

          {customStatus && (
            <Typography sx={{ fontSize: '0.875rem', color: '#dbdee1', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {customStatus}
            </Typography>
          )}

          <Box sx={{ height: '1px', bgcolor: '#35363c', my: 1.5 }} />

          <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: '#f2f3f5', mb: 0.5 }}>
            About Me
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: '#dbdee1', whiteSpace: 'pre-wrap' }}>
            {bio}
          </Typography>

          {badges && badges.length > 0 && (
            <>
              <Box sx={{ height: '1px', bgcolor: '#35363c', my: 1.5 }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                {badges}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
