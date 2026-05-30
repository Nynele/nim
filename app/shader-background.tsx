'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme, useColorScheme } from '@mui/material';
import { Box } from '@mui/material';
import { AudioManager } from '../lib/audio-manager';

// --- Helpers ---
function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  const num = parseInt(
    cleanHex.length === 3
      ? cleanHex.split('').map((char) => char + char).join('')
      : cleanHex,
    16
  );
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

// GLSL Shaders
const VS_SOURCE = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Advanced recursive domain warping shader with soft mouse hover glow
const FS_SOURCE = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec3 u_color_bg;
  uniform vec3 u_color_primary;
  uniform vec3 u_color_secondary;
  uniform float u_audio_bass;
  uniform float u_audio_treble;

  // GLSL procedural noise functions
  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f); // Cubic Hermite interpolation

    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
  }

  // 4-Octave Fractal Brownian Motion
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate octaves to eliminate grid alignment artifacts
    mat2 rot = mat2(0.87758, 0.47942, -0.47942, 0.87758);
    for (int i = 0; i < 4; ++i) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    // Time factor for speed
    float t = u_time * 0.04;

    // Coordinates scaling for procedural fluid
    vec2 p = st * 2.5;

    // 1st layer of recursive domain warping
    vec2 q = vec2(0.0);
    q.x = fbm(p + vec2(0.0, 0.0) + t);
    q.y = fbm(p + vec2(5.2, 1.3) + t);

    // 2nd layer of warping
    vec2 r = vec2(0.0);
    r.x = fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.3);
    r.y = fbm(p + 3.0 * q + vec2(8.3, 2.8) + t * 0.9);

    // Final warped noise value
    float f = fbm(p + 3.0 * r);

    // Blend background, primary, and secondary colors
    // Creates a fluid nebula/paint mixing effect
    vec3 col = mix(u_color_bg, u_color_primary, clamp(f * 1.3, 0.0, 1.0));
    col = mix(col, u_color_secondary, clamp(length(q), 0.0, 1.0) * 0.55);

    // Dynamic glowing edge threads (like glowing network fibres)
    float edge = abs(q.x - r.y);
    col += u_color_primary * smoothstep(0.2, 0.0, edge) * (0.08 + u_audio_bass * 0.35);

    // Add extra glowing light around cursor position (soft and subtle)
    if (u_mouse.x != -1000.0) {
      vec2 mouse_st = u_mouse / u_resolution.xy;
      mouse_st.x *= u_resolution.x / u_resolution.y;
      float mouse_dist = distance(st, mouse_st);
      float glow = smoothstep(0.45, 0.0, mouse_dist);
      col += u_color_primary * glow * (0.08 + u_audio_treble * 0.30);
    }

    // Apply soft vignette to center the user focus on the main content card
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
    vignette = clamp(pow(16.0 * vignette, 0.35), 0.0, 1.0);
    col = mix(u_color_bg, col, vignette * 0.85);

    gl_FragColor = vec4(col, 1.0);
  }
`;

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number; // 3D depth layer (0.5 to 1.5)
  radius: number;
  baseAlpha: number;
  pulseOffset: number;
}

export default function ShaderBackground() {
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const { mode } = useColorScheme();
  const [activeMode, setActiveMode] = useState<'light' | 'dark'>('dark');
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctxCanvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse coordinate refs for render loops (avoiding re-renders)
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const isMobileRef = useRef(false);

  // Audio LERP refs to smooth spiky beat updates
  const smoothedBassRef = useRef(0.12);
  const smoothedMidRef = useRef(0.18);
  const smoothedTrebleRef = useRef(0.22);
  const smoothedIntensityRef = useRef(0.18);

  // Set mounted on client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Track and resolve theme mode changes (system, dark, light)
  useEffect(() => {
    if (!mounted) return;

    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setActiveMode(mediaQuery.matches ? 'dark' : 'light');

      const handler = (e: MediaQueryListEvent) => {
        setActiveMode(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else if (mode === 'light' || mode === 'dark') {
      setActiveMode(mode);
    }
  }, [mode, mounted]);

  const isDark = activeMode === 'dark';

  // Theme palettes mappings from theme.ts
  const colorsConfig = {
    light: {
      bg: '#FEF7FF',
      primary: '#6750A4',
      secondary: '#625B71',
    },
    dark: {
      bg: '#141218',
      primary: '#D0BCFF',
      secondary: '#CCC2DC',
    },
  };

  const currentColors = colorsConfig[activeMode];

  useEffect(() => {
    if (!mounted) return;

    // Convert hex color values to normalized RGB for GLSL
    const colorBg = hexToRgb(currentColors.bg);

    // Determine if user device is mobile
    const checkMobile = () => {
      isMobileRef.current = window.matchMedia('(pointer: coarse)').matches;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Mouse move tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Canvas size handler
    const resizeCanvases = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // WebGL Background: low res (scaled up via CSS bilinear filter for smooth aura and low memory/GPU overhead)
      const glCanvas = glCanvasRef.current;
      if (glCanvas) {
        // Set to 1/3 of the viewport for the perfect liquid glass blur and top performance
        glCanvas.width = Math.max(10, Math.floor(w / 3));
        glCanvas.height = Math.max(10, Math.floor(h / 3));
      }

      // Constellation Canvas: high res for sharp points and lines
      const ctxCanvas = ctxCanvasRef.current;
      if (ctxCanvas) {
        ctxCanvas.width = w * (window.devicePixelRatio || 1);
        ctxCanvas.height = h * (window.devicePixelRatio || 1);
      }
    };
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);

    // --- WebGL Setup ---
    const glCanvas = glCanvasRef.current;
    let gl = glCanvas?.getContext('webgl', { alpha: false, depth: false, antialias: false });
    let program: WebGLProgram | null = null;
    let positionBuffer: WebGLBuffer | null = null;

    if (gl) {
      // Create Shaders
      const vs = gl.createShader(gl.VERTEX_SHADER);
      const fs = gl.createShader(gl.FRAGMENT_SHADER);
      if (vs && fs) {
        gl.shaderSource(vs, VS_SOURCE);
        gl.compileShader(vs);
        gl.shaderSource(fs, FS_SOURCE);
        gl.compileShader(fs);

        // Create WebGL program
        program = gl.createProgram();
        if (program) {
          gl.attachShader(program, vs);
          gl.attachShader(program, fs);
          gl.linkProgram(program);
          gl.useProgram(program);

          // Full-screen Quad Buffer
          positionBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
          );

          const posAttr = gl.getAttribLocation(program, 'position');
          gl.enableVertexAttribArray(posAttr);
          gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
        }
      }
    }

    // --- 2D Constellation Node Setup (3D Parallax Depth) ---
    const nodes: Node[] = [];
    const maxNodes = isMobileRef.current ? 25 : 55;
    const connectionDist = 130;

    const generateNodes = () => {
      nodes.length = 0;
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < maxNodes; i++) {
        // z represents depth: 0.5 (far background) to 1.5 (close foreground)
        const z = Math.random() * 1.0 + 0.5;
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3 * (z * 0.8), // Foreground nodes drift faster
          vy: (Math.random() - 0.5) * 0.3 * (z * 0.8),
          z: z,
          radius: (Math.random() * 1.0 + 0.8) * z, // Foreground nodes are larger
          baseAlpha: (Math.random() * 0.12 + 0.08) * z, // Foreground nodes are opaque
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    };
    generateNodes();

    let animationFrameId: number;
    let accumulatedTime = 0;
    let lastTime = Date.now();

    // Render loop
    const render = () => {
      const now = Date.now();
      const delta = (now - lastTime) * 0.001;
      lastTime = now;

      const manager = AudioManager.getInstance();
      const isPlaying = manager.isPlaying;

      // Fetch real-time frequency analysis data
      const audioData = manager.getAudioData();

      // Exponential smoothing (LERP) to prevent spiky beat visual jitters
      const easeFactor = 0.12;
      smoothedBassRef.current += (audioData.bass - smoothedBassRef.current) * easeFactor;
      smoothedMidRef.current += (audioData.mid - smoothedMidRef.current) * easeFactor;
      smoothedTrebleRef.current += (audioData.treble - smoothedTrebleRef.current) * easeFactor;
      smoothedIntensityRef.current += (audioData.intensity - smoothedIntensityRef.current) * easeFactor;

      const smoothBass = smoothedBassRef.current;
      const smoothMid = smoothedMidRef.current;
      const smoothTreble = smoothedTrebleRef.current;
      const smoothIntensity = smoothedIntensityRef.current;

      // Fluid speeds up with sound volume (intensity), and drifts slowly when paused
      const speedMultiplier = isPlaying ? (0.6 + smoothIntensity * 2.2) : 0.25;
      accumulatedTime += delta * speedMultiplier;

      // Read active theme primary/secondary colors from CSS variables dynamically
      let activePrimary = currentColors.primary;
      let activeSecondary = currentColors.secondary;
      if (typeof window !== 'undefined') {
        const rootStyle = getComputedStyle(document.documentElement);
        const pVal = rootStyle.getPropertyValue('--mui-palette-primary-main').trim();
        const sVal = rootStyle.getPropertyValue('--mui-palette-secondary-main').trim();
        if (pVal.startsWith('#')) activePrimary = pVal;
        if (sVal.startsWith('#')) activeSecondary = sVal;
      }

      const colorPrimary = hexToRgb(activePrimary);
      const colorSecondary = hexToRgb(activeSecondary);

      const w = window.innerWidth;
      const h = window.innerHeight;

      // Smooth mouse interpolation (LERP)
      const mouse = mouseRef.current;
      if (mouse.targetX !== -1000) {
        if (mouse.x === -1000) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.08;
          mouse.y += (mouse.targetY - mouse.y) * 0.08;
        }
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      // 1. Render WebGL Fluid Background
      if (gl && program && glCanvasRef.current) {
        const glW = glCanvasRef.current.width;
        const glH = glCanvasRef.current.height;
        gl.viewport(0, 0, glW, glH);

        gl.useProgram(program);

        // Upload Uniforms
        gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), glW, glH);
        gl.uniform1f(gl.getUniformLocation(program, 'u_time'), accumulatedTime);
        gl.uniform1f(gl.getUniformLocation(program, 'u_audio_bass'), smoothBass);
        gl.uniform1f(gl.getUniformLocation(program, 'u_audio_treble'), smoothTreble);
        
        // Scale mouse position to WebGL low-res canvas coordinate system
        const scaleX = glW / w;
        const scaleY = glH / h;
        // Invert Y axis for WebGL viewport coordinates
        const glMouseY = mouse.y !== -1000 ? h - mouse.y : -1000;
        gl.uniform2f(
          gl.getUniformLocation(program, 'u_mouse'),
          mouse.x !== -1000 ? mouse.x * scaleX : -1000,
          mouse.y !== -1000 ? glMouseY * scaleY : -1000
        );

        gl.uniform3f(gl.getUniformLocation(program, 'u_color_bg'), colorBg[0], colorBg[1], colorBg[2]);
        gl.uniform3f(gl.getUniformLocation(program, 'u_color_primary'), colorPrimary[0], colorPrimary[1], colorPrimary[2]);
        gl.uniform3f(gl.getUniformLocation(program, 'u_color_secondary'), colorSecondary[0], colorSecondary[1], colorSecondary[2]);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      // 2. Render Constellation Nodes
      const ctxCanvas = ctxCanvasRef.current;
      const ctx = ctxCanvas?.getContext('2d');
      if (ctx && ctxCanvas) {
        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, ctxCanvas.width, ctxCanvas.height);
        ctx.save();
        ctx.scale(dpr, dpr);

        // Update & Draw Nodes
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];

          // Slow floating motion scales with low frequencies (bass), drifts slowly when paused
          const nodeSpeedFactor = isPlaying ? (0.6 + smoothBass * 1.8) : 0.20;
          n.x += n.vx * nodeSpeedFactor;
          n.y += n.vy * nodeSpeedFactor;

          // Boundary wrap/bounce
          if (n.x < -10) n.x = w + 10;
          if (n.x > w + 10) n.x = -10;
          if (n.y < -10) n.y = h + 10;
          if (n.y > h + 10) n.y = -10;

          // Mouse gravity interaction (gentle repulsion scales with depth z)
          if (mouse.x !== -1000) {
            const dx = n.x - mouse.x; // Direction away from mouse
            const dy = n.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Repel nodes if they are within mouse aura
            if (dist < 180 && dist > 1) {
              const force = (180 - dist) * 0.00045 * (n.z * 1.1);
              n.x += (dx / dist) * force;
              n.y += (dy / dist) * force;
            }
          }

          // Node alpha modulation near mouse
          let alpha = n.baseAlpha;
          if (mouse.x !== -1000) {
            const dx = mouse.x - n.x;
            const dy = mouse.y - n.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              alpha = n.baseAlpha + (0.9 - n.baseAlpha) * (1.0 - dist / 150) * 0.5;
            }
          }

          // Pulsing glow factor boosted by mid frequencies
          const audioPulse = smoothMid * 2.2;
          const pulse = (Math.sin(accumulatedTime * 2.2 + n.pulseOffset) * 0.45 + 0.55) * (1.0 + audioPulse);

          // Draw pulsing outer glow circle
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * (2.0 + pulse * 1.5), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colorPrimary[0] * 255}, ${colorPrimary[1] * 255}, ${colorPrimary[2] * 255}, ${alpha * 0.18 * pulse})`;
          ctx.fill();

          // Draw sharp inner node point (radius pulses with high frequencies)
          const activeRadius = n.radius * (1.0 + smoothTreble * 0.5);
          ctx.beginPath();
          ctx.arc(n.x, n.y, activeRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colorPrimary[0] * 255}, ${colorPrimary[1] * 255}, ${colorPrimary[2] * 255}, ${alpha})`;
          ctx.fill();
        }

        // Draw Lines
        ctx.lineWidth = 0.6;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const n1 = nodes[i];
            const n2 = nodes[j];
            const dx = n1.x - n2.x;
            const dy = n1.y - n2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Connect if close in viewport coordinates
            if (dist < connectionDist) {
              const avgZ = (n1.z + n2.z) * 0.5;
              const alphaFactor = 1.0 - dist / connectionDist;
              
              // Base line opacity
              const opacity = isDark
                ? alphaFactor * 0.15 * (avgZ * 0.8)
                : alphaFactor * 0.08 * (avgZ * 0.6);

              // Boost connections on beat
              const activeOpacity = opacity * (1.0 + smoothBass * 4.0);

              ctx.lineWidth = 0.5 * avgZ * (1.0 + smoothMid * 1.8);
              ctx.beginPath();
              ctx.moveTo(n1.x, n1.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.strokeStyle = `rgba(${colorPrimary[0] * 255}, ${colorPrimary[1] * 255}, ${colorPrimary[2] * 255}, ${activeOpacity})`;
              ctx.stroke();
            }
          }
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Cleanup resources on unmount
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resizeCanvases);
      cancelAnimationFrame(animationFrameId);

      if (gl) {
        if (positionBuffer) gl.deleteBuffer(positionBuffer);
        if (program) gl.deleteProgram(program);
      }
    };
  }, [mounted, currentColors.bg, currentColors.primary, currentColors.secondary, isDark]);

  if (!mounted) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
        bgcolor: 'background.default',
      }}
    >
      {/* GL Canvas: Low-res fluid background, stretched and filtered */}
      <canvas
        ref={glCanvasRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'block',
          imageRendering: 'auto', // Ensures smooth bilinear scaling
          opacity: 0.92,
        }}
      />
      {/* 2D Canvas: High-res interactive constellation network */}
      <canvas
        ref={ctxCanvasRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'block',
        }}
      />
    </Box>
  );
}
