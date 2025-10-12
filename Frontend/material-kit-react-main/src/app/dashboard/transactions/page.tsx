'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Receipt as ReceiptIcon } from '@phosphor-icons/react/dist/ssr/Receipt';

import { useTransactionsData } from '@/hooks/use-transactions-data';
import { TransactionsTable } from '@/components/dashboard/uptrade';

export default function Page(): React.JSX.Element {
  const { data, isLoading, error, refresh } = useTransactionsData();
  const hasTransactions = data.length > 0;

  return (
    <Stack spacing={3}>
      <Stack alignItems="center" direction="row" spacing={2}>
        <ReceiptIcon color="var(--market-accent, #0B6EFD)" fontSize={32} weight="bold" />
        <Typography color="var(--market-text, #fff)" variant="h4">
          Transactions
        </Typography>
      </Stack>
      {isLoading ? (
        <Stack alignItems="center" spacing={2} sx={{ py: 12 }}>
          <CircularProgress color="primary" size={32} />
          <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))" variant="body2">
            Loading transaction history…
          </Typography>
        </Stack>
      ) : error ? (
        <Stack spacing={2} sx={{ maxWidth: 480 }}>
          <Alert severity="error">{error}</Alert>
          <Button onClick={refresh} variant="contained">
            Retry
          </Button>
        </Stack>
      ) : (
        <Stack spacing={3}>
          {!hasTransactions && (
            <Box sx={{ bgcolor: 'rgba(7,20,38,0.85)', borderRadius: 3, px: 3, py: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))">
                Every completed trade appears here. Submit an order from the dashboard to generate your first transaction record.
              </Typography>
            </Box>
          )}
          <TransactionsTable defaultCurrency="USD" transactions={data} />
        </Stack>
      )}
    </Stack>
  );
}
