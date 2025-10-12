'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

import { usePortfolioData } from '@/hooks/use-portfolio-data';
import type { PortfolioPosition } from '@/types/portfolio';
import { TradingDashboard } from './trading-dashboard';
import type { AdvancedChartSeries } from './advanced-chart';
import type { QuoteInfo } from './trade-execution-widget';
import type { OpenPosition } from './open-positions-table';
import type { EconomicEvent } from './economic-calendar';
import type { MarketNewsArticle } from './market-news';
import type { DeskVolumeDatum } from '@/components/dashboard/shared/desk-volume-heatmap';
import type { WatchlistEntry } from './watchlist';

interface MarketPreset {
  marketLabel: string;
  currency: 'USD' | 'INR';
  heroEyebrow: string;
  heroDescription: string;
  heroGradient: string;
  fallbackWatchlist: WatchlistEntry[];
  fallbackChartSeries: AdvancedChartSeries;
  fallbackDeskVolume: DeskVolumeDatum[];
  fallbackNews: MarketNewsArticle[];
  fallbackEvents: Array<Omit<EconomicEvent, 'scheduledAt'> & { scheduledAt: string }>;
}

const MARKET_PRESETS: Record<'usa' | 'india', MarketPreset> = {
  usa: {
    marketLabel: 'New York FX Session',
    currency: 'USD',
    heroEyebrow: 'US session spotlight',
    heroDescription: 'Track the New York desks as liquidity rolls through late US hours and prepare for the Tokyo hand-off.',
    heroGradient: 'linear-gradient(135deg, rgba(14,116,255,0.35), rgba(5,16,48,0.95))',
    fallbackWatchlist: [
      { symbol: 'USD/CAD', price: 1.362, changePercent: -0.14 },
      { symbol: 'AUD/USD', price: 0.662, changePercent: 0.21 },
      { symbol: 'BTC/USD', price: 68321.45, changePercent: 3.4 },
      { symbol: 'S&P 500', price: 5625.1, changePercent: 0.48 },
    ],
    fallbackChartSeries: [
      {
        name: 'Price',
        data: Array.from({ length: 60 }).map((_, index) => {
          const interval = 1000 * 60 * 60 * 4;
          const start = Date.now() - interval * 60;
          const timestamp = start + index * interval;
          const base = 1.068 + Math.sin(index / 4) * 0.014;
          return { x: timestamp, y: Number((base + index * 0.0006).toFixed(5)) };
        }),
      },
    ],
    fallbackDeskVolume: [
      { desk: 'NYC FX Pod', regionLabel: 'New York · EST', exposure: 14.8, change: 2.1 },
      { desk: 'Chicago Futures', regionLabel: 'Chicago · CST', exposure: 10.6, change: -0.9 },
      { desk: 'LA Options', regionLabel: 'Los Angeles · PST', exposure: 8.2, change: 1.3 },
      { desk: 'Toronto Macro', regionLabel: 'Toronto · EST', exposure: 7.9, change: 0.6 },
    ],
    fallbackNews: [
      {
        id: 'news-us-1',
        headline: 'Dollar steadies as Fed signals extended higher rates',
        source: 'Bloomberg',
        url: 'https://www.bloomberg.com',
        publishedAt: new Date().toISOString(),
      },
      {
        id: 'news-us-2',
        headline: 'US Treasury yields cool ahead of CPI release',
        source: 'WSJ',
        url: 'https://www.wsj.com',
        publishedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      },
      {
        id: 'news-us-3',
        headline: 'Crude rebound buoys commodity FX pairs into late session',
        source: 'Reuters',
        url: 'https://www.reuters.com',
        publishedAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
      },
    ],
    fallbackEvents: [
      {
        id: 'event-us-1',
        title: 'FOMC Minutes Release',
        country: 'United States',
        impact: 'High',
        scheduledAt: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
        description: 'Desks monitor language around the pace of balance sheet runoff.',
      },
      {
        id: 'event-us-2',
        title: 'Initial Jobless Claims',
        country: 'United States',
        impact: 'Medium',
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
        description: 'Consensus looks for only a modest rise as seasonal effects fade.',
      },
      {
        id: 'event-us-3',
        title: 'Tokyo Open Liquidity Check',
        country: 'Japan',
        impact: 'Medium',
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 11).toISOString(),
        description: 'Sets the tone for the USD/JPY crossover once Asia takes the book.',
      },
    ],
  },
  india: {
    marketLabel: 'NSE Currency Derivatives',
    currency: 'INR',
    heroEyebrow: 'Asia crossover ignition',
    heroDescription: 'Kick off NSE currency flows as New York winds down and the India desks absorb overnight risk.',
    heroGradient: 'linear-gradient(135deg, rgba(255,140,0,0.32), rgba(30,10,2,0.95))',
    fallbackWatchlist: [
      { symbol: 'HDFCBANK.NS', price: 1538.6, changePercent: 1.1 },
      { symbol: 'INFY.NS', price: 1502.1, changePercent: -0.42 },
      { symbol: 'NIFTY 50', price: 24315.4, changePercent: 0.68 },
      { symbol: 'USD/INR', price: 83.41, changePercent: 0.35 },
    ],
    fallbackChartSeries: [
      {
        name: 'Price',
        data: Array.from({ length: 60 }).map((_, index) => {
          const interval = 1000 * 60 * 60;
          const start = Date.now() - interval * 60;
          const timestamp = start + index * interval;
          const base = 83 + Math.sin(index / 7) * 0.25;
          return { x: timestamp, y: Number((base + index * 0.002).toFixed(3)) };
        }),
      },
    ],
    fallbackDeskVolume: [
      { desk: 'Mumbai Options', regionLabel: 'Mumbai · IST', exposure: 15.9, change: 2.4 },
      { desk: 'Bengaluru Overnight', regionLabel: 'Bengaluru · IST', exposure: 7.2, change: 0.9 },
      { desk: 'Singapore Bridge', regionLabel: 'Singapore · SGT', exposure: 9.4, change: 1.7 },
      { desk: 'Dubai Carry Desk', regionLabel: 'Dubai · GST', exposure: 6.8, change: -0.6 },
    ],
    fallbackNews: [
      {
        id: 'news-in-1',
        headline: 'RBI keeps repo rate unchanged, signals vigilant stance',
        source: 'Economic Times',
        url: 'https://economictimes.indiatimes.com',
        publishedAt: new Date().toISOString(),
      },
      {
        id: 'news-in-2',
        headline: 'Rupee rangebound as crude prices remain elevated',
        source: 'Mint',
        url: 'https://www.livemint.com',
        publishedAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
      },
      {
        id: 'news-in-3',
        headline: 'IT stocks slip after weak US guidance; Bank Nifty rallies',
        source: 'Moneycontrol',
        url: 'https://www.moneycontrol.com',
        publishedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
      },
    ],
    fallbackEvents: [
      {
        id: 'event-in-1',
        title: 'RBI Monetary Policy Statement',
        country: 'India',
        impact: 'High',
        scheduledAt: new Date(Date.now() + 1000 * 60 * 45).toISOString(),
        description: 'Rate decision with focus on liquidity stance and inflation outlook.',
      },
      {
        id: 'event-in-2',
        title: 'India CPI YoY',
        country: 'India',
        impact: 'High',
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
        description: 'Expectations peg inflation cooling towards 4.2%.',
      },
      {
        id: 'event-in-3',
        title: 'US CPI YoY',
        country: 'United States',
        impact: 'Medium',
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 9).toISOString(),
        description: 'Key event for INR cross volatility during the US session.',
      },
    ],
  },
};

function buildChartSeries(equity: number): AdvancedChartSeries {
  const base = Math.max(equity, 1);
  const points = 48;
  const interval = 1000 * 60 * 30;
  const start = Date.now() - interval * points;

  return [
    {
      name: 'Equity',
      data: Array.from({ length: points }).map((_, index) => {
        const timestamp = start + index * interval;
        const variance = Math.sin(index / 4) * 0.015 * base;
        const drift = (index / points) * 0.01 * base;
        const value = Number((base + variance + drift).toFixed(2));
        return { x: timestamp, y: value };
      }),
    },
  ];
}

function mapToOpenPositions(positions: PortfolioPosition[]): OpenPosition[] {
  return positions.map((position, index) => {
    const avgPrice = position.avgPrice;
    const currentPrice = position.currentPrice ?? avgPrice;
    const side = position.shares >= 0 ? 'BUY' : 'SELL';
    const positionSize = Math.abs(position.shares);
    const unrealized = position.unrealizedPnl ?? (currentPrice - avgPrice) * position.shares;
    const pipBasis = avgPrice !== 0 ? ((currentPrice - avgPrice) / Math.abs(avgPrice)) * 100 : 0;

    return {
      id: `${position.symbol}-${index}`,
      instrument: position.symbol,
      side,
      sizeLots: Number(positionSize.toFixed(2)),
      openPrice: Number(avgPrice.toFixed(4)),
      currentPrice: Number(currentPrice.toFixed(4)),
      pipPnL: Number(pipBasis.toFixed(2)),
      currencyPnL: Number((unrealized ?? 0).toFixed(2)),
    };
  });
}

function buildQuotes(entries: WatchlistEntry[]): Record<string, QuoteInfo> {
  return entries.reduce<Record<string, QuoteInfo>>((acc, entry) => {
    const price = entry.price;

    if (!price || price <= 0) {
      return acc;
    }

    const spread = Math.max(price * 0.0008, 0.0001);
    const bid = Number((price - spread / 2).toFixed(4));
    const ask = Number((price + spread / 2).toFixed(4));

    acc[entry.symbol] = {
      bid,
      ask,
      spread: Number((ask - bid).toFixed(4)),
    };

    return acc;
  }, {});
}

export interface TradingDashboardContainerProps {
  market: 'usa' | 'india';
}

export function TradingDashboardContainer({ market }: TradingDashboardContainerProps): React.JSX.Element {
  const { data, error, isLoading, refresh } = usePortfolioData();
  const preset = MARKET_PRESETS[market];

  const openPositions = React.useMemo(() => mapToOpenPositions(data?.positions ?? []), [data?.positions]);

  const watchlistEntries = React.useMemo<WatchlistEntry[]>(() => {
    if (!data?.positions?.length) {
      return preset.fallbackWatchlist;
    }

    return data.positions.map((position) => {
      const price = position.currentPrice ?? position.avgPrice;
      const changePercent = position.avgPrice ? ((price - position.avgPrice) / position.avgPrice) * 100 : 0;

      return {
        symbol: position.symbol,
        price: Number(price.toFixed(4)),
        changePercent: Number(changePercent.toFixed(2)),
      };
    });
  }, [data?.positions, preset.fallbackWatchlist]);

  const quotes = React.useMemo(() => {
    const mapped = buildQuotes(watchlistEntries);
    return Object.keys(mapped).length > 0 ? mapped : buildQuotes(preset.fallbackWatchlist);
  }, [watchlistEntries, preset.fallbackWatchlist]);

  const chartSeries = React.useMemo<AdvancedChartSeries>(() => {
    if (!data) {
      return preset.fallbackChartSeries;
    }

    return buildChartSeries(data.equity);
  }, [data, preset.fallbackChartSeries]);

  const totalPnl = React.useMemo(() => {
    if (!data) {
      return 0;
    }

    return data.positions.reduce((acc, position) => acc + (position.unrealizedPnl ?? 0), 0);
  }, [data]);

  const currencyFormatter = React.useMemo(
    () =>
      new Intl.NumberFormat(preset.currency === 'USD' ? 'en-US' : 'en-IN', {
        style: 'currency',
        currency: preset.currency,
        maximumFractionDigits: 2,
      }),
    [preset.currency]
  );

  const todayPnLFormatted = totalPnl !== 0 ? `${totalPnl > 0 ? '+' : ''}${currencyFormatter.format(Math.abs(totalPnl))}` : undefined;

  const marginUsed = Math.max(data?.maintenanceRequired ?? 0, 0);
  const marginLevel = data && data.maintenanceRequired > 0 ? (data.equity / data.maintenanceRequired) * 100 : data ? 999 : 0;

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: '60vh' }} spacing={2}>
        <CircularProgress color="primary" />
        <Box component="span" sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' }}>
          Loading portfolio data…
        </Box>
      </Stack>
    );
  }

  if (error || !data) {
    return (
      <Stack spacing={2} sx={{ maxWidth: 520, mx: 'auto', mt: 6 }}>
        <Alert severity="error">{error ?? 'Unable to load portfolio data.'}</Alert>
        <Button onClick={refresh} variant="contained">
          Retry
        </Button>
      </Stack>
    );
  }

  const tradeSymbols = Object.keys(quotes);
  const defaultSymbol = tradeSymbols[0] ?? preset.fallbackWatchlist[0]?.symbol ?? 'SPY';

  return (
    <TradingDashboard
      balance={data.cashBalance}
      equity={data.equity}
      marginUsed={marginUsed}
      freeMargin={data.marginHeadroom}
      marginLevel={marginLevel}
      todayPnL={totalPnl || undefined}
      todayPnLFormatted={todayPnLFormatted}
      chartSymbol={defaultSymbol}
      chartSeries={chartSeries}
      tradeConfig={{
        marketLabel: preset.marketLabel,
        defaultSymbol,
        availableSymbols: tradeSymbols.length > 0 ? tradeSymbols : preset.fallbackWatchlist.map((entry) => entry.symbol),
        quotes,
      }}
      heroEyebrow={preset.heroEyebrow}
      heroDescription={preset.heroDescription}
      heroGradient={preset.heroGradient}
      deskVolumeData={preset.fallbackDeskVolume}
      openPositions={openPositions}
      positionsCurrency={preset.currency}
      economicEvents={preset.fallbackEvents}
      calendarHeading={market === 'usa' ? 'US Macro Pulse' : 'India Economic Calendar'}
      timezoneLabel={market === 'usa' ? 'EST (UTC-5)' : 'IST (UTC+5:30)'}
      watchlistEntries={watchlistEntries}
      watchlistCurrency={preset.currency}
      newsArticles={preset.fallbackNews}
    />
  );
}
