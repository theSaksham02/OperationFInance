'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { PortfolioSummary, PortfolioApiResponse, PortfolioPosition } from '@/types/portfolio';
import { authorizedFetch, parseErrorResponse, ApiError } from '@/lib/api/http';

interface PortfolioState {
  data: PortfolioSummary | null;
  isLoading: boolean;
  error: string | null;
}

function mapPosition(position: PortfolioApiResponse['positions'][number]): PortfolioPosition {
  return {
    symbol: position.symbol,
    market: position.market,
    shares: position.shares,
    avgPrice: position.avg_price,
    borrowRateAnnual: position.borrow_rate_annual,
    currentPrice: position.current_price ?? null,
    currentValue: position.current_value ?? null,
    unrealizedPnl: position.unrealized_pnl ?? null,
  };
}

function mapSummary(payload: PortfolioApiResponse): PortfolioSummary {
  return {
    cashBalance: payload.cash_balance,
    equity: payload.equity,
    maintenanceRequired: payload.maintenance_required,
    maintenanceRate: payload.maintenance_rate,
    marginHeadroom: payload.margin_headroom,
    inMarginCall: payload.in_margin_call,
    positions: payload.positions.map((position) => mapPosition(position)),
  };
}

export function usePortfolioData(): {
  data: PortfolioSummary | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const [state, setState] = useState<PortfolioState>({ data: null, isLoading: true, error: null });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authorizedFetch('/portfolio');

      if (!response.ok) {
        const message = await parseErrorResponse(response);
        setState({ data: null, isLoading: false, error: message });
        return;
      }

      const payload = (await response.json()) as PortfolioApiResponse;
      setState({ data: mapSummary(payload), isLoading: false, error: null });
    } catch (error) {
      if (error instanceof ApiError) {
        setState({ data: null, isLoading: false, error: error.message });
        return;
      }

      console.error(error);
      setState({ data: null, isLoading: false, error: 'Unable to load portfolio data right now.' });
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    (async () => {
      if (!isActive) {
        return;
      }

      await load();
    })().catch(() => {
      // noop
    });

    return () => {
      isActive = false;
    };
  }, [load]);

  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  return useMemo(() => ({
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    refresh,
  }), [state.data, state.isLoading, state.error, refresh]);
}
