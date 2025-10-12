export interface PortfolioPosition {
  symbol: string;
  market: 'US' | 'IN';
  shares: number;
  avgPrice: number;
  borrowRateAnnual: number | null;
  currentPrice?: number | null;
  currentValue?: number | null;
  unrealizedPnl?: number | null;
}

export interface PortfolioSummary {
  cashBalance: number;
  equity: number;
  maintenanceRequired: number;
  maintenanceRate: number;
  marginHeadroom: number;
  inMarginCall: boolean;
  positions: PortfolioPosition[];
}

export interface TransactionRecord {
  id: string;
  symbol: string;
  market: 'US' | 'IN';
  type: string;
  quantity: number;
  price: number;
  fees: number;
  totalAmount: number;
  timestamp: string;
}

export interface PortfolioApiResponse {
  cash_balance: number;
  equity: number;
  maintenance_required: number;
  maintenance_rate: number;
  margin_headroom: number;
  in_margin_call: boolean;
  positions: Array<{
    symbol: string;
    market: 'US' | 'IN';
    shares: number;
    avg_price: number;
    borrow_rate_annual: number | null;
    current_price?: number | null;
    current_value?: number | null;
    unrealized_pnl?: number | null;
  }>;
}
