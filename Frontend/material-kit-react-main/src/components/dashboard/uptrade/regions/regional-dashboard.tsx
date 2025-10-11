'use client';

import * as React from 'react';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

import { AdvancedChart } from '../advanced-chart';
import type { AdvancedChartSeries } from '../advanced-chart';
import { EconomicCalendar } from '../economic-calendar';
import type { EconomicEvent, EventImpact } from '../economic-calendar';
import { MarketNews } from '../market-news';
import type { MarketNewsArticle } from '../market-news';
import { OpenPositionsTable } from '../open-positions-table';
import type { OpenPosition } from '../open-positions-table';
import { PortfolioOverview } from '../portfolio-overview';
import type { PortfolioMetric } from '../portfolio-overview';
import { TradeExecutionWidget } from '../trade-execution-widget';
import type { QuoteInfo } from '../trade-execution-widget';
import { Watchlist } from '../watchlist';
import type { WatchlistEntry } from '../watchlist';
import { AiChatbot } from '../ai-chatbot';

interface SerializableEconomicEvent extends Omit<EconomicEvent, 'scheduledAt'> {
  scheduledAt: string;
}

interface SerializableMarketNewsArticle extends Omit<MarketNewsArticle, 'publishedAt'> {
  publishedAt: string;
}

export type DashboardVariant = 'usa' | 'india';

export interface RegionalDashboardProps {
  variant: DashboardVariant;
  metrics: PortfolioMetric[];
  metricsUpdatedAt: string;
  chartSymbol: string;
  chartSeries: AdvancedChartSeries;
  tradeConfig: {
    defaultSymbol: string;
    availableSymbols: string[];
    marketLabel: string;
    quotes: Record<string, QuoteInfo>;
  };
  openPositions: {
    currency: string;
    rows: OpenPosition[];
  };
  economicCalendar: {
    heading: string;
    timezoneLabel: string;
    events: SerializableEconomicEvent[];
  };
  watchlist: {
    currency: string;
    entries: WatchlistEntry[];
  };
  news: {
    articles: SerializableMarketNewsArticle[];
  };
}

const THEME_OPTIONS: Record<DashboardVariant, ThemeOptions> = {
  usa: {
    palette: {
      mode: 'light',
      primary: { main: '#0B6EFD' },
      secondary: { main: '#20C997' },
      background: { default: '#f4f7fb', paper: '#ffffff' },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", sans-serif',
      h4: { fontWeight: 700 },
    },
    components: {
      MuiCard: {
        styleOverrides: { root: { borderRadius: 20 } },
      },
    },
  },
  india: {
    palette: {
      mode: 'light',
      primary: { main: '#FF6F00' },
      secondary: { main: '#2E7D32' },
      background: { default: '#fff8ed', paper: '#ffffff' },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", sans-serif',
      h4: { fontWeight: 700 },
    },
    components: {
      MuiCard: {
        styleOverrides: { root: { borderRadius: 20 } },
      },
    },
  },
};

export function RegionalDashboard({
  variant,
  metrics,
  metricsUpdatedAt,
  chartSymbol,
  chartSeries,
  tradeConfig,
  openPositions,
  economicCalendar,
  watchlist,
  news,
}: RegionalDashboardProps): React.JSX.Element {
  const theme = React.useMemo(() => createTheme(THEME_OPTIONS[variant]), [variant]);

  const lastUpdated = React.useMemo(() => new Date(metricsUpdatedAt), [metricsUpdatedAt]);
  const calendarEvents = React.useMemo<EconomicEvent[]>(
    () =>
      economicCalendar.events.map((event) => ({
        ...event,
        scheduledAt: new Date(event.scheduledAt),
      })),
    [economicCalendar.events],
  );
  const newsArticles = React.useMemo<MarketNewsArticle[]>(
    () =>
      news.articles.map((article) => ({
        ...article,
        publishedAt: new Date(article.publishedAt),
      })),
    [news.articles],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <PortfolioOverview metrics={metrics} lastUpdated={lastUpdated} />
        </Grid>
        <Grid size={{ lg: 8, xs: 12 }}>
          <AdvancedChart symbol={chartSymbol} series={chartSeries} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <TradeExecutionWidget
            defaultSymbol={tradeConfig.defaultSymbol}
            availableSymbols={tradeConfig.availableSymbols}
            quotes={tradeConfig.quotes}
            marketLabel={tradeConfig.marketLabel}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <OpenPositionsTable positions={openPositions.rows} currency={openPositions.currency} />
        </Grid>
        <Grid size={{ lg: 8, xs: 12 }}>
          <EconomicCalendar
            heading={economicCalendar.heading}
            timezoneLabel={economicCalendar.timezoneLabel}
            events={calendarEvents}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <Watchlist entries={watchlist.entries} currency={watchlist.currency} />
        </Grid>
        <Grid size={{ lg: 6, xs: 12 }}>
          <MarketNews articles={newsArticles} />
        </Grid>
        <Grid size={{ lg: 6, xs: 12 }}>
          <AiChatbot />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
