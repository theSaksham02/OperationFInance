"use client";

import * as React from 'react';
import { Box, Card, CardContent, Container, Stack, Typography } from '@mui/material';
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
    <Box component="section" sx={{ py: { xs: 10, md: 14 }, backgroundColor: 'background.level1' }}>
      <Container maxWidth="lg">
        <Stack spacing={3} textAlign="center" alignItems="center" sx={{ mb: 6 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 2 }}>
            Learning Modes
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Grow from first trade to fearless execution
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 720 }}>
            TradeSphere adapts to your level with curated challenges, personalized feedback, and unlockable analytics as you progress.
          </Typography>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="center" alignItems="stretch">
          {tiers.map((tier) => (
            <Card
              key={tier.title}
              sx={(theme: Theme) => ({
                flex: 1,
                background: `linear-gradient(180deg, ${theme.palette.background.level1}, ${theme.palette.background.level2})`,
                border: 1,
                borderColor: `${theme.palette[tier.accent].main}40`,
                boxShadow: '0 18px 36px rgba(29, 41, 57, 0.16)',
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
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {tier.subtitle}
                  </Typography>
                  <Stack spacing={1.5} sx={{ mt: 2 }}>
                    {tier.bullets.map((bullet) => (
                      <Typography key={bullet} variant="body2" sx={{ color: 'text.secondary' }}>
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
