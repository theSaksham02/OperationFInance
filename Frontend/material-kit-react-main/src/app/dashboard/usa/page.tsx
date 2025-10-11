import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Grid';

import { config } from '@/config';
import {
  AiChatbot,
  AdvancedChart,
  HoldingsTable,
  MarketNews,
  PortfolioOverview,
  TradeExecutionWidget,
  Watchlist,
} from '@/components/dashboard/uptrade';
import type { PortfolioMetric } from '@/components/dashboard/uptrade';

export const metadata = { title: `USA Forex Market | Dashboard | ${config.site.name}` } satisfies Metadata;

const portfolioMetrics: PortfolioMetric[] = [
  { id: 'portfolioValue', label: 'Portfolio value', value: 128400.5, currency: 'USD' },
  { id: 'availableCash', label: 'Available cash', value: 48210.12, currency: 'USD' },
  {
    id: 'dayPnL',
    label: "Today's P&L",
    value: 1540.87,
    formatter: (value: number) => `${value >= 0 ? '+' : ''}${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
  },
  {
    id: 'totalPnL',
    label: 'Total P&L',
    value: 18450.94,
    formatter: (value: number) => `${value >= 0 ? '+' : ''}${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
  },
];

const holdings = [
  {
    symbol: 'EUR/USD',
    name: 'Euro vs US Dollar',
    quantity: 150000,
    averageCost: 1.072,
    currentPrice: 1.078,
    todayPnLPercent: 0.56,
  },
  {
    symbol: 'USD/JPY',
    name: 'US Dollar vs Japanese Yen',
    quantity: 120000,
    averageCost: 155.42,
    currentPrice: 154.85,
    todayPnLPercent: -0.28,
  },
  {
    symbol: 'GBP/USD',
    name: 'British Pound vs US Dollar',
    quantity: 90000,
    averageCost: 1.254,
    currentPrice: 1.261,
    todayPnLPercent: 0.35,
  },
  {
    symbol: 'XAU/USD',
    name: 'Gold Spot',
    quantity: 250,
    averageCost: 2368.5,
    currentPrice: 2382.3,
    todayPnLPercent: 0.62,
  },
];

const watchlistEntries = [
  { symbol: 'USD/CAD', price: 1.362, changePercent: -0.14 },
  { symbol: 'AUD/USD', price: 0.662, changePercent: 0.21 },
  { symbol: 'BTC/USD', price: 68321.45, changePercent: 3.4 },
];

const chartSeries = [
  {
    name: 'Price',
    data: Array.from({ length: 60 }).map((_, index) => {
      const interval = 1000 * 60 * 60 * 12; // 12 hours
      const start = Date.now() - interval * 60;
      const timestamp = start + index * interval;
      const base = 1.05 + Math.sin(index / 5) * 0.012;
      return { x: timestamp, y: Number((base + index * 0.0008).toFixed(5)) };
    }),
  },
];

const newsArticles = [
  {
    id: 'news-us-1',
    headline: 'Dollar steadies as Fed signals extended higher rates',
    source: 'Bloomberg',
    url: 'https://www.bloomberg.com',
    publishedAt: new Date(),
  },
  {
    id: 'news-us-2',
    headline: 'US Treasury yields edge lower ahead of CPI release',
    source: 'WSJ',
    url: 'https://www.wsj.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 40),
  },
  {
    id: 'news-us-3',
    headline: 'Crude rebounds, buoying commodity-linked FX pairs',
    source: 'Reuters',
    url: 'https://www.reuters.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 75),
  },
];

export default function Page(): React.JSX.Element {
  return (
    <>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <PortfolioOverview metrics={portfolioMetrics} lastUpdated={new Date()} />
        </Grid>
        <Grid size={{ lg: 8, xs: 12 }}>
          <AdvancedChart symbol="EUR/USD" series={chartSeries} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <TradeExecutionWidget defaultSymbol="EUR/USD" />
        </Grid>
        <Grid size={{ lg: 8, xs: 12 }}>
          <HoldingsTable positions={holdings} currency="USD" />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <Watchlist entries={watchlistEntries} currency="USD" />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <MarketNews articles={newsArticles} />
        </Grid>
      </Grid>
      <AiChatbot />
    </>
  );
}
