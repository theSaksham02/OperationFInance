'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
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

  const chartOptions = React.useMemo<ApexOptions>(() => {
    return {
      chart: { id: 'advanced-chart', background: 'transparent', toolbar: { show: false } },
      colors: [marketTheme.colors.accent],
      stroke: { width: 2, curve: 'smooth', colors: [marketTheme.colors.accent] },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.8,
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 100],
        },
        colors: [marketTheme.colors.accent],
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false,
          style: { colors: marketTheme.colors.textSecondary },
        },
        axisBorder: { color: marketTheme.colors.grid },
        axisTicks: { color: marketTheme.colors.grid },
      },
      yaxis: {
        labels: {
          formatter: (value) => `${marketTheme.currency.symbol}${value.toFixed(2)}`,
          style: { colors: marketTheme.colors.textSecondary },
        },
      },
      tooltip: {
        x: { format: 'MMM dd, yyyy HH:mm' },
        theme: 'dark',
      },
      theme: { mode: 'dark' },
      grid: {
        strokeDashArray: 3,
        borderColor: marketTheme.colors.grid,
      },
    } satisfies ApexOptions;
  }, [marketTheme, timeframe]);

  const dataPointCount = React.useMemo(() => {
    const first = Array.isArray(series) ? series[0] : undefined;
    if (first && typeof first === 'object' && 'data' in first && Array.isArray(first.data)) {
      return first.data.length;
    }
    return 0;
  }, [series]);

  return (
    <Card sx={sx}>
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
      />
      <Divider />
      <CardContent>
  <Chart height={360} options={chartOptions} series={series} type="area" width="100%" />
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Timeframe: {timeframe}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Data points: {dataPointCount}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
