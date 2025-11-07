'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

const CHECKS = [
  { id: 'length', label: 'At least 14 characters' },
  { id: 'uppercase', label: 'Includes uppercase & lowercase' },
  { id: 'digit', label: 'Contains numbers' },
  { id: 'symbol', label: 'Has trading desk approved symbol set' },
];

export function SecurityHardeningCard(): React.JSX.Element {
  const [strength, setStrength] = React.useState(62);
  const [animated, setAnimated] = React.useState(false);

  React.useEffect(() => {
    const timer: ReturnType<typeof setTimeout> = globalThis.setTimeout(() => {
      setStrength(88);
      setAnimated(true);
    }, 350);
    return () => {
      globalThis.clearTimeout(timer);
    };
  }, []);

  const surfaceSx = {
    bgcolor: 'rgba(19,47,76,0.92)',
    border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
    borderRadius: 3,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 20px 60px rgba(1,12,28,0.45)',
  } as const;

  return (
    <Card sx={surfaceSx} component="section">
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Grid container rowSpacing={2.5}>
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>Password guardrail</Typography>
            <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', fontSize: '0.85rem', mt: 0.75 }}>
              Live strength checks update as you type inside the password form. Keep the bar in the green zone for Sam automations.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <LinearProgress
              variant="determinate"
              value={strength}
              sx={{
                height: 10,
                borderRadius: 999,
                bgcolor: 'rgba(255,255,255,0.08)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, rgba(16,185,129,0.95), rgba(59,130,246,0.95))',
                  boxShadow: '0 6px 22px rgba(16,185,129,0.55)',
                },
              }}
            />
            <Typography sx={{ color: '#ffffff', fontWeight: 600, mt: 1.5 }}>{strength}% strong</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>
              {animated ? 'Excellent — credentials meet Uptrade tier-one policy.' : 'Crunching entropy and breach datasets...'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Grid container columnSpacing={1.5} rowSpacing={1.5}>
              {CHECKS.map((check) => (
                <Grid key={check.id} size={{ xs: 12, sm: 6 }}>
                  <Chip
                    label={check.label}
                    icon={animated ? undefined : undefined}
                    sx={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      bgcolor: 'rgba(255,255,255,0.05)',
                      color: '#ffffff',
                      fontWeight: 500,
                      borderColor: 'rgba(255,255,255,0.12)',
                      borderWidth: 1,
                      borderStyle: 'solid',
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
