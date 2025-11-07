"use client";

import * as React from 'react';
import Link from 'next/link';
import { Box, Button, Container, Stack, Typography } from '@mui/material';

export function LandingFinalCTA(): React.JSX.Element {
  return (
    <Box
      component="section"
      id="resources"
      sx={{
        py: { xs: 10, md: 14 },
        background: 'linear-gradient(140deg, rgba(11, 110, 253, 0.82), rgba(18, 184, 134, 0.86))',
        color: 'common.white',
        boxShadow: '0 32px 60px rgba(5, 15, 36, 0.45)',
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Ready to put your strategy to the test?
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: 600 }}>
            Join thousands of traders mastering the markets the smart way. Launch your UpTrade dashboard in seconds and start executing simulated trades with confidence.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <Button
              component={Link}
              href="/dashboard/usa"
              size="large"
              variant="contained"
              sx={{
                px: 4.5,
                borderRadius: 999,
                background: 'linear-gradient(135deg, #0B6EFD, #12B886)',
                color: 'common.white',
                boxShadow: '0 20px 42px rgba(11, 110, 253, 0.38)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0A5ED1, #0FA672)',
                  boxShadow: '0 26px 46px rgba(15, 166, 114, 0.42)',
                },
              }}
            >
              Start Trading for Free
            </Button>
            <Button
              component={Link}
              href="/dashboard/usa"
              size="large"
              variant="outlined"
              sx={{
                borderRadius: 999,
                color: 'rgba(255,255,255,0.88)',
                borderColor: 'rgba(255,255,255,0.7)',
                px: 4.5,
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.95)',
                  color: 'common.white',
                  backgroundColor: 'rgba(5, 15, 32, 0.18)',
                },
              }}
            >
              Explore the Dashboard
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
