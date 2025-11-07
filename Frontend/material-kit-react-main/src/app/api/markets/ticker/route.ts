import { NextResponse } from 'next/server';

interface MarketTickerItem {
  symbol: string;
  price: number;
  change: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export async function GET(): Promise<NextResponse> {
  try {
    // Try to fetch from backend
    const response = await fetch(`${API_BASE_URL}/market/ticker`, {
      next: { revalidate: 30 }, // Cache for 30 seconds
    });
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { items: data.items },
        {
          headers: {
            'Cache-Control': 's-maxage=30, stale-while-revalidate=300',
          },
        },
      );
    }
  } catch (error) {
    console.error('Failed to fetch live ticker data:', error);
  }

  // Fallback data if backend is unavailable
  const FALLBACK_ITEMS: MarketTickerItem[] = [
    { symbol: 'S&P 500', price: 5242.83, change: 0.62 },
    { symbol: 'NIFTY 50', price: 19_873.4, change: -0.18 },
    { symbol: 'AAPL', price: 193.26, change: 1.15 },
    { symbol: 'RELIANCE.NS', price: 2541.6, change: 0.42 },
    { symbol: 'NASDAQ', price: 14_982.5, change: 0.88 },
    { symbol: 'BANKNIFTY', price: 44_512.2, change: -0.27 },
    { symbol: 'HDFCBANK.NS', price: 1532.1, change: 0.33 },
    { symbol: 'TSLA', price: 247.65, change: -1.02 },
  ];

  return NextResponse.json(
    { items: FALLBACK_ITEMS },
    {
      headers: {
        'Cache-Control': 's-maxage=180, stale-while-revalidate=900',
      },
    },
  );
}

