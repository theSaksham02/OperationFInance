"use client";

import * as React from 'react';
import { Box, Card, CardContent, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
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
    <Box component="section" sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <Stack spacing={3} textAlign="center" alignItems="center" sx={{ mb: 6 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 2 }}>
            Why TradeSphere
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Everything you need to practice like a pro
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 720 }}>
            From multi-market coverage to AI-ready analytics, TradeSphere brings a complete paper trading arsenal to every learner.
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          {featureItems.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, md: 6 }}>
              <Card
                sx={(theme: Theme) => ({
                  height: '100%',
                  background: `linear-gradient(180deg, ${theme.palette.background.level1}, ${theme.palette.background.level3})`,
                  border: 1,
                  borderColor: 'divider',
                  boxShadow: '0 20px 45px rgba(29, 41, 57, 0.18)',
                })}
              >
                <CardContent>
                  <Stack spacing={2} alignItems="flex-start">
                    <Box
                      sx={(theme: Theme) => ({
                        alignItems: 'center',
                        backgroundColor: `${theme.palette.primary.main}33`,
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
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
