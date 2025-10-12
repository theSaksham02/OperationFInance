'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import type { EconomicEvent } from '@/components/dashboard/uptrade/economic-calendar';

export interface SessionTimelineStripProps {
  events: Array<Omit<EconomicEvent, 'scheduledAt'> & { scheduledAt: Date }>;
  timezoneLabel: string;
}

export function SessionTimelineStrip({ events, timezoneLabel }: SessionTimelineStripProps): React.JSX.Element {
  const sortedEvents = React.useMemo(
    () => [...events].sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime()),
    [events]
  );

  const surfaceSx = {
    bgcolor: 'rgba(2,18,34,0.78)',
    border: '1px solid var(--market-border, rgba(255,255,255,0.14))',
    borderRadius: 3,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 18px 55px rgba(1,12,28,0.45)',
    overflow: 'hidden',
  } as const;

  return (
    <Card sx={surfaceSx} component="section">
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container rowSpacing={2}>
          <Grid size={{ xs: 12 }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid size={{ xs: 12, md: 'auto' }}>
                <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>Session Timeline</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 'auto' }} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Chip
                  label={`All times ${timezoneLabel}`}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#ffffff', fontWeight: 500 }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Grid
              container
              columnSpacing={3}
              rowSpacing={3}
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: 2,
                  background: 'linear-gradient(90deg, rgba(11,110,253,0.2), rgba(11,110,253,0.75), rgba(11,110,253,0.2))',
                },
              }}
            >
              {sortedEvents.map((event) => {
                const impactColor =
                  event.impact === 'High' ? 'var(--market-danger, #ef4444)' : event.impact === 'Medium' ? '#f59e0b' : '#3b82f6';
                const scheduledLabel = event.scheduledAt.toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <Grid key={event.id} size={{ xs: 12, md: 4 }} sx={{ position: 'relative' }}>
                    <Grid
                      container
                      direction="column"
                      rowSpacing={1}
                      sx={{
                        borderRadius: 3,
                        p: 2,
                        background: 'rgba(11,110,253,0.12)',
                        border: '1px solid rgba(11,110,253,0.24)',
                        backdropFilter: 'blur(14px)',
                        position: 'relative',
                        transition: 'transform 220ms ease, box-shadow 220ms ease',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: '0 18px 60px rgba(1,12,28,0.45)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -12,
                          left: 'calc(50% - 6px)',
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: impactColor,
                          boxShadow: `0 0 22px ${impactColor}`,
                          animation: 'timelinePulse 3s ease-in-out infinite',
                        },
                        '@keyframes timelinePulse': {
                          '0%': { transform: 'scale(0.7)', opacity: 0.6 },
                          '50%': { transform: 'scale(1.3)', opacity: 1 },
                          '100%': { transform: 'scale(0.7)', opacity: 0.6 },
                        },
                      }}
                    >
                      <Grid size={{ xs: 12 }}>
                        <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>{event.title}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', fontSize: '0.85rem' }}>
                          {event.description}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Chip
                          label={`${scheduledLabel}`}
                          size="small"
                          sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#ffffff', fontWeight: 500 }}
                        />
                      </Grid>
                    </Grid>
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
