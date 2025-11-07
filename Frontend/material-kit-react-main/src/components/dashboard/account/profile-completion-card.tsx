'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export interface ProfileCompletionCardProps {
  completion: number;
  milestones: Array<{ id: string; label: string; completed: boolean }>;
}

export function ProfileCompletionCard({ completion, milestones }: ProfileCompletionCardProps): React.JSX.Element {
  const [animatedValue, setAnimatedValue] = React.useState(0);

  React.useEffect(() => {
    const start = globalThis.performance.now();
    const duration = 900;

    const step = (timestamp: number) => {
      const progress = Math.min(1, (timestamp - start) / duration);
      setAnimatedValue(Math.round(progress * completion));
      if (progress < 1) {
        globalThis.requestAnimationFrame(step);
      }
    };

    globalThis.requestAnimationFrame(step);
  }, [completion]);

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
        <Grid container columnSpacing={3} rowSpacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid
              container
              sx={{
                position: 'relative',
                width: 160,
                height: 160,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress
                variant="determinate"
                value={animatedValue}
                size={160}
                thickness={3.5}
                sx={{
                  color: 'var(--market-accent, #0B6EFD)',
                  filter: 'drop-shadow(0 12px 28px rgba(11,110,253,0.35))',
                }}
              />
              <Grid
                size={{ xs: 12 }}
                sx={{ position: 'absolute', textAlign: 'center' }}
              >
                <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '2rem' }}>{animatedValue}%</Typography>
                <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', fontSize: '0.85rem' }}>
                  Profile completion
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>Complete your trading identity</Typography>
            <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', mt: 1 }}>
              Unlock concierge onboarding, instant desk escalations, and Sam automations once every badge is complete.
            </Typography>
            <Grid container columnSpacing={1.5} rowSpacing={1.5} sx={{ mt: 2 }}>
              {milestones.map((milestone) => (
                <Grid key={milestone.id} size={{ xs: 12, sm: 6 }}>
                  <Chip
                    label={milestone.label}
                    color={milestone.completed ? 'success' : 'default'}
                    sx={{
                      width: '100%',
                      bgcolor: milestone.completed ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.05)',
                      color: milestone.completed ? '#bbf7d0' : 'var(--market-textSecondary, rgba(255,255,255,0.7))',
                      fontWeight: 600,
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
