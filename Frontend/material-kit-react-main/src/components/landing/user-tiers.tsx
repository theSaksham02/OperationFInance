"use client";

import * as React from 'react';
import { Box, Card, CardContent, Container, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

interface TierDefinition {
  title: string;
  subtitle: string;
  bullets: string[];
  accent: 'primary' | 'success' | 'warning';
}

const tiers: TierDefinition[] = [
  {
    title: 'Basic',
    subtitle: 'Build your foundation',
    bullets: ['Guided tutorials', 'Simple order types', 'Daily progress tips'],
    accent: 'primary',
  },
  {
    title: 'Intermediate',
    subtitle: 'Level up your strategy',
    bullets: ['Advanced order controls', 'Risk management drills', 'Sector rotation challenges'],
    accent: 'success',
  },
  {
    title: 'Advanced',
    subtitle: 'Trade like a professional',
    bullets: ['Derivatives and options', 'Macro and multi-leg trades', 'Performance benchmarking'],
    accent: 'warning',
  },
];

export function LandingUserTiers(): React.JSX.Element {
  return (
    <Box
      component="section"
      id="pricing"
      sx={{
        py: { xs: 10, md: 14 },
        background: 'linear-gradient(180deg, rgba(3, 7, 18, 0.9) 0%, rgba(2, 5, 14, 0.75) 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3} textAlign="center" alignItems="center" sx={{ mb: 6 }}>
          <Typography variant="overline" sx={{ color: 'rgba(159, 179, 217, 0.8)', letterSpacing: 3 }}>
            Learning Modes
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}>
            Grow from first trade to fearless execution
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(204, 212, 234, 0.7)', maxWidth: 720 }}>
            UpTrade adapts to your level with curated challenges, personalized feedback, and unlockable analytics as you progress.
          </Typography>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="center" alignItems="stretch">
          {tiers.map((tier) => (
            <Card
              key={tier.title}
              sx={(theme: Theme) => ({
                flex: 1,
                background: 'linear-gradient(165deg, rgba(7, 16, 36, 0.88), rgba(4, 10, 24, 0.72))',
                border: 1,
                borderColor: alpha(theme.palette[tier.accent].main, 0.28),
                boxShadow: '0 26px 52px rgba(2, 6, 18, 0.42)',
                backdropFilter: 'blur(8px)',
              })}
            >
              <CardContent>
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <Typography
                    variant="subtitle2"
                    sx={(theme: Theme) => ({
                      color: theme.palette[tier.accent].main,
                      fontWeight: 700,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                    })}
                  >
                    {tier.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>
                    {tier.subtitle}
                  </Typography>
                  <Stack spacing={1.5} sx={{ mt: 2 }}>
                    {tier.bullets.map((bullet) => (
                      <Typography key={bullet} variant="body2" sx={{ color: 'rgba(197, 207, 230, 0.68)' }}>
                        {bullet}
                      </Typography>
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
