'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Newspaper as NewspaperIcon } from '@phosphor-icons/react/dist/ssr/Newspaper';

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack alignItems="center" direction="row" spacing={2}>
        <NewspaperIcon color="var(--market-accent, #0B6EFD)" fontSize={32} weight="bold" />
        <Typography color="var(--market-text, #fff)" variant="h4">
          Market News
        </Typography>
      </Stack>
      <Card sx={{ bgcolor: 'var(--market-surface, #132f4c)' }}>
        <CardContent>
          <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))">
            Stay informed with real-time financial news and market analysis.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
