'use client';

import * as React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';

import { useMarketTheme } from '@/contexts/market-theme-context';
import { AdvancedChart } from './advanced-chart';
import type { AdvancedChartSeries } from './advanced-chart';
import { TradeExecutionWidget } from './trade-execution-widget';
import type { QuoteInfo } from './trade-execution-widget';
import { OpenPositionsTable } from './open-positions-table';
import type { OpenPosition } from './open-positions-table';
import { EconomicCalendar } from './economic-calendar';
import type { EconomicEvent } from './economic-calendar';
import { Watchlist } from './watchlist';
import type { WatchlistEntry } from './watchlist';
import { MarketNews } from './market-news';
import type { MarketNewsArticle } from './market-news';

interface SerializableEconomicEvent extends Omit<EconomicEvent, 'scheduledAt'> {
  scheduledAt: string;
}

interface SerializableMarketNewsArticle extends Omit<MarketNewsArticle, 'publishedAt'> {
  publishedAt: string;
}

export interface TradingDashboardProps {
  // KPI Metrics
  balance: number;
  equity: number;
  marginUsed: number;
  freeMargin: number;
  marginLevel: number;
  todayPnL?: number;
  todayPnLFormatted?: string;

  // Chart
  chartSymbol: string;
  chartSeries: AdvancedChartSeries;

  // Trade Widget
  tradeConfig: {
    defaultSymbol: string;
    availableSymbols: string[];
    marketLabel: string;
    quotes: Record<string, QuoteInfo>;
  };

  // Positions
  openPositions: OpenPosition[];
  positionsCurrency: string;

  // Calendar
  economicEvents: SerializableEconomicEvent[];
  calendarHeading: string;
  timezoneLabel: string;

  // Watchlist
  watchlistEntries: WatchlistEntry[];
  watchlistCurrency: string;

  // News
  newsArticles: SerializableMarketNewsArticle[];
}

interface KpiMetric {
  id: string;
  label: string;
  value: number;
  isCurrency?: boolean;
  suffix?: string;
  warning?: boolean;
  critical?: boolean;
  formattedValue?: string;
}

export function TradingDashboard({
  balance,
  equity,
  marginUsed,
  freeMargin,
  marginLevel,
  todayPnL,
  todayPnLFormatted,
  chartSymbol,
  chartSeries,
  tradeConfig,
  openPositions,
  positionsCurrency,
  economicEvents,
  calendarHeading,
  timezoneLabel,
  watchlistEntries,
  watchlistCurrency,
  newsArticles,
}: TradingDashboardProps): React.JSX.Element {
  const { formatCurrency } = useMarketTheme();

  const marginUtilization = (marginUsed / equity) * 100;
  const isMarginWarning = marginLevel < 150 && marginLevel >= 120;
  const isMarginCritical = marginLevel < 120;

  const kpiMetrics: KpiMetric[] = [
    { id: 'balance', label: 'Balance', value: balance, isCurrency: true },
    { id: 'equity', label: 'Equity', value: equity, isCurrency: true },
    { id: 'marginUsed', label: 'Margin Used', value: marginUsed, isCurrency: true },
    { id: 'freeMargin', label: 'Free Margin', value: freeMargin, isCurrency: true },
    { id: 'marginLevel', label: 'Margin Level', value: marginLevel, suffix: '%', warning: isMarginWarning, critical: isMarginCritical },
  ];

  if (todayPnL !== undefined) {
    kpiMetrics.push({
      id: 'todayPnL',
      label: "Today's P&L",
      value: todayPnL,
      isCurrency: false,
      formattedValue: todayPnLFormatted,
    });
  }

  const calendarEventsWithDates = React.useMemo(
    () => economicEvents.map((event) => ({ ...event, scheduledAt: new Date(event.scheduledAt) })),
    [economicEvents]
  );

  const newsArticlesWithDates = React.useMemo(
    () => newsArticles.map((article) => ({ ...article, publishedAt: new Date(article.publishedAt) })),
    [newsArticles]
  );

  return (
  <Grid container direction="column" rowSpacing={3}>
      {/* Risk Alerts */}
      {isMarginCritical ? (
        <Grid size={{ xs: 12 }}>
          <Alert severity="error" sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--market-danger, #ef4444)' }}>
            <Typography sx={{ fontWeight: 600 }}>Margin Call Warning</Typography>
            <Typography variant="body2">
              Your margin level is critically low at {marginLevel.toFixed(2)}%. Add funds or close positions immediately.
            </Typography>
          </Alert>
        </Grid>
      ) : null}
      {isMarginWarning && !isMarginCritical ? (
        <Grid size={{ xs: 12 }}>
          <Alert severity="warning" sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)' }}>
            <Typography sx={{ fontWeight: 600 }}>Low Margin Alert</Typography>
            <Typography variant="body2">
              Your margin level is {marginLevel.toFixed(2)}%. Consider adding funds or reducing exposure.
            </Typography>
          </Alert>
        </Grid>
      ) : null}

      {/* KPI Cards Row */}
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={2}>
        {kpiMetrics.map((metric) => (
          <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
            <Card
              sx={{
                bgcolor: 'var(--market-surface, #132f4c)',
                borderColor: metric.critical
                  ? 'var(--market-danger, #ef4444)'
                  : metric.warning
                    ? '#f59e0b'
                    : 'var(--market-border, rgba(255,255,255,0.12))',
                borderWidth: metric.critical || metric.warning ? 2 : 1,
                borderStyle: 'solid',
                height: '100%',
              }}
            >
              <CardContent>
                <Typography
                  color="var(--market-textSecondary, rgba(255,255,255,0.7))"
                  gutterBottom
                  sx={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}
                  variant="overline"
                >
                  {metric.label}
                </Typography>
                <Typography
                  color={
                    metric.critical
                      ? 'var(--market-danger, #ef4444)'
                      : metric.warning
                        ? '#f59e0b'
                        : 'var(--market-text, #fff)'
                  }
                  sx={{ fontSize: '1.5rem', fontWeight: 700 }}
                  variant="h4"
                >
                  {metric.formattedValue ||
                    (metric.isCurrency ? formatCurrency(metric.value) : `${metric.value.toFixed(2)}${metric.suffix || ''}`)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        </Grid>
      </Grid>

      {/* Risk Stripe */}
      <Grid size={{ xs: 12 }}>
        <Card sx={{ bgcolor: 'var(--market-surface, #132f4c)' }}>
          <CardContent sx={{ py: 2 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))" sx={{ fontSize: '0.75rem' }} variant="overline">
                  Equity: {formatCurrency(equity)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))" sx={{ fontSize: '0.75rem' }} variant="overline">
                  Maintenance: {formatCurrency(marginUsed)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))" sx={{ fontSize: '0.75rem' }} variant="overline">
                  Headroom: {formatCurrency(freeMargin)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <LinearProgress
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    bgcolor: 'var(--market-grid, rgba(255,255,255,0.08))',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: isMarginCritical
                        ? 'var(--market-danger, #ef4444)'
                        : isMarginWarning
                          ? '#f59e0b'
                          : 'var(--market-success, #10b981)',
                    },
                  }}
                  value={marginUtilization}
                  variant="determinate"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Main Content: Chart + Order Ticket */}
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={3}>
        {/* Central Chart Area */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ bgcolor: 'var(--market-surface, #132f4c)', height: 600 }}>
            <CardContent sx={{ height: '100%', p: 2 }}>
              <Typography color="var(--market-text, #fff)" gutterBottom sx={{ fontWeight: 600 }} variant="h6">
                {chartSymbol}
              </Typography>
              <Divider sx={{ mb: 2, borderColor: 'var(--market-border, rgba(255,255,255,0.12))' }} />
              <AdvancedChart series={chartSeries} symbol={chartSymbol} />
            </CardContent>
          </Card>
        </Grid>

        {/* Right-Docked Order Ticket */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <TradeExecutionWidget
            availableSymbols={tradeConfig.availableSymbols}
            defaultSymbol={tradeConfig.defaultSymbol}
            marketLabel={tradeConfig.marketLabel}
            quotes={tradeConfig.quotes}
          />
        </Grid>
        </Grid>
      </Grid>

      {/* Open Positions */}
      <Grid size={{ xs: 12 }}>
        <Card sx={{ bgcolor: 'var(--market-surface, #132f4c)' }}>
          <CardContent>
            <Typography color="var(--market-text, #fff)" gutterBottom sx={{ fontWeight: 600 }} variant="h6">
              Open Positions
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'var(--market-border, rgba(255,255,255,0.12))' }} />
            <OpenPositionsTable currency={positionsCurrency} positions={openPositions} />
          </CardContent>
        </Card>
      </Grid>

      {/* Lower Section: Calendar, Watchlist, News */}
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'var(--market-surface, #132f4c)', height: '100%' }}>
            <CardContent>
              <Typography color="var(--market-text, #fff)" gutterBottom sx={{ fontWeight: 600 }} variant="h6">
                {calendarHeading}
              </Typography>
              <Divider sx={{ my: 2, borderColor: 'var(--market-border, rgba(255,255,255,0.12))' }} />
              <EconomicCalendar heading={calendarHeading} events={calendarEventsWithDates} timezoneLabel={timezoneLabel} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'var(--market-surface, #132f4c)', height: '100%' }}>
            <CardContent>
              <Typography color="var(--market-text, #fff)" gutterBottom sx={{ fontWeight: 600 }} variant="h6">
                Watchlist
              </Typography>
              <Divider sx={{ my: 2, borderColor: 'var(--market-border, rgba(255,255,255,0.12))' }} />
              <Watchlist currency={watchlistCurrency} entries={watchlistEntries} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'var(--market-surface, #132f4c)', height: '100%' }}>
            <CardContent>
              <Typography color="var(--market-text, #fff)" gutterBottom sx={{ fontWeight: 600 }} variant="h6">
                Market News
              </Typography>
              <Divider sx={{ my: 2, borderColor: 'var(--market-border, rgba(255,255,255,0.12))' }} />
              <MarketNews articles={newsArticlesWithDates} />
            </CardContent>
          </Card>
        </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
