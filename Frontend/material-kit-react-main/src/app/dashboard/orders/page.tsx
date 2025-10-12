'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowsClockwise as ArrowsClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowsClockwise';

import { useTransactionsData } from '@/hooks/use-transactions-data';
import { TransactionsTable } from '@/components/dashboard/uptrade';

export default function Page(): React.JSX.Element {
  const { data, isLoading, error, refresh } = useTransactionsData(25);
  const displayed = data.slice(0, 10);

  return (
    <Stack spacing={3}>
      <Stack alignItems="center" direction="row" spacing={2}>
        <ArrowsClockwiseIcon color="var(--market-accent, #0B6EFD)" fontSize={32} weight="bold" />
        <Typography color="var(--market-text, #fff)" variant="h4">
          Orders
        </Typography>
      </Stack>
      {isLoading ? (
        <Stack alignItems="center" spacing={2} sx={{ py: 12 }}>
          <CircularProgress color="primary" size={32} />
          <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))" variant="body2">
            Fetching your most recent orders…
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
        <Stack spacing={2}>
          <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))">
            All submitted orders execute immediately in this simulation, so the feed below mirrors your filled trades.
          </Typography>
          <TransactionsTable defaultCurrency="USD" transactions={displayed} />
        </Stack>
      )}
    </Stack>
  );
}
