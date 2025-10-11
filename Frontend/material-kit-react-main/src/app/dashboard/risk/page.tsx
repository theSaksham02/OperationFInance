'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import { ShieldCheck as ShieldCheckIcon } from '@phosphor-icons/react/dist/ssr/ShieldCheck';
import { Warning as WarningIcon } from '@phosphor-icons/react/dist/ssr/Warning';

import { useMarketTheme } from '@/contexts/market-theme-context';

interface RiskMetric {
  id: string;
  label: string;
  value: number;
  formattedValue?: string;
  warning?: boolean;
  critical?: boolean;
}

export default function Page(): React.JSX.Element {
  const { formatCurrency, marketTheme } = useMarketTheme();

  const equity = 112_450;
  const maintenanceRequirement = 28_800;
  const headroom = equity - maintenanceRequirement;
  const marginLevel = (equity / maintenanceRequirement) * 100;
  const isCritical = marginLevel < 120;
  const isWarning = marginLevel < 150 && marginLevel >= 120;

  const riskMetrics: RiskMetric[] = [
    { id: 'equity', label: 'Total Equity', value: equity },
    { id: 'maintenance', label: 'Maintenance Requirement', value: maintenanceRequirement },
    {
      id: 'headroom',
      label: 'Available Headroom',
      value: headroom,
      warning: headroom < 20_000,
      critical: headroom < 10_000,
    },
    {
      id: 'marginLevel',
      label: 'Margin Level',
      value: marginLevel,
      formattedValue: `${marginLevel.toFixed(2)}%`,
      critical: isCritical,
      warning: isWarning,
    },
  ];

  return (
    <Stack spacing={3}>
      <Stack alignItems="center" direction="row" spacing={2}>
        <ShieldCheckIcon color="var(--market-accent, #0B6EFD)" fontSize={32} weight="bold" />
        <Typography color="var(--market-text, #fff)" variant="h4">
          Equity & Margin Center
        </Typography>
      </Stack>

      {/* Risk alerts */}
      {isCritical ? (
        <Alert icon={<WarningIcon fontSize={24} />} severity="error">
          <Typography sx={{ fontWeight: 600 }}>Margin Call Warning</Typography>
          <Typography variant="body2">
            Your margin level is critically low at {marginLevel.toFixed(2)}%. Please add funds or close positions to
            avoid liquidation.
          </Typography>
        </Alert>
      ) : null}
      {isWarning && !isCritical ? (
        <Alert icon={<WarningIcon fontSize={24} />} severity="warning">
          <Typography sx={{ fontWeight: 600 }}>Low Margin Alert</Typography>
          <Typography variant="body2">
            Your margin level is approaching the minimum threshold at {marginLevel.toFixed(2)}%. Consider adding funds
            or reducing exposure.
          </Typography>
        </Alert>
      ) : null}

      {/* Metrics cards */}
      <Grid container spacing={3}>
        {riskMetrics.map((metric) => (
          <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                bgcolor: 'var(--market-surface, #132f4c)',
                borderColor: metric.critical
                  ? 'var(--market-danger, #ef4444)'
                  : metric.warning
                    ? 'var(--market-warning, #f59e0b)'
                    : 'var(--market-border, rgba(255,255,255,0.12))',
                borderWidth: metric.critical || metric.warning ? 2 : 1,
                borderStyle: 'solid',
              }}
            >
              <CardContent>
                <Typography
                  color="var(--market-textSecondary, rgba(255,255,255,0.7))"
                  gutterBottom
                  sx={{ fontSize: '0.875rem' }}
                  variant="overline"
                >
                  {metric.label}
                </Typography>
                <Typography
                  color={
                    metric.critical
                      ? 'var(--market-danger, #ef4444)'
                      : metric.warning
                        ? 'var(--market-warning, #f59e0b)'
                        : 'var(--market-text, #fff)'
                  }
                  sx={{ fontSize: '1.75rem', fontWeight: 600 }}
                  variant="h3"
                >
                  {metric.formattedValue || formatCurrency(metric.value)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Margin usage visualization */}
      <Card sx={{ bgcolor: 'var(--market-surface, #132f4c)' }}>
        <CardHeader subheader="Visual representation of your margin utilization" title="Margin Utilization" />
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))" variant="body2">
                Used: {formatCurrency(maintenanceRequirement)}
              </Typography>
              <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))" variant="body2">
                Available: {formatCurrency(headroom)}
              </Typography>
            </Stack>
            <LinearProgress
              sx={{
                height: 12,
                borderRadius: 1,
                bgcolor: 'var(--market-grid, rgba(255,255,255,0.08))',
                '& .MuiLinearProgress-bar': {
                  bgcolor: isCritical
                    ? 'var(--market-danger, #ef4444)'
                    : isWarning
                      ? 'var(--market-warning, #f59e0b)'
                      : 'var(--market-success, #10b981)',
                },
              }}
              value={(maintenanceRequirement / equity) * 100}
              variant="determinate"
            />
            <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))" variant="caption">
              {((maintenanceRequirement / equity) * 100).toFixed(1)}% of equity used for margin
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Risk thresholds */}
      <Card sx={{ bgcolor: 'var(--market-surface, #132f4c)' }}>
        <CardHeader subheader="Understanding margin level requirements" title="Risk Thresholds" />
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <Stack
                sx={{
                  width: 12,
                  bgcolor: 'var(--market-success, #10b981)',
                  borderRadius: 1,
                }}
              />
              <Stack flex={1}>
                <Typography color="var(--market-text, #fff)" sx={{ fontWeight: 600 }} variant="body2">
                  Safe Zone (≥ 150%)
                </Typography>
                <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))" variant="body2">
                  Your account is well-capitalized with sufficient headroom.
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Stack
                sx={{
                  width: 12,
                  bgcolor: 'var(--market-warning, #f59e0b)',
                  borderRadius: 1,
                }}
              />
              <Stack flex={1}>
                <Typography color="var(--market-text, #fff)" sx={{ fontWeight: 600 }} variant="body2">
                  Warning Zone (120% - 150%)
                </Typography>
                <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))" variant="body2">
                  Consider adding funds or reducing positions to increase your margin level.
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Stack
                sx={{
                  width: 12,
                  bgcolor: 'var(--market-danger, #ef4444)',
                  borderRadius: 1,
                }}
              />
              <Stack flex={1}>
                <Typography color="var(--market-text, #fff)" sx={{ fontWeight: 600 }} variant="body2">
                  Margin Call Zone (&lt; 120%)
                </Typography>
                <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))" variant="body2">
                  Immediate action required. Positions may be liquidated to meet margin requirements.
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
