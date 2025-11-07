'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CalendarBlank as CalendarBlankIcon } from '@phosphor-icons/react/dist/ssr/CalendarBlank';

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack alignItems="center" direction="row" spacing={2}>
        <CalendarBlankIcon color="var(--market-accent, #0B6EFD)" fontSize={32} weight="bold" />
        <Typography color="var(--market-text, #fff)" variant="h4">
          Economic Calendar
        </Typography>
      </Stack>
      <Card sx={{ bgcolor: 'var(--market-surface, #132f4c)' }}>
        <CardContent>
          <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))">
            Track important economic events and data releases that may impact markets.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
