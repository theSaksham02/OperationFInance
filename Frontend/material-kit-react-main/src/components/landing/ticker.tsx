"use client";

import * as React from 'react';
import { keyframes } from '@emotion/react';
import { Box, Chip, Container, Stack, Typography } from '@mui/material';
import type { Theme } from '@mui/material/styles';

interface MarketTickerItem {
  symbol: string;
  price: number;
  change: number;
}

interface MarketTickerResponse {
  items: MarketTickerItem[];
}

const scrollAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const FALLBACK_ITEMS: MarketTickerItem[] = [
  { symbol: 'S&P 500', price: 5242.83, change: 0.62 },
  { symbol: 'NIFTY 50', price: 19873.4, change: -0.18 },
  { symbol: 'AAPL', price: 193.26, change: 1.15 },
  { symbol: 'RELIANCE.NS', price: 2541.6, change: 0.42 },
  { symbol: 'NASDAQ', price: 14982.5, change: 0.88 },
  { symbol: 'BANKNIFTY', price: 44512.2, change: -0.27 },
];

export function LandingTicker(): React.JSX.Element {
  const [items, setItems] = React.useState<MarketTickerItem[]>(FALLBACK_ITEMS);

  React.useEffect(() => {
    const controller = new AbortController();

    fetch('/api/markets/ticker', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as MarketTickerResponse;
        if (Array.isArray(payload.items) && payload.items.length > 0) {
          setItems(payload.items);
        }
      })
      .catch(() => {
        // Ignore network failures; fallback data keeps the ticker populated.
      });

    return () => {
      controller.abort();
    };
  }, []);

  const doubledItems = React.useMemo(() => [...items, ...items], [items]);

  return (
    <Box component="section" sx={{ borderBlock: 1, borderColor: 'divider', backgroundColor: 'background.level1' }}>
      <Container maxWidth={false} disableGutters sx={{ maxWidth: 'none' }}>
        <Box
          sx={(theme: Theme) => ({
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            py: 2.5,
            background: `linear-gradient(90deg, ${theme.palette.background.level1}, ${theme.palette.background.level2})`,
          })}
        >
          <Stack
            direction="row"
            spacing={3}
            sx={{
              animation: `${scrollAnimation} 45s linear infinite`,
              width: 'max-content',
            }}
          >
            {doubledItems.map((item: MarketTickerItem, index: number) => (
              <Stack key={`${item.symbol}-${index}`} direction="row" spacing={2} alignItems="center">
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {item.symbol}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  {item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </Typography>
                <Chip
                  size="small"
                  label={`${item.change > 0 ? '+' : ''}${item.change.toFixed(2)}%`}
                  color={item.change >= 0 ? 'success' : 'error'}
                  sx={{ fontWeight: 600, borderRadius: 999 }}
                />
              </Stack>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
