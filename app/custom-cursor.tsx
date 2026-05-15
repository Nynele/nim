'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { Box } from '@mui/material';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth movement springs
  const springConfig = { damping: 20, stiffness: 250, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const innerX = useSpring(mouseX, { damping: 30, stiffness: 800 });
  const innerY = useSpring(mouseY, { damping: 30, stiffness: 800 });

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();

    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('.MuiCardActionArea-root') ||
        target.closest('.MuiChip-root') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovering(!!isInteractive);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mouseover', handleHover);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 60 : 32,
            height: isHovering ? 60 : 32,
            opacity: isHovering ? 0.3 : 0.5,
            border: isHovering ? '1px solid var(--mui-palette-primary-main)' : '1px solid var(--mui-palette-text-primary)',
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          style={{
            borderRadius: '50%',
            backgroundColor: isHovering ? 'var(--mui-palette-primary-main)' : 'transparent',
          }}
        />
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: innerX,
          y: innerY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 10000,
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 0.5 : 1,
            backgroundColor: 'var(--mui-palette-primary-main)',
          }}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
          }}
        />
      </motion.div>
    </>
  );
}
