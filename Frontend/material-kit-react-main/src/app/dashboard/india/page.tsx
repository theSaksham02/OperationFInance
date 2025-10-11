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

export const metadata = { title: `India Market | Dashboard | ${config.site.name}` } satisfies Metadata;

const portfolioMetrics: PortfolioMetric[] = [
  { id: 'portfolioValue', label: 'Portfolio value', value: 8640000, currency: 'INR' },
  { id: 'availableCash', label: 'Available cash', value: 2450000, currency: 'INR' },
  {
    id: 'dayPnL',
    label: "Today's P&L",
    value: 78500,
    formatter: (value: number) => `${value >= 0 ? '+' : ''}₹${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
  },
  {
    id: 'totalPnL',
    label: 'Total P&L',
    value: 364000,
    formatter: (value: number) => `${value >= 0 ? '+' : ''}₹${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
  },
];

const holdings = [
  {
    symbol: 'USD/INR',
    name: 'US Dollar vs Indian Rupee',
    quantity: 75000,
    averageCost: 83.12,
    currentPrice: 83.41,
    todayPnLPercent: 0.35,
  },
  {
    symbol: 'NIFTY',
    name: 'NIFTY 50 Futures',
    quantity: 12,
    averageCost: 19840,
    currentPrice: 19920,
    todayPnLPercent: 0.4,
  },
  {
    symbol: 'BANKNIFTY',
    name: 'Bank Nifty Futures',
    quantity: 8,
    averageCost: 44450,
    currentPrice: 44720,
    todayPnLPercent: 0.6,
  },
  {
    symbol: 'RELIANCE.NS',
    name: 'Reliance Industries',
    quantity: 120,
    averageCost: 2445.7,
    currentPrice: 2510.35,
    todayPnLPercent: 0.9,
  },
];

const watchlistEntries = [
  { symbol: 'HDFCBANK.NS', price: 1538.6, changePercent: 1.1 },
  { symbol: 'INFY.NS', price: 1502.1, changePercent: -0.42 },
  { symbol: 'USD/INR', price: 83.41, changePercent: 0.35 },
];

const chartSeries = [
  {
    name: 'Price',
    data: Array.from({ length: 60 }).map((_, index) => {
      const interval = 1000 * 60 * 60; // hourly data
      const start = Date.now() - interval * 60;
      const timestamp = start + index * interval;
      const base = 83 + Math.sin(index / 7) * 0.25;
      return { x: timestamp, y: Number((base + index * 0.002).toFixed(3)) };
    }),
  },
];

const newsArticles = [
  {
    id: 'news-in-1',
    headline: 'RBI keeps repo rate unchanged, signals vigilant stance',
    source: 'Economic Times',
    url: 'https://economictimes.indiatimes.com',
    publishedAt: new Date(),
  },
  {
    id: 'news-in-2',
    headline: 'Rupee rangebound as crude prices remain elevated',
    source: 'Mint',
    url: 'https://www.livemint.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 50),
  },
  {
    id: 'news-in-3',
    headline: 'IT stocks slip after weak US guidance; Bank Nifty rallies',
    source: 'Moneycontrol',
    url: 'https://www.moneycontrol.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 95),
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
          <AdvancedChart symbol="USD/INR" series={chartSeries} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <TradeExecutionWidget defaultSymbol="USD/INR" />
        </Grid>
        <Grid size={{ lg: 8, xs: 12 }}>
          <HoldingsTable positions={holdings} currency="INR" />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <Watchlist entries={watchlistEntries} currency="INR" />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <MarketNews articles={newsArticles} />
        </Grid>
      </Grid>
      <AiChatbot />
    </>
  );
}
