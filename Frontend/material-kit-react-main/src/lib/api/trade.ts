'use client';

import { authorizedFetch, parseErrorResponse, ApiError } from '@/lib/api/http';

export type BackendMarket = 'US' | 'IN';
export type TradeIntent = 'buy' | 'sell' | 'short' | 'cover';

export interface TradeRequest {
  symbol: string;
  quantity: number;
  market: BackendMarket;
  intent: TradeIntent;
}

export interface TradeResponse {
  status: 'ok';
  symbol: string;
  qty: number;
  price: number;
  borrow_rate_annual?: number | null;
}

function endpointForIntent(intent: TradeIntent): string {
  switch (intent) {
    case 'buy':
      return '/trade/buy';
    case 'sell':
      return '/trade/sell';
    case 'short':
      return '/trade/short';
    case 'cover':
      return '/trade/cover';
    default: {
      throw new ApiError('Unsupported trade intent.', 400);
    }
  }
}

export async function submitTrade({ symbol, quantity, market, intent }: TradeRequest): Promise<TradeResponse> {
  const url = new URL(endpointForIntent(intent), 'http://placeholder');
  url.searchParams.set('symbol', symbol);
  url.searchParams.set('market', market);
  url.searchParams.set('qty', quantity.toString());

  const path = `${url.pathname}?${url.searchParams.toString()}`;
  const response = await authorizedFetch(path, { method: 'POST' });

  if (!response.ok) {
    const message = await parseErrorResponse(response);
    throw new ApiError(message, response.status);
  }

  const payload = (await response.json()) as TradeResponse;
  return payload;
}
