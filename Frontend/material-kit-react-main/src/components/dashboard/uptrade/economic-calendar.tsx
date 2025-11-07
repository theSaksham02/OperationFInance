'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

export type EventImpact = 'Low' | 'Medium' | 'High';

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  impact: EventImpact;
  scheduledAt: Date;
  description?: string;
}

export interface EconomicCalendarProps {
  heading: string;
  timezoneLabel: string;
  events: EconomicEvent[];
  sx?: SxProps<Theme>;
}

const impactColor = (impact: EventImpact, palette: Theme['palette']): string => {
  switch (impact) {
    case 'High': {
      return palette.error.main;
    }
    case 'Medium': {
      return palette.warning.main;
    }
    default: {
      return palette.info.main;
    }
  }
};

export function EconomicCalendar({ heading, timezoneLabel, events, sx }: EconomicCalendarProps): React.JSX.Element {
  const theme = useTheme();

  const cardSurfaceSx = {
    bgcolor: 'rgba(19,47,76,0.92)',
    border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
    borderRadius: 3,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 20px 60px rgba(1,12,28,0.45)',
  } as const;

  return (
    <Card component="section" sx={{ ...cardSurfaceSx, ...sx }}>
      <CardHeader
        title={heading}
        subheader={`Times shown in ${timezoneLabel}`}
        titleTypographyProps={{ sx: { color: 'var(--market-text, #ffffff)', fontWeight: 600 } }}
        subheaderTypographyProps={{ sx: { color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' } }}
      />
      <Divider sx={{ borderColor: 'var(--market-border, rgba(255,255,255,0.12))' }} />
      <CardContent sx={{ px: 0 }}>
        <List disablePadding>
          {events.map((event, index) => {
            const color = impactColor(event.impact, theme.palette);
            const timeString = event.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <React.Fragment key={event.id}>
                <ListItem alignItems="flex-start" sx={{ py: 2, px: 3 }}>
                  <ListItemText
                    primary={
                      <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Typography variant="subtitle1" fontWeight={600} component="div" sx={{ color: 'var(--market-text, #ffffff)' }}>
                            {event.title}
                          </Typography>
                          <Typography variant="body2" component="div" sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' }}>
                            {event.country}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Typography variant="body2" component="div" sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' }}>
                            {timeString}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                          <Chip
                            label={`${event.impact} impact`}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              color,
                              backgroundColor: alpha(color, 0.12),
                            }}
                          />
                        </Grid>
                      </Grid>
                    }
                    secondary={
                      event.description ? (
                        <Typography variant="body2" component="div" sx={{ mt: 1, color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' }}>
                          {event.description}
                        </Typography>
                      ) : undefined
                    }
                    primaryTypographyProps={{ component: 'div' }}
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                </ListItem>
                {index < events.length - 1 ? (
                  <Divider component="li" sx={{ mx: 3, borderColor: 'var(--market-border, rgba(255,255,255,0.12))' }} />
                ) : null}
              </React.Fragment>
            );
          })}
          {events.length === 0 ? (
            <Typography variant="body2" sx={{ px: 3, py: 4, color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' }}>
              No upcoming events in the calendar.
            </Typography>
          ) : null}
        </List>
      </CardContent>
    </Card>
  );
}
