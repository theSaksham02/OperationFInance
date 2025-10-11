'use client';

import * as React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

export interface PortfolioMetric {
  id: string;
  label: string;
  value: number;
  currency?: string;
  formattedValue?: string;
  formatter?: (value: number) => string;
}

export interface PortfolioOverviewProps {
  metrics: PortfolioMetric[];
  lastUpdated?: Date;
  sx?: SxProps<Theme>;
}

const DEFAULT_FORMATTER = (value: number): string =>
  value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export function PortfolioOverview({ metrics, lastUpdated, sx }: PortfolioOverviewProps): React.JSX.Element {
  const theme = useTheme();
  const [highlighted, setHighlighted] = React.useState<string | null>(null);
  const previousValues = React.useRef<Map<string, number>>(new Map());

  React.useEffect(() => {
    if (metrics.length === 0) {
      return undefined;
    }

    let changedMetric: string | null = null;
    metrics.forEach((metric) => {
      const previousValue = previousValues.current.get(metric.id);
      if (previousValue !== undefined && previousValue !== metric.value && changedMetric === null) {
        changedMetric = metric.id;
      }
      previousValues.current.set(metric.id, metric.value);
    });

    if (!changedMetric) {
      changedMetric = metrics[0].id;
    }

    setHighlighted(changedMetric);
    const timeoutId = window.setTimeout(() => setHighlighted(null), 1200);

    return () => window.clearTimeout(timeoutId);
  }, [metrics]);

  return (
    <Grid container spacing={3} sx={sx}>
      {metrics.map((metric) => {
        const isNegative = metric.value < 0;
        const showCurrency = Boolean(metric.currency);
        const formattedValue =
          metric.formattedValue ??
          (showCurrency
            ? metric.value.toLocaleString(undefined, {
                style: 'currency',
                currency: metric.currency,
                maximumFractionDigits: 2,
              })
            : (metric.formatter ?? DEFAULT_FORMATTER)(metric.value));

        return (
          <Grid key={metric.id} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card
              sx={{
                height: '100%',
                borderColor: highlighted === metric.id ? theme.palette.success.main : 'divider',
                borderWidth: highlighted === metric.id ? 2 : 1,
                borderStyle: 'solid',
                transition: 'border-color 200ms ease, border-width 200ms ease',
                background: highlighted === metric.id
                  ? alpha(theme.palette.success.main, 0.08)
                  : theme.palette.background.paper,
              }}
            >
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {metric.label}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color={isNegative ? 'error.main' : 'text.primary'}>
                    {formattedValue}
                  </Typography>
                  {lastUpdated ? (
                    <Typography variant="caption" color="text.secondary">
                      Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  ) : null}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
