'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

interface AccessPulse {
  id: string;
  label: string;
  position: { top: string; left: string };
  status: 'active' | 'idle';
}

const pulses: AccessPulse[] = [
  { id: 'nyc', label: 'New York Desk', position: { top: '45%', left: '26%' }, status: 'active' },
  { id: 'mumbai', label: 'Mumbai Desk', position: { top: '58%', left: '64%' }, status: 'active' },
  { id: 'ldn', label: 'London Bridge', position: { top: '38%', left: '47%' }, status: 'idle' },
];

export function AccessFootprintMap(): React.JSX.Element {
  const surfaceSx = {
    bgcolor: 'rgba(19,47,76,0.92)',
    border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
    borderRadius: 3,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 20px 60px rgba(1,12,28,0.45)',
    position: 'relative',
    overflow: 'hidden',
  } as const;

  return (
    <Card sx={surfaceSx} component="section">
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Grid container rowSpacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>Access footprint</Typography>
            <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', fontSize: '0.85rem', mt: 0.5 }}>
              Real-time login locations across desks — pulses identify where the platform is currently active.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Grid
              container
              sx={{
                minHeight: 280,
                borderRadius: 3,
                background: 'radial-gradient(circle at 20% 20%, rgba(11,110,253,0.2), rgba(3,17,36,0.92))',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'url(/assets/map-dark.svg)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  opacity: 0.25,
                },
              }}
            >
              {pulses.map((pulse) => (
                <Tooltip key={pulse.id} title={pulse.label} placement="top">
                  <Grid
                    size={{ xs: 12 }}
                    sx={{
                      position: 'absolute',
                      top: pulse.position.top,
                      left: pulse.position.left,
                      transform: 'translate(-50%, -50%)',
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      backgroundColor: pulse.status === 'active' ? 'rgba(16,185,129,0.9)' : 'rgba(148,163,184,0.7)',
                      boxShadow: pulse.status === 'active' ? '0 0 25px rgba(16,185,129,0.55)' : '0 0 22px rgba(148,163,184,0.32)',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: -6,
                        borderRadius: 'inherit',
                        border: '2px solid rgba(16,185,129,0.55)',
                        opacity: pulse.status === 'active' ? 1 : 0,
                        animation: pulse.status === 'active' ? 'ping 2.4s ease-out infinite' : 'none',
                      },
                      '@keyframes ping': {
                        '0%': { transform: 'scale(0.6)', opacity: 0.8 },
                        '75%': { transform: 'scale(1.8)', opacity: 0 },
                        '100%': { transform: 'scale(2)', opacity: 0 },
                      },
                    }}
                  />
                </Tooltip>
              ))}
            </Grid>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Grid container columnSpacing={1.5}>
              <Grid size={{ xs: 'auto' }}>
                <Chip label="USA" sx={{ bgcolor: 'rgba(16,185,129,0.25)', color: '#bbf7d0', fontWeight: 600 }} />
              </Grid>
              <Grid size={{ xs: 'auto' }}>
                <Chip label="India" sx={{ bgcolor: 'rgba(16,185,129,0.25)', color: '#bbf7d0', fontWeight: 600 }} />
              </Grid>
              <Grid size={{ xs: 'auto' }}>
                <Chip label="EMEA" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#ffffff', fontWeight: 600 }} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
