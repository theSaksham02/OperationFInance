'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { keyframes } from '@mui/system';

interface TickerData {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume?: number;
}

const scroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

export function TickerTape(): React.JSX.Element {
  const [tickers, setTickers] = React.useState<TickerData[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);
  const wsRef = React.useRef<WebSocket | null>(null);

  React.useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        const ws = new WebSocket('ws://localhost:8000/ws/tickers');
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('✅ Ticker WebSocket connected');
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'tickers' && Array.isArray(data.data)) {
              setTickers(data.data);
            }
          } catch (error) {
            console.error('Failed to parse ticker data:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected, reconnecting in 3s...');
          setIsConnected(false);
          reconnectTimeout = setTimeout(connect, 3000);
        };
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
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
  }, []);

  if (!isConnected) {
    return (
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-level1)',
          borderBottom: '1px solid var(--mui-palette-divider)',
          p: 1,
          textAlign: 'center',
          color: 'text.secondary',
          fontSize: '0.875rem',
        }}
      >
        Connecting to live market data...
      </Box>
    );
  }

  if (tickers.length === 0) {
    return (
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-level1)',
          borderBottom: '1px solid var(--mui-palette-divider)',
          p: 1,
          textAlign: 'center',
          color: 'text.secondary',
          fontSize: '0.875rem',
        }}
      >
        Loading tickers...
      </Box>
    );
  }

  // Duplicate tickers for seamless infinite scroll
  const duplicatedTickers = [...tickers, ...tickers];

  return (
    <Box
      sx={{
        bgcolor: '#0a0a0a',
        borderBottom: '2px solid #1a1a1a',
        overflow: 'hidden',
        position: 'relative',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          animation: `${scroll} 40s linear infinite`,
          '&:hover': {
            animationPlayState: 'paused',
          },
        }}
      >
        {duplicatedTickers.map((ticker, index) => {
          const isPositive = ticker.change >= 0;
          const color = isPositive ? '#00ff00' : '#ff0000';
          const arrow = isPositive ? '▲' : '▼';

          return (
            <Box
              key={`${ticker.symbol}-${index}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minWidth: '200px',
                px: 2,
                py: 1,
                bgcolor: '#1a1a1a',
                borderRadius: 1,
                border: '1px solid #2a2a2a',
                whiteSpace: 'nowrap',
              }}
            >
              <Box
                component="span"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  color: '#ffffff',
                  fontFamily: 'monospace',
                }}
              >
                {ticker.symbol}
              </Box>
              <Box
                component="span"
                sx={{
                  fontSize: '0.875rem',
                  color: '#ffffff',
                  fontFamily: 'monospace',
                }}
              >
                ${ticker.price.toFixed(2)}
              </Box>
              <Box
                component="span"
                sx={{
                  fontSize: '0.75rem',
                  color,
                  fontFamily: 'monospace',
                  fontWeight: 600,
                }}
              >
                {arrow} {Math.abs(ticker.change_percent).toFixed(2)}%
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Status indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: '#00ff00',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.5 },
            },
          }}
        />
        <Box
          component="span"
          sx={{
            fontSize: '0.75rem',
            color: '#00ff00',
            fontFamily: 'monospace',
          }}
        >
          LIVE
        </Box>
      </Box>
    </Box>
  );
}
