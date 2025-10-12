'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export interface MarketPulseTickerItem {
  symbol: string;
  price: number;
  changePercent: number;
  currency?: string;
}

export interface MarketPulseTickerProps {
  title?: string;
  items: MarketPulseTickerItem[];
}

function formatTickerPrice(price: number, currency?: string): string {
  const formatted = price >= 100 ? price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : price.toFixed(5);
  return currency ? `${formatted} ${currency}` : formatted;
}

export function MarketPulseTicker({ title = 'Live Market Pulse', items }: MarketPulseTickerProps): React.JSX.Element {
  const [hovered, setHovered] = React.useState(false);

  const surfaceSx = {
    bgcolor: 'rgba(2,18,34,0.78)',
    border: '1px solid var(--market-border, rgba(255,255,255,0.14))',
    borderRadius: 3,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 18px 55px rgba(1,12,28,0.45)',
  } as const;

  return (
    <Card sx={surfaceSx} component="section">
      <CardContent sx={{ py: 1.5, px: { xs: 2, md: 3 } }}>
        <Grid container rowSpacing={1}>
          <Grid size={{ xs: 12 }}>
            <Chip
              label={title}
              size="small"
              sx={{
                bgcolor: 'rgba(11,110,253,0.18)',
                color: '#ffffff',
                fontWeight: 600,
                letterSpacing: 0.6,
                textTransform: 'uppercase',
              }}
            />
          </Grid>
          <Grid
            size={{ xs: 12 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
              overflow: 'hidden',
              position: 'relative',
              pt: 0.5,
              '&::before, &::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: 60,
                pointerEvents: 'none',
                zIndex: 2,
              },
              '&::before': {
                left: 0,
                background: 'linear-gradient(90deg, rgba(2,18,34,0.88), rgba(2,18,34,0))',
              },
              '&::after': {
                right: 0,
                background: 'linear-gradient(270deg, rgba(2,18,34,0.88), rgba(2,18,34,0))',
              },
              '@keyframes tickerScroll': {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-50%)' },
              },
            }}
          >
            <Grid
              className="ticker-track"
              container
              columnSpacing={3}
              wrap="nowrap"
              sx={{
                width: 'fit-content',
                animation: hovered ? 'none' : 'tickerScroll 36s linear infinite',
                '&:hover': { animationPlayState: 'paused' },
              }}
            >
              {[...items, ...items].map((item, index) => {
                const deltaPositive = item.changePercent >= 0;
                const deltaColor = deltaPositive ? 'var(--market-success, #10b981)' : 'var(--market-danger, #ef4444)';

                return (
                  <Grid key={`${item.symbol}-${index}`} size={{ xs: 'auto' }} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ color: '#ffffff', fontWeight: 600, fontSize: '0.9rem', minWidth: 72 }}>
                      {item.symbol}
                    </Typography>
                    <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', fontSize: '0.85rem', ml: 1 }}>
                      {formatTickerPrice(item.price, item.currency)}
                    </Typography>
                    <Chip
                      label={`${deltaPositive ? '+' : ''}${item.changePercent.toFixed(2)}%`}
                      size="small"
                      sx={{
                        ml: 1.5,
                        color: deltaColor,
                        borderColor: deltaColor,
                        borderWidth: 1,
                        borderStyle: 'solid',
                        bgcolor: 'transparent',
                        fontWeight: 600,
                        px: 0.5,
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
