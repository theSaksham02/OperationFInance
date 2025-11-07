'use client';

import * as React from 'react';

const API_BASE_URL = typeof window !== 'undefined' 
  ? (window as any).NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
  : 'http://localhost:8000';

interface QuoteData {
  symbol: string;
  market: string;
  price: number;
  change: number;
  change_percent: number;
  high: number;
  low: number;
  open: number;
  prev_close: number;
  timestamp?: number;
  volume?: number;
}

interface UseLiveQuoteOptions {
  symbol: string;
  market?: 'US' | 'IN';
  refreshInterval?: number; // in milliseconds
  enabled?: boolean;
}

interface UseLiveQuoteResult {
  data: QuoteData | null;
  error: string | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useLiveQuote({
  symbol,
  market = 'US',
  refreshInterval = 5000, // 5 seconds default
  enabled = true,
}: UseLiveQuoteOptions): UseLiveQuoteResult {
  const [data, setData] = React.useState<QuoteData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchQuote = React.useCallback(async () => {
    if (!symbol || !enabled) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/market/quote/${symbol}?market=${market}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch quote: ${response.statusText}`);
      }

      const quoteData = (await response.json()) as QuoteData;
      setData(quoteData);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quote';
      setError(errorMessage);
      console.error('Quote fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [symbol, market, enabled]);

  // Initial fetch
  React.useEffect(() => {
    void fetchQuote();
  }, [fetchQuote]);

  // Set up polling
  React.useEffect(() => {
    if (!enabled || !refreshInterval) {
      return undefined;
    }

    const interval = setInterval(() => {
      void fetchQuote();
    }, refreshInterval);

    return () => {
      clearInterval(interval);
    };
  }, [fetchQuote, refreshInterval, enabled]);

  return {
    data,
    error,
    isLoading,
    refresh: fetchQuote,
  };
}

// Hook for fetching multiple quotes at once
interface UseMultipleQuotesOptions {
  symbols: string[];
  market?: 'US' | 'IN';
  refreshInterval?: number;
  enabled?: boolean;
}

interface QuoteSummary {
  symbol: string;
  price: number;
  change_percent: number;
  high: number;
  low: number;
  error?: string;
}

interface UseMultipleQuotesResult {
  data: QuoteSummary[];
  error: string | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useMultipleQuotes({
  symbols,
  market = 'US',
  refreshInterval = 10000, // 10 seconds default
  enabled = true,
}: UseMultipleQuotesOptions): UseMultipleQuotesResult {
  const [data, setData] = React.useState<QuoteSummary[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchQuotes = React.useCallback(async () => {
    if (!symbols || symbols.length === 0 || !enabled) {
      return;
    }

    try {
      const symbolsParam = symbols.join(',');
      const response = await fetch(`${API_BASE_URL}/market/quotes?symbols=${symbolsParam}&market=${market}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch quotes: ${response.statusText}`);
      }

      const result = (await response.json()) as { quotes: QuoteSummary[] };
      setData(result.quotes);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quotes';
      setError(errorMessage);
      console.error('Multiple quotes fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [symbols, market, enabled]);

  // Initial fetch
  React.useEffect(() => {
    void fetchQuotes();
  }, [fetchQuotes]);

  // Set up polling
  React.useEffect(() => {
    if (!enabled || !refreshInterval) {
      return undefined;
    }

    const interval = setInterval(() => {
      void fetchQuotes();
    }, refreshInterval);

    return () => {
      clearInterval(interval);
    };
  }, [fetchQuotes, refreshInterval, enabled]);

  return {
    data,
    error,
    isLoading,
    refresh: fetchQuotes,
  };
}
