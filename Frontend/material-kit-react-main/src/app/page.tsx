"use client";

import * as React from 'react';
import { Box } from '@mui/material';

import {
  LandingFeatures,
  LandingFinalCTA,
  LandingFooter,
  LandingHeader,
  LandingHero,
  LandingTicker,
  LandingUserTiers,
} from '@/components/landing';

export default function Page(): React.JSX.Element {
  return (
    <Box sx={{ backgroundColor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingTicker />
        <LandingFeatures />
        <LandingUserTiers />
        <LandingFinalCTA />
      </main>
      <LandingFooter />
    </Box>
  );
}
