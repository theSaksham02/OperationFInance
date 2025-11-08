'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

interface OrderLevel {
  price: number;
  size: number;
  orders: number;
}

interface OrderBookData {
  symbol: string;
  bids: OrderLevel[];
  asks: OrderLevel[];
  timestamp: number;
}

interface OrderBookProps {
  symbol: string;
}

export function OrderBook({ symbol }: OrderBookProps): React.JSX.Element {
  const [bookData, setBookData] = React.useState<OrderBookData | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const wsRef = React.useRef<WebSocket | null>(null);

  React.useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        const ws = new WebSocket(`ws://localhost:8000/ws/orderbook/${symbol}`);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log(`✅ Order book WebSocket connected for ${symbol}`);
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'orderbook') {
              setBookData(data);
            }
          } catch (error) {
            console.error('Failed to parse order book data:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };

        ws.onclose = () => {
          console.log('Order book WebSocket disconnected, reconnecting in 3s...');
          setIsConnected(false);
          reconnectTimeout = setTimeout(connect, 3000);
        };
      } catch (error) {
        console.error('Failed to connect order book WebSocket:', error);
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

  const spread = bookData && bookData.asks[0] && bookData.bids[0]
    ? bookData.asks[0].price - bookData.bids[0].price
    : 0;

  const spreadPercent = bookData && bookData.asks[0] && bookData.bids[0]
    ? ((spread / bookData.bids[0].price) * 100)
    : 0;

  const maxBidSize = bookData ? Math.max(...bookData.bids.map(b => b.size)) : 1;
  const maxAskSize = bookData ? Math.max(...bookData.asks.map(a => a.size)) : 1;

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">Order Book: {symbol}</Typography>
            {isConnected && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                }}
              />
            )}
          </Box>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {!isConnected ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            Connecting to market data...
          </Typography>
        ) : !bookData ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            Loading order book...
          </Typography>
        ) : (
          <Stack spacing={2}>
            {/* Asks (Sell orders) - Display in reverse order (lowest ask at bottom) */}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                ASKS (SELL)
              </Typography>
              <Stack spacing={0.5}>
                {[...bookData.asks].reverse().slice(0, 10).map((ask, index) => {
                  const widthPercent = (ask.size / maxAskSize) * 100;
                  return (
                    <Box
                      key={`ask-${index}`}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 0.5,
                        borderRadius: 0.5,
                        overflow: 'hidden',
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bottom: 0,
                          width: `${widthPercent}%`,
                          bgcolor: 'rgba(255, 0, 0, 0.1)',
                          transition: 'width 0.3s ease',
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'relative',
                          color: 'error.main',
                          fontFamily: 'monospace',
                          fontWeight: 600,
                        }}
                      >
                        ${ask.price.toFixed(2)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'relative',
                          color: 'text.primary',
                          fontFamily: 'monospace',
                        }}
                      >
                        {ask.size.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'relative',
                          color: 'text.secondary',
                          fontFamily: 'monospace',
                        }}
                      >
                        ({ask.orders})
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            {/* Spread */}
            <Box
              sx={{
                py: 1.5,
                textAlign: 'center',
                bgcolor: 'background.level1',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="caption" color="text.secondary" display="block">
                SPREAD
              </Typography>
              <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
                ${spread.toFixed(2)} ({spreadPercent.toFixed(3)}%)
              </Typography>
            </Box>

            {/* Bids (Buy orders) */}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                BIDS (BUY)
              </Typography>
              <Stack spacing={0.5}>
                {bookData.bids.slice(0, 10).map((bid, index) => {
                  const widthPercent = (bid.size / maxBidSize) * 100;
                  return (
                    <Box
                      key={`bid-${index}`}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 0.5,
                        borderRadius: 0.5,
                        overflow: 'hidden',
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bottom: 0,
                          width: `${widthPercent}%`,
                          bgcolor: 'rgba(0, 255, 0, 0.1)',
                          transition: 'width 0.3s ease',
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'relative',
                          color: 'success.main',
                          fontFamily: 'monospace',
                          fontWeight: 600,
                        }}
                      >
                        ${bid.price.toFixed(2)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'relative',
                          color: 'text.primary',
                          fontFamily: 'monospace',
                        }}
                      >
                        {bid.size.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'relative',
                          color: 'text.secondary',
                          fontFamily: 'monospace',
                        }}
                      >
                        ({bid.orders})
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
