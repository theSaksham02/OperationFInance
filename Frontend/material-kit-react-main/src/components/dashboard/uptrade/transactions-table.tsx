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
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import type { SxProps, Theme } from '@mui/material/styles';

import type { TransactionRecord } from '@/types/portfolio';

const typeLabels: Record<string, string> = {
  BUY: 'Buy',
  SELL: 'Sell',
  SHORT: 'Short',
  COVER: 'Cover',
};

export interface TransactionsTableProps {
  transactions: TransactionRecord[];
  defaultCurrency?: 'USD' | 'INR';
  sx?: SxProps<Theme>;
}

function formatCurrency(value: number, currency: 'USD' | 'INR'): string {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatQuantity(value: number): string {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPrice(value: number): string {
  return value.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 5 });
}

function formatTimestamp(value: string): string {
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export function TransactionsTable({ transactions, defaultCurrency = 'USD', sx }: TransactionsTableProps): React.JSX.Element {
  return (
    <Card
      component="section"
      sx={{
        bgcolor: 'rgba(7,20,38,0.92)',
        border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
        borderRadius: 3,
        boxShadow: '0 20px 60px rgba(1,12,28,0.45)',
        backdropFilter: 'blur(18px)',
        ...sx,
      }}
    >
      <CardHeader
        title="Recent Transactions"
        subheader={transactions.length === 0 ? 'No activity yet' : `${transactions.length} recorded ${transactions.length === 1 ? 'transaction' : 'transactions'}`}
        titleTypographyProps={{ sx: { color: 'var(--market-text, #ffffff)', fontWeight: 600 } }}
        subheaderTypographyProps={{ sx: { color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' } }}
      />
      <CardContent sx={{ px: 0 }}>
        {transactions.length === 0 ? (
          <Stack spacing={2} sx={{ px: 3, py: 4 }}>
            <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))" variant="body2">
              Execute a trade to populate your transaction history.
            </Typography>
          </Stack>
        ) : (
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
              borderBottomColor: 'rgba(255,255,255,0.08)',
            },
          }}>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell align="center">Market</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Fees</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => {
                const type = typeLabels[tx.type.toUpperCase()] ?? tx.type;
                const total = tx.totalAmount ?? tx.price * tx.quantity;
                const rowCurrency = tx.market === 'IN' ? 'INR' : tx.market === 'US' ? 'USD' : undefined;
                const currency: 'USD' | 'INR' = rowCurrency ?? defaultCurrency;

                return (
                  <TableRow hover key={tx.id}>
                    <TableCell>{formatTimestamp(tx.timestamp)}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{tx.symbol}</TableCell>
                    <TableCell align="center">{tx.market}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={type}
                        size="small"
                        color={tx.type === 'BUY' || tx.type === 'COVER' ? 'success' : 'error'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="right">{formatQuantity(tx.quantity)}</TableCell>
                    <TableCell align="right">{formatPrice(tx.price)}</TableCell>
                    <TableCell align="right">{formatCurrency(tx.fees, currency)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(total, currency)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
