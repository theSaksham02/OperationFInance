import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TradingDashboard } from '@/components/dashboard/uptrade/trading-dashboard';
import type { OpenPosition, QuoteInfo, AdvancedChartSeries } from '@/components/dashboard/uptrade';

export const metadata = { title: `India Market | Dashboard | ${config.site.name}` } satisfies Metadata;

const inrChangeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const formatInrChange = (value: number): string => {
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${inrChangeFormatter.format(Math.abs(value))}`;
};

const openPositions: OpenPosition[] = [
  {
    id: 'in-pos-1',
    instrument: 'USD/INR',
    side: 'BUY',
  sizeLots: 3,
    openPrice: 83.145,
    currentPrice: 83.412,
    stopLoss: 82.85,
    takeProfit: 83.7,
    pipPnL: 26.7,
  currencyPnL: 20_025,
  },
  {
    id: 'in-pos-2',
    instrument: 'EUR/INR',
    side: 'SELL',
    sizeLots: 1.5,
    openPrice: 89.725,
    currentPrice: 89.42,
    stopLoss: 90.3,
    takeProfit: 88.9,
    pipPnL: 30.5,
  currencyPnL: 34_250,
  },
  {
    id: 'in-pos-3',
    instrument: 'GBP/INR',
    side: 'BUY',
    sizeLots: 1.2,
    openPrice: 104.45,
    currentPrice: 104.78,
    stopLoss: 103.9,
    takeProfit: 105.6,
    pipPnL: 33.0,
  currencyPnL: 23_760,
  },
];

const watchlistEntries = [
  { symbol: 'HDFCBANK.NS', price: 1_538.6, changePercent: 1.1 },
  { symbol: 'INFY.NS', price: 1_502.1, changePercent: -0.42 },
  { symbol: 'USD/INR', price: 83.41, changePercent: 0.35 },
];

const chartSeries: AdvancedChartSeries = [
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
];

const economicEvents = [
  {
    id: 'event-in-1',
    title: 'RBI Monetary Policy Statement',
    country: 'India',
    impact: 'High' as const,
    scheduledAt: new Date(Date.now() + 1000 * 60 * 45).toISOString(),
    description: 'Rate decision with focus on liquidity stance and inflation outlook.',
  },
  {
    id: 'event-in-2',
    title: 'India CPI YoY',
    country: 'India',
    impact: 'High' as const,
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    description: 'Expectations peg inflation cooling towards 4.2%.',
  },
  {
    id: 'event-in-3',
    title: 'US CPI YoY',
    country: 'United States',
    impact: 'Medium' as const,
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 9).toISOString(),
    description: 'Key event for INR cross volatility during the US session.',
  },
];

const tradeQuotes: Record<string, QuoteInfo> = {
  'USD/INR': { bid: 83.408, ask: 83.418, spread: 1 },
  'EUR/INR': { bid: 89.396, ask: 89.412, spread: 1.6 },
  'GBP/INR': { bid: 104.72, ask: 104.76, spread: 1.8 },
  'JPY/INR': { bid: 0.5572, ask: 0.5576, spread: 0.4 },
};

export default function Page(): React.JSX.Element {
  return (
    <TradingDashboard
      balance={8_640_000}
      equity={9_124_500}
      marginUsed={2_480_000}
      freeMargin={6_644_500}
      marginLevel={367.15}
      todayPnL={78_500}
      todayPnLFormatted={formatInrChange(78_500)}
      chartSymbol="USD/INR"
      chartSeries={chartSeries}
      tradeConfig={{
        defaultSymbol: 'USD/INR',
        availableSymbols: Object.keys(tradeQuotes),
        marketLabel: 'NSE Currency Derivatives',
        quotes: tradeQuotes,
      }}
      openPositions={openPositions}
      positionsCurrency="INR"
      economicEvents={economicEvents}
      calendarHeading="India Economic Calendar"
      timezoneLabel="IST (UTC+5:30)"
      watchlistEntries={watchlistEntries}
      watchlistCurrency="INR"
      newsArticles={newsArticles}
    />
  );
}
