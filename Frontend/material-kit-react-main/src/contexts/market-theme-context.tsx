'use client';

import * as React from 'react';

export type MarketType = 'usa' | 'india';

export interface MarketTheme {
  market: MarketType;
  colors: {
    background: string;
    surface: string;
    accent: string;
    accentHover: string;
    success: string;
    danger: string;
    grid: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  currency: {
    symbol: string;
    code: string;
    locale: string;
  };
  dateFormat: string;
}

const usaTheme: MarketTheme = {
  market: 'usa',
  colors: {
    background: '#0a1929',
    surface: '#132f4c',
    accent: '#0B6EFD',
    accentHover: '#0958d9',
    success: '#10b981',
    danger: '#ef4444',
    grid: 'rgba(255, 255, 255, 0.08)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(255, 255, 255, 0.12)',
  },
  currency: {
    symbol: '$',
    code: 'USD',
    locale: 'en-US',
  },
  dateFormat: 'MM/DD/YYYY',
};

const indiaTheme: MarketTheme = {
  market: 'india',
  colors: {
    background: '#1a0f00',
    surface: '#2d1a00',
    accent: '#FF6F00',
    accentHover: '#e65100',
    success: '#4caf50',
    danger: '#f44336',
    grid: 'rgba(255, 255, 255, 0.08)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(255, 255, 255, 0.12)',
  },
  currency: {
    symbol: '₹',
    code: 'INR',
    locale: 'en-IN',
  },
  dateFormat: 'DD/MM/YYYY',
};

export interface MarketThemeContextValue {
  marketTheme: MarketTheme;
  setMarket: (market: MarketType) => void;
  formatCurrency: (value: number) => string;
  formatDate: (date: Date) => string;
}

const MarketThemeContext = React.createContext<MarketThemeContextValue | undefined>(undefined);

export interface MarketThemeProviderProps {
  children: React.ReactNode;
  defaultMarket?: MarketType;
}

export function MarketThemeProvider({
  children,
  defaultMarket = 'usa',
}: MarketThemeProviderProps): React.JSX.Element {
  const [currentMarket, setCurrentMarket] = React.useState<MarketType>(defaultMarket);

  const marketTheme = currentMarket === 'usa' ? usaTheme : indiaTheme;

  // Apply CSS variables to document root
  React.useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.remove('mui-light', 'mui-dark');
    root.classList.add('mui-dark');
    body.classList.remove('mui-light', 'mui-dark');
    body.classList.add('mui-dark');

    for (const [key, value] of Object.entries(marketTheme.colors)) {
      root.style.setProperty(`--market-${key}`, value);
    }
  }, [marketTheme]);

  const formatCurrency = React.useCallback(
    (value: number): string => {
      return new Intl.NumberFormat(marketTheme.currency.locale, {
        style: 'currency',
        currency: marketTheme.currency.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
    [marketTheme.currency]
  );

  const formatDate = React.useCallback(
    (date: Date): string => {
      return new Intl.DateTimeFormat(marketTheme.currency.locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    },
    [marketTheme.currency.locale]
  );

  const contextValue = React.useMemo(
    () => ({
      marketTheme,
      setMarket: setCurrentMarket,
      formatCurrency,
      formatDate,
    }),
    [marketTheme, formatCurrency, formatDate]
  );

  return <MarketThemeContext.Provider value={contextValue}>{children}</MarketThemeContext.Provider>;
}

export function useMarketTheme(): MarketThemeContextValue {
  const context = React.useContext(MarketThemeContext);
  if (!context) {
    throw new Error('useMarketTheme must be used within MarketThemeProvider');
  }
  return context;
}
