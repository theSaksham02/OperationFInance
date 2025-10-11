import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TradingDashboard } from '@/components/dashboard/uptrade/trading-dashboard';
import type { OpenPosition, QuoteInfo, AdvancedChartSeries } from '@/components/dashboard/uptrade';

export const metadata = { title: `USA Forex Market | Dashboard | ${config.site.name}` } satisfies Metadata;

const chartSeries: AdvancedChartSeries = [
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

const openPositions: OpenPosition[] = [
  {
    id: 'pos-1',
    instrument: 'EUR/USD',
    side: 'BUY',
    sizeLots: 1.5,
    openPrice: 1.07215,
    currentPrice: 1.07842,
    stopLoss: 1.0665,
    takeProfit: 1.085,
    pipPnL: 62.7,
    currencyPnL: 941.25,
  },
  {
    id: 'pos-2',
    instrument: 'USD/JPY',
    side: 'SELL',
    sizeLots: 2.0,
    openPrice: 155.28,
    currentPrice: 154.76,
    stopLoss: 156.1,
    takeProfit: 153.9,
    pipPnL: 52.0,
    currencyPnL: 954.2,
  },
  {
    id: 'pos-3',
    instrument: 'XAU/USD',
    side: 'BUY',
    sizeLots: 0.4,
    openPrice: 2368.4,
    currentPrice: 2385.2,
    stopLoss: 2342.0,
    takeProfit: 2408.3,
    pipPnL: 167.5,
    currencyPnL: 672.1,
  },
];

const watchlistEntries = [
  { symbol: 'USD/CAD', price: 1.362, changePercent: -0.14 },
  { symbol: 'AUD/USD', price: 0.662, changePercent: 0.21 },
  { symbol: 'BTC/USD', price: 68_321.45, changePercent: 3.4 },
];

const newsArticles = [
  {
    id: 'news-us-1',
    headline: 'Dollar steadies as Fed signals extended higher rates',
    source: 'Bloomberg',
    url: 'https://www.bloomberg.com',
    publishedAt: new Date().toISOString(),
  },
  {
    id: 'news-us-2',
    headline: 'US Treasury yields edge lower ahead of CPI release',
    source: 'WSJ',
    url: 'https://www.wsj.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: 'news-us-3',
    headline: 'Crude rebounds, buoying commodity-linked FX pairs',
    source: 'Reuters',
    url: 'https://www.reuters.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
  },
];

const economicEvents = [
  {
    id: 'event-us-1',
    title: 'FOMC Minutes Release',
    country: 'United States',
    impact: 'High' as const,
    scheduledAt: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    description: 'Traders watch for hints on the pace of future rate moves.',
  },
  {
    id: 'event-us-2',
    title: 'Initial Jobless Claims',
    country: 'United States',
    impact: 'Medium' as const,
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    description: 'Consensus expects a slight uptick as seasonal effects fade.',
  },
  {
    id: 'event-us-3',
    title: 'ECB President Speech',
    country: 'Eurozone',
    impact: 'High' as const,
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    description: 'Potential for EUR volatility ahead of policy deliberations.',
  },
];

const tradeQuotes: Record<string, QuoteInfo> = {
  'EUR/USD': { bid: 1.07835, ask: 1.07855, spread: 2 },
  'GBP/USD': { bid: 1.2621, ask: 1.2624, spread: 3 },
  'USD/JPY': { bid: 154.81, ask: 154.84, spread: 3 },
  'XAU/USD': { bid: 2_384.7, ask: 2_385.3, spread: 6 },
};

export default function Page(): React.JSX.Element {
  return (
    <TradingDashboard
      balance={150_240.75}
      equity={163_540.21}
      marginUsed={42_810.5}
      freeMargin={120_729.71}
      marginLevel={381.95}
      chartSymbol="EUR/USD"
      chartSeries={chartSeries}
      tradeConfig={{
        defaultSymbol: 'EUR/USD',
        availableSymbols: Object.keys(tradeQuotes),
        marketLabel: 'New York FX session',
        quotes: tradeQuotes,
      }}
      openPositions={openPositions}
      positionsCurrency="USD"
      economicEvents={economicEvents}
      calendarHeading="US Economic Calendar"
      timezoneLabel="EST"
      watchlistEntries={watchlistEntries}
      watchlistCurrency="USD"
      newsArticles={newsArticles}
    />
  );
}
