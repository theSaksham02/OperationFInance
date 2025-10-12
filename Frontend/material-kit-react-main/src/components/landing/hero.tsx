"use client";

import * as React from 'react';
import Link from 'next/link';
import { Box, Button, Container, Stack, Typography } from '@mui/material';

const HERO_BG_OPACITY = 0.85;

export function LandingHero(): React.JSX.Element {
  return (
    <Box
      component="section"
      sx={(theme) => ({
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      })}
    >
      <Box
        component="video"
        autoPlay
        loop
        muted
        playsInline
        src="/assets/Hero_Page.mp4"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 0.45,
          filter: 'contrast(1.15) saturate(1.1)',
        }}
      />
      <Box
        sx={() => ({
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(145deg, rgba(15, 27, 45, ${HERO_BG_OPACITY + 0.05}), rgba(19, 78, 72, ${HERO_BG_OPACITY}))`,
          zIndex: 1,
        })}
      />
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 3 }}>
        <Stack spacing={4} textAlign="center" alignItems="center">
          <Typography variant="h2" component="h1" sx={{ fontWeight: 700 }}>
            Master the Markets, Risk-Free.
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: 640 }}>
            The ultimate paper trading platform for US and Indian markets. Practice with $100,000 in virtual cash.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <Button
              component={Link}
              href="/dashboard/usa"
              size="large"
              variant="contained"
              color="primary"
              sx={{ px: 4, borderRadius: 999 }}
            >
              Start Trading for Free
            </Button>
            <Button
              component={Link}
              href="/dashboard/usa"
              size="large"
              variant="outlined"
              color="inherit"
              sx={{ borderRadius: 999, color: 'common.white', borderColor: 'rgba(255,255,255,0.6)' }}
            >
              Go to Dashboard
            </Button>
          </Stack>
        </Stack>
      </Container>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top left, rgba(148, 163, 254, 0.25), transparent 55%), radial-gradient(circle at bottom right, rgba(15, 183, 159, 0.35), transparent 45%)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          opacity: HERO_BG_OPACITY,
          zIndex: 2,
        }}
      />
    </Box>
  );
}
