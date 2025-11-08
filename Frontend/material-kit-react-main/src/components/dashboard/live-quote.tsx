'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { TrendUp as TrendUpIcon, TrendDown as TrendDownIcon } from '@phosphor-icons/react/dist/ssr';

interface QuoteData {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  bid?: number;
  ask?: number;
  high?: number;
  low?: number;
  open?: number;
  prev_close?: number;
  volume?: number;
  timestamp: number;
  source?: string;
}

interface LiveQuoteProps {
  symbol: string;
  compact?: boolean;
}

export function LiveQuote({ symbol, compact = false }: LiveQuoteProps): React.JSX.Element {
  const [quote, setQuote] = React.useState<QuoteData | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [priceFlash, setPriceFlash] = React.useState<'up' | 'down' | null>(null);
  const wsRef = React.useRef<WebSocket | null>(null);
  const prevPriceRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        const ws = new WebSocket(`ws://localhost:8000/ws/quote/${symbol}`);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log(`✅ Quote WebSocket connected for ${symbol}`);
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'quote' && data.data) {
              const newQuote = data.data;
              
              // Flash animation on price change
              if (prevPriceRef.current !== null && newQuote.price !== prevPriceRef.current) {
                setPriceFlash(newQuote.price > prevPriceRef.current ? 'up' : 'down');
                setTimeout(() => setPriceFlash(null), 300);
              }
              
              prevPriceRef.current = newQuote.price;
              setQuote(newQuote);
            }
          } catch (error) {
            console.error('Failed to parse quote data:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };

        ws.onclose = () => {
          console.log(`Quote WebSocket disconnected for ${symbol}, reconnecting in 3s...`);
          setIsConnected(false);
          reconnectTimeout = setTimeout(connect, 3000);
        };
      } catch (error) {
        console.error('Failed to connect quote WebSocket:', error);
        reconnectTimeout = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbol]);

  if (!isConnected || !quote) {
    return (
      <Card sx={{ height: compact ? 'auto' : '100%' }}>
        <CardContent>
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            Connecting to {symbol}...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const isPositive = quote.change >= 0;
  const trendColor = isPositive ? 'success.main' : 'error.main';
  const TrendIcon = isPositive ? TrendUpIcon : TrendDownIcon;

  const flashBg = priceFlash === 'up' 
    ? 'rgba(0, 255, 0, 0.2)' 
    : priceFlash === 'down' 
    ? 'rgba(255, 0, 0, 0.2)' 
    : 'transparent';

  if (compact) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={700}>
                {quote.symbol}
              </Typography>
              {isConnected && (
                <Chip
                  label="LIVE"
                  size="small"
                  color="success"
                  sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
                />
              )}
            </Box>
            <Box
              sx={{
                bgcolor: flashBg,
                transition: 'background-color 0.3s ease',
                p: 1,
                borderRadius: 1,
              }}
            >
              <Typography variant="h4" fontWeight={700} fontFamily="monospace">
                ${quote.price.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color: trendColor, display: 'flex', alignItems: 'center' }}>
                <TrendIcon size={20} weight="bold" />
              </Box>
              <Typography variant="body2" sx={{ color: trendColor, fontWeight: 600 }}>
                {isPositive ? '+' : ''}{quote.change.toFixed(2)} ({isPositive ? '+' : ''}{quote.change_percent.toFixed(2)}%)
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={700}>
              {quote.symbol}
            </Typography>
            <Stack direction="row" spacing={1}>
              {quote.source && (
                <Chip
                  label={quote.source.toUpperCase()}
                  size="small"
                  variant="outlined"
                  sx={{ height: 24, fontSize: '0.7rem' }}
                />
              )}
              {isConnected && (
                <Chip
                  label="LIVE"
                  size="small"
                  color="success"
                  sx={{ height: 24, fontSize: '0.7rem', fontWeight: 700 }}
                />
              )}
            </Stack>
          </Box>

          {/* Price */}
          <Box
            sx={{
              bgcolor: flashBg,
              transition: 'background-color 0.3s ease',
              p: 2,
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="h3" fontWeight={700} fontFamily="monospace">
              ${quote.price.toFixed(2)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
              <Box sx={{ color: trendColor, display: 'flex', alignItems: 'center' }}>
                <TrendIcon size={24} weight="bold" />
              </Box>
              <Typography variant="h6" sx={{ color: trendColor, fontWeight: 600 }}>
                {isPositive ? '+' : ''}{quote.change.toFixed(2)} ({isPositive ? '+' : ''}{quote.change_percent.toFixed(2)}%)
              </Typography>
            </Box>
          </Box>

          {/* Bid/Ask */}
          {quote.bid && quote.ask && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1, bgcolor: 'background.level1', p: 1.5, borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  BID
                </Typography>
                <Typography variant="h6" fontFamily="monospace" color="success.main" fontWeight={600}>
                  ${quote.bid.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, bgcolor: 'background.level1', p: 1.5, borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  ASK
                </Typography>
                <Typography variant="h6" fontFamily="monospace" color="error.main" fontWeight={600}>
                  ${quote.ask.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Day Range */}
          {quote.high && quote.low && (
            <Box sx={{ bgcolor: 'background.level1', p: 1.5, borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                DAY RANGE
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" fontFamily="monospace">
                  Low: ${quote.low.toFixed(2)}
                </Typography>
                <Typography variant="body2" fontFamily="monospace">
                  High: ${quote.high.toFixed(2)}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  height: 4,
                  bgcolor: 'divider',
                  borderRadius: 2,
                  mt: 1,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${((quote.price - quote.low) / (quote.high - quote.low)) * 100}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 12,
                    height: 12,
                    bgcolor: trendColor,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: 'background.paper',
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Stats Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
            {quote.open && (
              <Box sx={{ bgcolor: 'background.level1', p: 1, borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  OPEN
                </Typography>
                <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
                  ${quote.open.toFixed(2)}
                </Typography>
              </Box>
            )}
            {quote.prev_close && (
              <Box sx={{ bgcolor: 'background.level1', p: 1, borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  PREV CLOSE
                </Typography>
                <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
                  ${quote.prev_close.toFixed(2)}
                </Typography>
              </Box>
            )}
            {quote.volume && (
              <Box sx={{ bgcolor: 'background.level1', p: 1, borderRadius: 1, gridColumn: 'span 2' }}>
                <Typography variant="caption" color="text.secondary">
                  VOLUME
                </Typography>
                <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
                  {quote.volume.toLocaleString()}
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
