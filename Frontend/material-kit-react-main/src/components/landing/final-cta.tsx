"use client";

import * as React from 'react';
import Link from 'next/link';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import type { Theme } from '@mui/material/styles';

export function LandingFinalCTA(): React.JSX.Element {
  return (
    <Box
      component="section"
      sx={(theme: Theme) => ({
        py: { xs: 10, md: 14 },
        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.success.dark})`,
        color: theme.palette.common.white,
      })}
    >
      <Container maxWidth="md">
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Ready to put your strategy to the test?
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: 600 }}>
            Join thousands of traders mastering the markets the smart way. Launch your TradeSphere dashboard in seconds and start executing simulated trades with confidence.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <Button component={Link} href="/auth/sign-up" size="large" variant="contained" color="primary" sx={{ px: 4, borderRadius: 999 }}>
              Start Trading for Free
            </Button>
            <Button component={Link} href="/dashboard" size="large" variant="outlined" color="inherit" sx={{ borderRadius: 999, color: 'common.white', borderColor: 'rgba(255,255,255,0.6)' }}>
              Explore the Dashboard
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
