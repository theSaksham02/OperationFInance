import { NextResponse } from 'next/server';

interface MarketTickerItem {
  symbol: string;
  price: number;
  change: number;
}

// Ensure we have a valid API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function GET(): Promise<NextResponse> {
  try {
    console.log('[Ticker API] Fetching from:', `${API_BASE_URL}/market/ticker`);
    
    // Try to fetch from backend with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${API_BASE_URL}/market/ticker`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Disable caching for real-time data
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log('[Ticker API] Backend response:', data);
      
      // Ensure we have items array
      if (data && Array.isArray(data.items)) {
        return NextResponse.json(
          { items: data.items },
          {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
            },
          },
        );
      }
    }
    
    console.log('[Ticker API] Backend returned non-OK status:', response.status);
  } catch (error) {
    if (error instanceof Error) {
      console.error('[Ticker API] Failed to fetch live ticker data:', error.message);
    } else {
      console.error('[Ticker API] Failed to fetch live ticker data:', error);
    }
  }

  // Fallback data if backend is unavailable
  console.log('[Ticker API] Using fallback data');
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
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    },
  );
}


