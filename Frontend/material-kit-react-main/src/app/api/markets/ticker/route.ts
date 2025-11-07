import { NextResponse } from 'next/server';

interface MarketTickerItem {
  symbol: string;
  price: number;
  change: number;
}

const ITEMS: MarketTickerItem[] = [
  { symbol: 'S&P 500', price: 5242.83, change: 0.62 },
  { symbol: 'NIFTY 50', price: 19_873.4, change: -0.18 },
  { symbol: 'AAPL', price: 193.26, change: 1.15 },
  { symbol: 'RELIANCE.NS', price: 2541.6, change: 0.42 },
  { symbol: 'NASDAQ', price: 14_982.5, change: 0.88 },
  { symbol: 'BANKNIFTY', price: 44_512.2, change: -0.27 },
  { symbol: 'HDFCBANK.NS', price: 1532.1, change: 0.33 },
  { symbol: 'TSLA', price: 247.65, change: -1.02 },
];

export function GET(): NextResponse {
  return NextResponse.json(
    { items: ITEMS },
    {
      headers: {
        'Cache-Control': 's-maxage=180, stale-while-revalidate=900',
      },
    },
  );
}
