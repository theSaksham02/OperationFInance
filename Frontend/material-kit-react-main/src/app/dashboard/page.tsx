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

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const portfolioMetrics = [
    { id: 'portfolioValue', label: 'Portfolio value', value: 128400.5, currency: 'USD' },
    { id: 'availableCash', label: 'Available cash', value: 48210.12, currency: 'USD' },
    {
      id: 'dayPnL',
      label: "Today\'s P&L",
      value: 1540.87,
      formatter: (value: number) => `${value >= 0 ? '+' : ''}${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    {
      id: 'totalPnL',
      label: 'Total P&L',
      value: 18450.94,
      formatter: (value: number) => `${value >= 0 ? '+' : ''}${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
  ] satisfies PortfolioMetric[];

  const holdings = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      quantity: 120,
      averageCost: 168.12,
      currentPrice: 173.54,
      todayPnLPercent: 1.4,
    },
    {
      symbol: 'RELIANCE.NS',
      name: 'Reliance Industries',
      quantity: 45,
      averageCost: 2445.7,
      currentPrice: 2510.35,
      todayPnLPercent: 0.9,
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      quantity: 35,
      averageCost: 229.5,
      currentPrice: 221.4,
      todayPnLPercent: -2.1,
    },
    {
      symbol: 'HDFCBANK.NS',
      name: 'HDFC Bank',
      quantity: 80,
      averageCost: 1502.34,
      currentPrice: 1538.6,
      todayPnLPercent: 1.1,
    },
  ];

  const watchlistEntries = [
    { symbol: 'MSFT', price: 411.52, changePercent: 0.68 },
    { symbol: 'INFY.NS', price: 1502.1, changePercent: -0.42 },
    { symbol: 'NVDA', price: 918.23, changePercent: 2.15 },
  ];

  const chartSeries = [
    {
      name: 'Price',
      data: Array.from({ length: 60 }).map((_, index) => {
        const twelveHours = 1000 * 60 * 60 * 12;
        const start = Date.now() - twelveHours * 60;
        const timestamp = start + index * twelveHours;
        const base = 170 + Math.sin(index / 6) * 4;
        return { x: timestamp, y: Number((base + index * 0.15).toFixed(2)) };
      }),
    },
  ];

  const newsArticles = [
    {
      id: 'news-1',
      headline: 'NIFTY 50 inches higher as banking stocks rally',
      source: 'MoneyControl',
      url: 'https://www.moneycontrol.com/',
      publishedAt: new Date(),
    },
    {
      id: 'news-2',
      headline: 'US markets rebound with tech leading gains',
      source: 'Reuters',
      url: 'https://www.reuters.com/',
      publishedAt: new Date(Date.now() - 1000 * 60 * 35),
    },
    {
      id: 'news-3',
      headline: 'RBI keeps rates steady amid inflation concerns',
      source: 'Economic Times',
      url: 'https://economictimes.indiatimes.com/',
      publishedAt: new Date(Date.now() - 1000 * 60 * 58),
    },
  ];

  return (
    <>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <PortfolioOverview metrics={portfolioMetrics} lastUpdated={new Date()} />
        </Grid>
        <Grid size={{ lg: 8, xs: 12 }}>
          <AdvancedChart symbol="AAPL" series={chartSeries} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <TradeExecutionWidget />
        </Grid>
        <Grid size={{ lg: 8, xs: 12 }}>
          <HoldingsTable positions={holdings} currency="USD" />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <Watchlist entries={watchlistEntries} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <MarketNews articles={newsArticles} />
        </Grid>
      </Grid>
      <AiChatbot />
    </>
  );
}
