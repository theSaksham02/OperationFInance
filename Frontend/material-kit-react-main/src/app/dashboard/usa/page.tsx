/* eslint-disable unicorn/numeric-separators-style */
import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { TradingDashboard } from '@/components/dashboard/uptrade/trading-dashboard';
import type { OpenPosition, QuoteInfo, AdvancedChartSeries } from '@/components/dashboard/uptrade';
import type { DeskVolumeDatum } from '@/components/dashboard/shared/desk-volume-heatmap';

export const metadata = { title: `USA Forex Market | Dashboard | ${config.site.name}` } satisfies Metadata;

const chartSeries: AdvancedChartSeries = [
  {
    name: 'Price',
    data: Array.from({ length: 60 }).map((_, index) => {
      const interval = 1_000 * 60 * 60 * 4; // 4-hour candles for US macro coverage
      const start = Date.now() - interval * 60;
      const timestamp = start + index * interval;
      const base = 1.068 + Math.sin(index / 4) * 0.014;
      return { x: timestamp, y: Number((base + index * 0.0006).toFixed(5)) };
    }),
  },
];

const openPositions: OpenPosition[] = [
  {
    id: 'pos-us-1',
    instrument: 'EUR/USD',
    side: 'BUY',
    sizeLots: 1.6,
    openPrice: 1.07185,
    currentPrice: 1.07942,
    stopLoss: 1.0665,
    takeProfit: 1.0848,
    pipPnL: 75.7,
    currencyPnL: 1_095.25,
  },
  {
    id: 'pos-us-2',
    instrument: 'USD/JPY',
    side: 'SELL',
    sizeLots: 2,
    openPrice: 155.28,
    currentPrice: 154.71,
    stopLoss: 156.1,
    takeProfit: 153.8,
    pipPnL: 57,
    currencyPnL: 1_045.6,
  },
  {
    id: 'pos-us-3',
    instrument: 'XAU/USD',
    side: 'BUY',
    sizeLots: 0.5,
    openPrice: 2_368.4,
    currentPrice: 2_388.2,
    stopLoss: 2_342,
    takeProfit: 2_410.5,
    pipPnL: 198.4,
    currencyPnL: 992.1,
  },
];

const deskVolumeData: DeskVolumeDatum[] = [
  { desk: 'NYC FX Pod', regionLabel: 'New York · EST', exposure: 14.8, change: 2.1 },
  { desk: 'Chicago Futures', regionLabel: 'Chicago · CST', exposure: 10.6, change: -0.9 },
  { desk: 'LA Options', regionLabel: 'Los Angeles · PST', exposure: 8.2, change: 1.3 },
  { desk: 'Toronto Macro', regionLabel: 'Toronto · EST', exposure: 7.9, change: 0.6 },
];

const watchlistEntries = [
  { symbol: 'USD/CAD', price: 1.362, changePercent: -0.14 },
  { symbol: 'AUD/USD', price: 0.662, changePercent: 0.21 },
  { symbol: 'BTC/USD', price: 68_321.45, changePercent: 3.4 },
  { symbol: 'S&P 500', price: 5_625.1, changePercent: 0.48 },
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
    headline: 'US Treasury yields cool ahead of CPI release',
    source: 'WSJ',
    url: 'https://www.wsj.com',
    publishedAt: new Date(Date.now() - 1_000 * 60 * 40).toISOString(),
  },
  {
    id: 'news-us-3',
    headline: 'Crude rebound buoys commodity FX pairs into late session',
    source: 'Reuters',
    url: 'https://www.reuters.com',
    publishedAt: new Date(Date.now() - 1_000 * 60 * 75).toISOString(),
  },
];

const economicEvents = [
  {
    id: 'event-us-1',
    title: 'FOMC Minutes Release',
    country: 'United States',
    impact: 'High' as const,
    scheduledAt: new Date(Date.now() + 1_000 * 60 * 90).toISOString(),
    description: 'Desks monitor language around the pace of balance sheet runoff.',
  },
  {
    id: 'event-us-2',
    title: 'Initial Jobless Claims',
    country: 'United States',
    impact: 'Medium' as const,
    scheduledAt: new Date(Date.now() + 1_000 * 60 * 60 * 6).toISOString(),
    description: 'Consensus looks for only a modest rise as seasonal effects fade.',
  },
  {
    id: 'event-us-3',
    title: 'Tokyo Open Liquidity Check',
    country: 'Japan',
    impact: 'Medium' as const,
    scheduledAt: new Date(Date.now() + 1_000 * 60 * 60 * 11).toISOString(),
    description: 'Sets the tone for the USD/JPY crossover once Asia takes the book.',
  },
];

const tradeQuotes: Record<string, QuoteInfo> = {
  'EUR/USD': { bid: 1.07938, ask: 1.07958, spread: 2 },
  'GBP/USD': { bid: 1.2631, ask: 1.2634, spread: 3 },
  'USD/JPY': { bid: 154.71, ask: 154.74, spread: 3 },
  'XAU/USD': { bid: 2_387.8, ask: 2_388.4, spread: 6 },
};

export default function Page(): React.JSX.Element {
  return (
    <TradingDashboard
      balance={152_840.75}
      equity={165_420.21}
      marginUsed={43_105.5}
      freeMargin={122_314.71}
      marginLevel={384.04}
      todayPnL={4_520.38}
      todayPnLFormatted="+$4,520.38"
      chartSymbol="EUR/USD"
      chartSeries={chartSeries}
      tradeConfig={{
        defaultSymbol: 'EUR/USD',
        availableSymbols: Object.keys(tradeQuotes),
        marketLabel: 'New York FX Session',
        quotes: tradeQuotes,
      }}
      heroEyebrow="US session spotlight"
      heroDescription="Track the New York desks as liquidity rolls through late US hours and prepare for the Tokyo hand-off."
      heroGradient="linear-gradient(135deg, rgba(14,116,255,0.35), rgba(5,16,48,0.95))"
      deskVolumeData={deskVolumeData}
      openPositions={openPositions}
      positionsCurrency="USD"
      economicEvents={economicEvents}
      calendarHeading="US Macro Pulse"
      timezoneLabel="EST (UTC-5)"
      watchlistEntries={watchlistEntries}
      watchlistCurrency="USD"
      newsArticles={newsArticles}
    />
  );
}
