'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { authClient, getAccessToken, API_BASE_URL } from '@/lib/auth/client';
import type { PortfolioSummary, PortfolioApiResponse, PortfolioPosition } from '@/types/portfolio';

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

async function parseError(response: Response): Promise<string> {
  try {
    const body = await response.json();

    if (typeof body?.detail === 'string') {
      return body.detail;
    }

    if (Array.isArray(body?.detail) && body.detail.length > 0 && typeof body.detail[0]?.msg === 'string') {
      return body.detail[0].msg;
    }

    if (typeof body?.message === 'string') {
      return body.message;
    }
  } catch {
    // ignore parse errors
  }

  if (response.status === 401) {
    return 'Your session has expired. Please sign in again.';
  }

  return response.statusText || 'Request failed';
}

export function usePortfolioData(): {
  data: PortfolioSummary | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const [state, setState] = useState<PortfolioState>({ data: null, isLoading: true, error: null });

  const load = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      setState({ data: null, isLoading: false, error: 'You are not authenticated.' });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`${API_BASE_URL}/portfolio`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        await authClient.signOut();
        setState({ data: null, isLoading: false, error: 'Session expired. Please sign in again.' });
        return;
      }

      if (!response.ok) {
        const message = await parseError(response);
        setState({ data: null, isLoading: false, error: message });
        return;
      }

      const payload = (await response.json()) as PortfolioApiResponse;
      setState({ data: mapSummary(payload), isLoading: false, error: null });
    } catch (error) {
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
