"use client";

import * as React from 'react';
import { Box, Card, CardContent, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { ChartLineUp, GlobeHemisphereEast, Lightning, PresentationChart } from '@phosphor-icons/react/dist/ssr';

interface FeatureDefinition {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const featureItems: FeatureDefinition[] = [
  {
    icon: <GlobeHemisphereEast size={32} weight="fill" />,
    title: 'Multi-Market Access',
    description: 'Trade US (NYSE, NASDAQ) and Indian (NSE, BSE) markets from a single workspace.',
  },
  {
    icon: <PresentationChart size={32} weight="fill" />,
    title: 'All Asset Classes',
    description: 'Simulate stocks, ETFs, commodities, bonds, and advanced derivatives to stress-test strategies.',
  },
  {
    icon: <Lightning size={32} weight="fill" />,
    title: 'Realistic Simulation',
    description: 'Experience short selling, borrow fees, and live pricing to mirror real execution conditions.',
  },
  {
    icon: <ChartLineUp size={32} weight="fill" />,
    title: 'Powerful Analytics',
    description: 'Leverage pro-grade charts, indicators, and a live news feed for sharper insights.',
  },
];

export function LandingFeatures(): React.JSX.Element {
  return (
    <Box
      component="section"
      id="platform"
      sx={{
        py: { xs: 10, md: 14 },
        background: 'linear-gradient(180deg, rgba(4, 10, 22, 0.2) 0%, rgba(3, 6, 16, 0.65) 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3} textAlign="center" alignItems="center" sx={{ mb: 6 }}>
          <Typography
            variant="overline"
            sx={{ color: 'rgba(76, 201, 255, 0.9)', letterSpacing: 3, fontWeight: 600 }}
          >
            Why UpTrade
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}>
            Everything you need to practice like a pro
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(203, 214, 238, 0.72)', maxWidth: 720 }}>
            From multi-market coverage to AI-ready analytics, UpTrade brings a complete paper trading arsenal to every learner.
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          {featureItems.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, md: 6 }}>
              <Card
                sx={(theme: Theme) => ({
                  height: '100%',
                  background: 'linear-gradient(155deg, rgba(8, 18, 38, 0.88), rgba(6, 12, 28, 0.72))',
                  border: 1,
                  borderColor: alpha(theme.palette.primary.light, 0.18),
                  boxShadow: '0 28px 60px rgba(2, 8, 26, 0.45)',
                  backdropFilter: 'blur(6px)',
                })}
              >
                <CardContent>
                  <Stack spacing={2} alignItems="flex-start">
                    <Box
                      sx={(theme: Theme) => ({
                        alignItems: 'center',
                        background: 'linear-gradient(135deg, rgba(76, 201, 255, 0.2), rgba(18, 184, 134, 0.24))',
                        borderRadius: 2,
                        color: theme.palette.primary.main,
                        display: 'inline-flex',
                        height: 56,
                        justifyContent: 'center',
                        width: 56,
                      })}
                    >
                      {feature.icon}
                    </Box>
                    <Stack spacing={1} alignItems="flex-start">
                      <Typography variant="h5" sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(204, 212, 234, 0.68)' }}>
                        {feature.description}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
