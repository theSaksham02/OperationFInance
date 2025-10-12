'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { TransactionRecord } from '@/types/portfolio';
import { authorizedFetch, parseErrorResponse, ApiError } from '@/lib/api/http';

interface TransactionsState {
  data: TransactionRecord[];
  isLoading: boolean;
  error: string | null;
}

function mapTransaction(payload: Record<string, unknown>): TransactionRecord {
  return {
    id: String(payload.id ?? ''),
    symbol: String(payload.symbol ?? ''),
    market: (payload.market as TransactionRecord['market']) ?? 'US',
    type: String(payload.type ?? ''),
    quantity: Number(payload.quantity ?? 0),
    price: Number(payload.price ?? 0),
    fees: Number(payload.fees ?? 0),
    totalAmount: Number(payload.total_amount ?? payload.totalAmount ?? 0),
    timestamp: String(payload.timestamp ?? ''),
  };
}

export function useTransactionsData(limit = 50): {
  data: TransactionRecord[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const [state, setState] = useState<TransactionsState>({ data: [], isLoading: true, error: null });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authorizedFetch(`/portfolio/transactions?limit=${limit}`);

      if (!response.ok) {
        const message = await parseErrorResponse(response);
        setState({ data: [], isLoading: false, error: message });
        return;
      }

      const payload = (await response.json()) as Array<Record<string, unknown>>;
      setState({ data: payload.map((item) => mapTransaction(item)), isLoading: false, error: null });
    } catch (error) {
      if (error instanceof ApiError) {
        setState({ data: [], isLoading: false, error: error.message });
        return;
      }

      console.error(error);
      setState({ data: [], isLoading: false, error: 'Unable to load transactions right now.' });
    }
  }, [limit]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (!isMounted) {
        return;
      }

      await load();
    })().catch(() => {
      // noop
    });

    return () => {
      isMounted = false;
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
