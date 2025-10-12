'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

interface ActivityEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  createdAt: Date;
  critical?: boolean;
}

const EVENTS: ActivityEvent[] = [
  {
    id: 'login-1',
    title: 'New device sign-in',
    description: 'Chrome · macOS · 192.168.1.12',
    location: 'New York, USA',
    createdAt: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    id: 'risk-1',
    title: 'Risk override approved',
    description: 'Raised exposure limit to 12M for USD crosses',
    location: 'Mumbai, India',
    createdAt: new Date(Date.now() - 1000 * 60 * 75),
    critical: true,
  },
  {
    id: 'profile-1',
    title: 'Profile field updated',
    description: 'Desk emergency contact · +1 (212) 555-0189',
    location: 'Dashboard',
    createdAt: new Date(Date.now() - 1000 * 60 * 180),
  },
];

export function AccountActivityFeed(): React.JSX.Element {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const timer: ReturnType<typeof setTimeout> = globalThis.setTimeout(() => setMounted(true), 120);
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
        <Grid container rowSpacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>Recent account activity</Typography>
            <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', fontSize: '0.85rem', mt: 0.5 }}>
              Security-grade audit history synced with compliance — slide-in updates keep the team alerted.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Grid container direction="column" rowSpacing={2}>
              {EVENTS.map((event, index) => {
                const delay = index * 120;
                return (
                  <Grid
                    key={event.id}
                    size={{ xs: 12 }}
                    sx={{
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                      transition: `opacity 320ms ease ${delay}ms, transform 320ms ease ${delay}ms`,
                    }}
                  >
                    <Grid container rowSpacing={1} columnSpacing={2}>
                      <Grid size={{ xs: 12 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>{event.title}</Typography>
                        <Chip
                          label={event.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          size="small"
                          sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#ffffff', fontWeight: 500 }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.75))', fontSize: '0.9rem' }}>
                          {event.description}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem' }}>{event.location}</Typography>
                      </Grid>
                    </Grid>
                    {index < EVENTS.length - 1 ? (
                      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mt: 2 }} />
                    ) : null}
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
