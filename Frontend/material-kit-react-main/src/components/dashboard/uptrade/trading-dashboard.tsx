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
import { MarketPulseTicker } from '@/components/dashboard/shared/market-pulse-ticker';
import { DeskVolumeHeatmap } from '@/components/dashboard/shared/desk-volume-heatmap';
import type { DeskVolumeDatum } from '@/components/dashboard/shared/desk-volume-heatmap';
import { SessionTimelineStrip } from '@/components/dashboard/shared/session-timeline-strip';
import { SamAssistantLauncher } from '@/components/dashboard/shared/sam-assistant-launcher';

interface SerializableEconomicEvent extends Omit<EconomicEvent, 'scheduledAt'> {
  scheduledAt: string;
}

interface SerializableMarketNewsArticle extends Omit<MarketNewsArticle, 'publishedAt'> {
  publishedAt: string;
}

interface KpiMetric {
  id: string;
  label: string;
  value: number;
  isCurrency: boolean;
  suffix?: string;
  warning?: boolean;
  critical?: boolean;
  formattedValue?: string;
}

export interface TradingDashboardProps {
  balance: number;
  equity: number;
  marginUsed: number;
  freeMargin: number;
  marginLevel: number;
  todayPnL?: number;
  todayPnLFormatted?: string;
  chartSymbol: string;
  chartSeries: AdvancedChartSeries;
  tradeConfig: {
    marketLabel: string;
    defaultSymbol?: string;
    availableSymbols?: string[];
    quotes?: Record<string, QuoteInfo>;
  };
  openPositions: OpenPosition[];
  positionsCurrency: string;
  economicEvents: SerializableEconomicEvent[];
  calendarHeading: string;
  timezoneLabel: string;
  watchlistEntries: WatchlistEntry[];
  watchlistCurrency: string;
  newsArticles: SerializableMarketNewsArticle[];
  deskVolumeData?: DeskVolumeDatum[];
  heroEyebrow?: string;
  heroDescription?: string;
  heroGradient?: string;
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
  deskVolumeData: deskVolumeDataProp,
  heroEyebrow,
  heroDescription,
  heroGradient,
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
  { id: 'marginLevel', label: 'Margin Level', value: marginLevel, isCurrency: false, suffix: '%', warning: isMarginWarning, critical: isMarginCritical },
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

  const tickerItems = React.useMemo(
    () =>
      watchlistEntries.map((entry) => ({
        symbol: entry.symbol,
        price: entry.price,
        changePercent: entry.changePercent,
        currency: watchlistCurrency,
      })),
    [watchlistEntries, watchlistCurrency]
  );

  const defaultDeskVolumeData = React.useMemo(
    () => [
      { desk: 'NYC FX Pod', regionLabel: 'USA · EST', exposure: 12.4, change: 1.6 },
      { desk: 'Chicago Futures', regionLabel: 'USA · CST', exposure: 9.8, change: -0.7 },
      { desk: 'Mumbai Options', regionLabel: 'India · IST', exposure: 14.2, change: 2.1 },
      { desk: 'Bengaluru Overnight', regionLabel: 'India · IST', exposure: 6.5, change: 0.8 },
    ],
    []
  );

  const heatmapData = deskVolumeDataProp ?? defaultDeskVolumeData;

  const surfaceCardSx = {
    bgcolor: 'rgba(19,47,76,0.92)',
    border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
    borderRadius: 3,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 24px 80px rgba(1,12,28,0.55)',
  } as const;

  const mutedDividerSx = { borderColor: 'var(--market-border, rgba(255,255,255,0.12))' } as const;

  const handleSamLaunch = React.useCallback(() => {
    globalThis.location.assign('/dashboard/help');
  }, []);

  const heroEyebrowLabel = heroEyebrow ?? 'Live Multi-Market Overview';
  const heroDescriptionCopy = heroDescription ??
    'Monitor capital efficiency, execute trades, and react to macro events across the USA and India trading desks in real-time.';
  const heroBackground = heroGradient ?? 'linear-gradient(135deg, rgba(11,110,253,0.22), rgba(3,17,36,0.95))';

  return (
    <>
      <Grid container direction="column" rowSpacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              ...surfaceCardSx,
              background: heroBackground,
              borderColor: 'transparent',
              p: { xs: 3, md: 4 },
            }}
          >
            <Grid container spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 2 }}>
                  {heroEyebrowLabel}
                </Typography>
                <Typography sx={{ color: 'var(--market-text, #ffffff)', fontWeight: 700, fontSize: { xs: '2rem', md: '2.5rem' }, mt: 1 }}>
                  {tradeConfig.marketLabel}
                </Typography>
                <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', maxWidth: 520, mt: 1.5 }}>
                  {heroDescriptionCopy}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                      Balance
                    </Typography>
                    <Typography sx={{ color: 'var(--market-text, #ffffff)', fontWeight: 700, fontSize: '1.5rem' }}>
                      {formatCurrency(balance)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                      Margin Level
                    </Typography>
                    <Typography sx={{ color: 'var(--market-text, #ffffff)', fontWeight: 700, fontSize: '1.5rem' }}>
                      {marginLevel.toFixed(1)}%
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                      Equity
                    </Typography>
                    <Typography sx={{ color: 'var(--market-text, #ffffff)', fontWeight: 700, fontSize: '1.25rem' }}>
                      {formatCurrency(equity)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                      Free Margin
                    </Typography>
                    <Typography sx={{ color: 'var(--market-text, #ffffff)', fontWeight: 700, fontSize: '1.25rem' }}>
                      {formatCurrency(freeMargin)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {tickerItems.length > 0 ? (
          <Grid size={{ xs: 12 }}>
            <MarketPulseTicker items={tickerItems} />
          </Grid>
        ) : null}

        <Grid size={{ xs: 12 }}>
          <DeskVolumeHeatmap data={heatmapData} />
        </Grid>

        {/* Risk Alerts */}
        {isMarginCritical ? (
          <Grid size={{ xs: 12 }}>
            <Alert severity="error" sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--market-danger, #ef4444)' }}>
              <Typography sx={{ fontWeight: 600, color: 'var(--market-text, #ffffff)' }}>Margin Call Warning</Typography>
              <Typography variant="body2" sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' }}>
                Your margin level is critically low at {marginLevel.toFixed(2)}%. Add funds or close positions immediately.
              </Typography>
            </Alert>
          </Grid>
        ) : null}
        {isMarginWarning && !isMarginCritical ? (
          <Grid size={{ xs: 12 }}>
            <Alert severity="warning" sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)' }}>
              <Typography sx={{ fontWeight: 600, color: 'var(--market-text, #ffffff)' }}>Low Margin Alert</Typography>
              <Typography variant="body2" sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' }}>
                Your margin level is {marginLevel.toFixed(2)}%. Consider adding funds or reducing exposure.
              </Typography>
            </Alert>
          </Grid>
        ) : null}

        {/* KPI Cards Row */}
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={2}>
            {kpiMetrics.map((metric) => {
              const metricColor = metric.critical
                ? 'var(--market-danger, #ef4444)'
                : metric.warning
                  ? '#f59e0b'
                  : 'var(--market-accent, #0B6EFD)';

              return (
                <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card
                    sx={{
                      ...surfaceCardSx,
                      borderColor: metricColor,
                      borderWidth: metric.critical || metric.warning ? 2 : 1,
                      height: '100%',
                      p: 2.5,
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'var(--market-textSecondary, rgba(255,255,255,0.7))',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      {metric.label}
                    </Typography>
                    <Typography sx={{ color: metricColor, fontSize: '2rem', fontWeight: 700, mt: 1 }}>
                      {metric.formattedValue ||
                        (metric.isCurrency ? formatCurrency(metric.value) : `${metric.value.toFixed(2)}${metric.suffix || ''}`)}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        {/* Risk Stripe */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ ...surfaceCardSx }}>
            <CardContent sx={{ py: 2 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', fontSize: '0.75rem' }} variant="overline">
                    Equity: {formatCurrency(equity)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', fontSize: '0.75rem' }} variant="overline">
                    Maintenance: {formatCurrency(marginUsed)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', fontSize: '0.75rem' }} variant="overline">
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

        <Grid size={{ xs: 12 }}>
          <SessionTimelineStrip events={calendarEventsWithDates} timezoneLabel={timezoneLabel} />
        </Grid>

        {/* Main Content: Chart + Order Ticket */}
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={3}>
            {/* Central Chart Area */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Card sx={{ ...surfaceCardSx, height: 620 }}>
                <CardContent sx={{ height: '100%', p: { xs: 2, md: 3 } }}>
                  <Typography sx={{ color: 'var(--market-text, #ffffff)', fontWeight: 600 }} variant="h6">
                    {chartSymbol}
                  </Typography>
                  <Divider sx={{ my: 2, ...mutedDividerSx }} />
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
          <OpenPositionsTable currency={positionsCurrency} positions={openPositions} />
        </Grid>

        {/* Lower Section: Calendar, Watchlist, News */}
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <EconomicCalendar
                heading={calendarHeading}
                events={calendarEventsWithDates}
                timezoneLabel={timezoneLabel}
                sx={{ height: '100%' }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Watchlist currency={watchlistCurrency} entries={watchlistEntries} />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <MarketNews articles={newsArticlesWithDates} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <SamAssistantLauncher onLaunch={handleSamLaunch} />
    </>
  );
}
