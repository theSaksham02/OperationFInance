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
    <Box
      sx={{
        background: 'linear-gradient(180deg, #04070F 0%, #050310 55%, #03020A 100%)',
        color: 'common.white',
        minHeight: '100vh',
      }}
    >
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
