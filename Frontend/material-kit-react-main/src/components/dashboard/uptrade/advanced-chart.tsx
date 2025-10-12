'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';
import { useMarketTheme } from '@/contexts/market-theme-context';

const TIMEFRAMES = ['1D', '5D', '1M', '6M', '1Y'] as const;

type Timeframe = (typeof TIMEFRAMES)[number];

export type AdvancedChartSeries = NonNullable<ApexOptions['series']>;

export interface AdvancedChartProps {
  symbol: string;
  series: AdvancedChartSeries;
  initialTimeframe?: Timeframe;
  sx?: SxProps<Theme>;
}

export function AdvancedChart({ symbol, series, initialTimeframe = '1M', sx }: AdvancedChartProps): React.JSX.Element {
  const [timeframe, setTimeframe] = React.useState<Timeframe>(initialTimeframe);
  const { marketTheme } = useMarketTheme();

  const primarySeries = React.useMemo(() => {
    const first = Array.isArray(series) ? series[0] : undefined;
    if (!first || typeof first !== 'object' || !('data' in first)) {
      return [];
    }
    const maybeData = (first as { data?: unknown }).data;
    if (!Array.isArray(maybeData)) {
      return [];
    }
    return maybeData as Array<{ x: number | string | Date; y: number }>;
  }, [series]);

  const lastDataPoint = primarySeries.at(-1);
  const firstDataPoint = primarySeries.at(0);
  const lastPrice = typeof lastDataPoint?.y === 'number' ? lastDataPoint.y : undefined;
  const firstPrice = typeof firstDataPoint?.y === 'number' ? firstDataPoint.y : undefined;
  const hasLastPrice = typeof lastPrice === 'number' && Number.isFinite(lastPrice);
  const hasFirstPrice = typeof firstPrice === 'number' && Number.isFinite(firstPrice);
  const priceChange = hasLastPrice && hasFirstPrice ? lastPrice! - firstPrice! : undefined;
  const hasPriceChange = typeof priceChange === 'number' && Number.isFinite(priceChange);
  const priceChangePct =
    hasPriceChange && hasFirstPrice && firstPrice!
      ? (priceChange! / firstPrice!) * 100
      : undefined;
  const hasPriceChangePct = typeof priceChangePct === 'number' && Number.isFinite(priceChangePct);
  const isPriceUp = hasPriceChange ? priceChange! >= 0 : true;

  const chartOptions = React.useMemo<ApexOptions>(() => {
    const accent = marketTheme.colors.accent;
    const annotationLabel = hasLastPrice
      ? {
          borderColor: accent,
          y: lastPrice!,
          label: {
            text: `${marketTheme.currency.symbol}${lastPrice!.toFixed(4)}`,
            style: {
              fontSize: '12px',
              fontWeight: 600,
              color: '#0d1726',
              background: accent,
            },
          },
        }
      : undefined;

    return {
      chart: {
        id: 'advanced-chart',
        background: 'transparent',
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
          autoSelected: 'pan',
        },
        zoom: { enabled: true, autoScaleYaxis: true },
        foreColor: marketTheme.colors.textSecondary,
      },
      annotations: annotationLabel ? { yaxis: [annotationLabel] } : undefined,
      colors: [accent],
      stroke: { width: 2, curve: 'smooth', colors: [accent] },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.8,
          opacityFrom: 0.35,
          opacityTo: 0.02,
          stops: [0, 65, 100],
        },
        colors: [accent],
      },
      dataLabels: { enabled: false },
      markers: {
        size: 0,
        strokeColors: accent,
        strokeWidth: 2,
        hover: { size: 5 },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false,
          style: { colors: marketTheme.colors.textSecondary, fontWeight: 500 },
        },
        axisBorder: { color: marketTheme.colors.grid },
        axisTicks: { color: marketTheme.colors.grid },
        crosshairs: {
          show: true,
          position: 'front',
          stroke: { color: accent, width: 1, dashArray: 3 },
        },
      },
      yaxis: {
        labels: {
          formatter: (value) => `${marketTheme.currency.symbol}${value.toFixed(4)}`,
          style: { colors: marketTheme.colors.textSecondary },
        },
        axisBorder: { color: marketTheme.colors.grid },
        axisTicks: { color: marketTheme.colors.grid },
      },
      tooltip: {
        x: { format: 'MMM dd, yyyy · HH:mm' },
        theme: 'dark',
        marker: { show: false },
        y: {
          formatter: (value: number) => `${marketTheme.currency.symbol}${value.toFixed(4)}`,
        },
      },
      theme: { mode: 'dark' },
      grid: {
        strokeDashArray: 3,
        borderColor: marketTheme.colors.grid,
        padding: { left: 12, right: 12, top: 8, bottom: 8 },
      },
    } satisfies ApexOptions;
  }, [hasLastPrice, lastPrice, marketTheme]);

  const dataPointCount = React.useMemo(() => {
    const first = Array.isArray(series) ? series[0] : undefined;
    if (first && typeof first === 'object' && 'data' in first && Array.isArray(first.data)) {
      return first.data.length;
    }
    return 0;
  }, [series]);

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
        background: 'linear-gradient(160deg, rgba(6,17,36,0.96) 0%, rgba(10,25,41,0.92) 100%)',
        boxShadow: '0 24px 80px rgba(1,12,28,0.5)',
        ...sx,
      }}
    >
      <CardHeader
        title={`Advanced Charting · ${symbol.toUpperCase()}`}
        subheader="TradingView-style lightweight visualization"
        action={
          <ToggleButtonGroup
            size="small"
            value={timeframe}
            exclusive
            onChange={(_event, value: Timeframe | null) => value && setTimeframe(value)}
          >
            {TIMEFRAMES.map((frame) => (
              <ToggleButton key={frame} value={frame}>
                {frame}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        }
        titleTypographyProps={{ sx: { color: 'var(--market-text, #ffffff)', fontWeight: 600 } }}
        subheaderTypographyProps={{ sx: { color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' } }}
      />
      <Divider />
      <CardContent>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3, alignItems: { md: 'center' } }}>
          <Stack spacing={0.5}>
            <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.65))', fontSize: '0.75rem' }}>
              Live price
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="baseline">
              <Typography sx={{ color: 'var(--market-text, #ffffff)', fontSize: '2.25rem', fontWeight: 700 }}>
                {hasLastPrice ? `${marketTheme.currency.symbol}${lastPrice!.toFixed(4)}` : '—'}
              </Typography>
              {hasPriceChange ? (
                <Chip
                  label={`${priceChange! >= 0 ? '+' : ''}${priceChange!.toFixed(4)} (${hasPriceChangePct ? priceChangePct!.toFixed(2) : '0.00'}%)`}
                  size="small"
                  sx={{
                    bgcolor: isPriceUp ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
                    color: isPriceUp ? '#34d399' : '#f87171',
                    fontWeight: 600,
                  }}
                />
              ) : null}
            </Stack>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack>
              <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.65))', fontSize: '0.75rem' }}>
                Data points
              </Typography>
              <Typography sx={{ color: 'var(--market-text, #ffffff)', fontWeight: 600 }}>{dataPointCount}</Typography>
            </Stack>
            <Stack>
              <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.65))', fontSize: '0.75rem' }}>
                View
              </Typography>
              <Chip label={timeframe} size="small" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.08)', fontWeight: 600 }} />
            </Stack>
          </Stack>
        </Stack>
        <Chart height={360} options={chartOptions} series={series} type="area" width="100%" />
      </CardContent>
    </Card>
  );
}
