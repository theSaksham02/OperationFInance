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
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

export interface HoldingPosition {
  symbol: string;
  name: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  todayPnLPercent: number;
}

export interface HoldingsTableProps {
  positions: HoldingPosition[];
  currency?: string;
  sx?: SxProps<Theme>;
}

const formatCurrency = (value: number, currency = 'USD'): string =>
  value.toLocaleString(undefined, { style: 'currency', currency, maximumFractionDigits: 2 });

export function HoldingsTable({ positions, currency = 'USD', sx }: HoldingsTableProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Card sx={sx}>
      <CardHeader
        title="Holdings"
        subheader={`${positions.length} active ${positions.length === 1 ? 'position' : 'positions'}`}
      />
      <CardContent sx={{ px: 0 }}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Avg. Cost</TableCell>
              <TableCell align="right">Current Price</TableCell>
              <TableCell align="right">Total Value</TableCell>
              <TableCell align="right">Today&apos;s P&amp;L</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {positions.map((position) => {
              const totalValue = position.quantity * position.currentPrice;
              const pnlColor = position.todayPnLPercent >= 0 ? theme.palette.success.main : theme.palette.error.main;

              return (
                <TableRow hover key={position.symbol}>
                  <TableCell sx={{ fontWeight: 600 }}>{position.symbol}</TableCell>
                  <TableCell>{position.name}</TableCell>
                  <TableCell align="right">{position.quantity.toLocaleString()}</TableCell>
                  <TableCell align="right">{formatCurrency(position.averageCost, currency)}</TableCell>
                  <TableCell align="right">{formatCurrency(position.currentPrice, currency)}</TableCell>
                  <TableCell align="right">{formatCurrency(totalValue, currency)}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${position.todayPnLPercent > 0 ? '+' : ''}${position.todayPnLPercent.toFixed(2)}%`}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        color: pnlColor,
                        backgroundColor: alpha(pnlColor, 0.12),
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {positions.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ px: 3, py: 4 }}>
            You don&apos;t have any holdings yet. Use the Trade Execution widget to place your first virtual trade.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
