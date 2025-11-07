'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

export interface DeskVolumeDatum {
  desk: string;
  regionLabel: string;
  exposure: number;
  change: number;
}

export interface DeskVolumeHeatmapProps {
  data: DeskVolumeDatum[];
}

export function DeskVolumeHeatmap({ data }: DeskVolumeHeatmapProps): React.JSX.Element {
  const surfaceSx = {
    bgcolor: 'rgba(2,18,34,0.78)',
    border: '1px solid var(--market-border, rgba(255,255,255,0.14))',
    borderRadius: 3,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 18px 55px rgba(1,12,28,0.45)',
    position: 'relative',
    overflow: 'hidden',
  } as const;

  return (
    <Card sx={surfaceSx} component="section">
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Grid container rowSpacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>Desk Liquidity Heatmap</Typography>
            <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', fontSize: '0.85rem', mt: 0.5 }}>
              Animated exposure gradient for USA and India execution pods — hover to inspect delta vs. last session.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Grid container rowSpacing={2} columnSpacing={2}>
              {data.map((datum) => {
                const normalized = Math.min(100, Math.max(0, datum.exposure));
                const gradientStrength = 0.35 + normalized / 200;
                const pulse = datum.change >= 0 ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)';

                return (
                  <Grid key={datum.desk} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Tooltip
                      title={`${datum.regionLabel} · ${datum.exposure.toFixed(1)}M notional (${datum.change >= 0 ? '+' : ''}${datum.change.toFixed(2)}%)`}
                    >
                      <Grid
                        container
                        direction="column"
                        rowSpacing={1}
                        sx={{
                          borderRadius: 3,
                          p: 2,
                          minHeight: 140,
                          border: '1px solid rgba(255,255,255,0.12)',
                          position: 'relative',
                          overflow: 'hidden',
                          background: `linear-gradient(135deg, rgba(11,110,253,${gradientStrength}), rgba(3,17,36,0.95))`,
                          transition: 'transform 220ms ease, box-shadow 220ms ease',
                          boxShadow: '0 12px 35px rgba(1,12,28,0.35)',
                          '&:hover': {
                            transform: 'translateY(-6px)',
                            boxShadow: '0 20px 60px rgba(1,12,28,0.55)',
                          },
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: '18% 18% auto auto',
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            backgroundColor: pulse,
                            filter: 'blur(12px)',
                            animation: 'pulseGlow 2.6s ease-in-out infinite',
                          },
                          '@keyframes pulseGlow': {
                            '0%': { opacity: 0.25, transform: 'scale(0.9)' },
                            '50%': { opacity: 1, transform: 'scale(1.35)' },
                            '100%': { opacity: 0.3, transform: 'scale(1)' },
                          },
                        }}
                      >
                        <Grid size={{ xs: 12 }}>
                          <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>{datum.desk}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>{datum.regionLabel}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '1.35rem' }}>
                            {datum.exposure.toFixed(1)}M
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Typography
                            sx={{
                              color: datum.change >= 0 ? 'var(--market-success, #10b981)' : 'var(--market-danger, #ef4444)',
                              fontWeight: 600,
                            }}
                          >
                            {datum.change >= 0 ? '+' : ''}
                            {datum.change.toFixed(2)}%
                          </Typography>
                        </Grid>
                      </Grid>
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
