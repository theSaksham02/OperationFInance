'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

export type PositionSide = 'BUY' | 'SELL';

export interface OpenPosition {
  id: string;
  instrument: string;
  side: PositionSide;
  sizeLots: number;
  openPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  pipPnL: number;
  currencyPnL: number;
}

export interface OpenPositionsTableProps {
  positions: OpenPosition[];
  currency: string;
  title?: string;
  subheader?: string;
  sx?: SxProps<Theme>;
}

const formatCurrency = (value: number, currency: string): string =>
  value.toLocaleString(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: Math.abs(value) < 1 ? 4 : 2,
  });

const formatPrice = (value: number): string =>
  value.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 5 });

export function OpenPositionsTable({ positions, currency, title = 'Open Positions', subheader, sx }: OpenPositionsTableProps): React.JSX.Element {
  const theme = useTheme();
  const cardSurfaceSx = {
    bgcolor: 'rgba(19,47,76,0.92)',
    border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
    borderRadius: 3,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 20px 60px rgba(1,12,28,0.45)',
  } as const;

  return (
    <Card sx={{ ...cardSurfaceSx, ...sx }} component="section">
      <CardHeader
        title={title}
        subheader={subheader ?? `${positions.length} active ${positions.length === 1 ? 'position' : 'positions'}`}
        titleTypographyProps={{ sx: { color: 'var(--market-text, #ffffff)', fontWeight: 600 } }}
        subheaderTypographyProps={{ sx: { color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' } }}
      />
      <CardContent sx={{ px: 0 }}>
        <Table size="medium" sx={{
          '& thead th': {
            color: 'var(--market-textSecondary, rgba(255,255,255,0.7))',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: 0.6,
            borderBottomColor: 'var(--market-border, rgba(255,255,255,0.12))',
          },
          '& tbody td': {
            color: 'var(--market-text, #ffffff)',
            borderBottomColor: alpha(theme.palette.common.white, 0.08),
          },
        }}>
          <TableHead>
            <TableRow>
              <TableCell>Instrument</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="right">Size (lots)</TableCell>
              <TableCell align="right">Open</TableCell>
              <TableCell align="right">Current</TableCell>
              <TableCell align="right">S/L</TableCell>
              <TableCell align="right">T/P</TableCell>
              <TableCell align="right">P/L (pips)</TableCell>
              <TableCell align="right">P/L ({currency})</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {positions.map((position) => {
              const isProfitable = position.currencyPnL >= 0;
              const chipsColor = isProfitable ? theme.palette.success.main : theme.palette.error.main;

              return (
                <TableRow key={position.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{position.instrument}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={position.side}
                      size="small"
                      color={position.side === 'BUY' ? 'success' : 'error'}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="right">{position.sizeLots.toFixed(2)}</TableCell>
                  <TableCell align="right">{formatPrice(position.openPrice)}</TableCell>
                  <TableCell align="right">{formatPrice(position.currentPrice)}</TableCell>
                  <TableCell align="right">{position.stopLoss ? formatPrice(position.stopLoss) : '—'}</TableCell>
                  <TableCell align="right">{position.takeProfit ? formatPrice(position.takeProfit) : '—'}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${position.pipPnL > 0 ? '+' : ''}${position.pipPnL.toFixed(1)}`}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        color: chipsColor,
                        backgroundColor: alpha(chipsColor, 0.12),
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ color: chipsColor, fontWeight: 600 }}>
                    {`${position.currencyPnL > 0 ? '+' : ''}${formatCurrency(position.currencyPnL, currency)}`}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {positions.length === 0 && (
          <Typography variant="body2" sx={{ px: 3, py: 4, color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' }}>
            No open positions. Execute a trade to populate this table.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
