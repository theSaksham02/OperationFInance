'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Funnel as FunnelIcon } from '@phosphor-icons/react/dist/ssr/Funnel';

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack alignItems="center" direction="row" spacing={2}>
        <FunnelIcon color="var(--market-accent, #0B6EFD)" fontSize={32} weight="bold" />
        <Typography color="var(--market-text, #fff)" variant="h4">
          Screeners
        </Typography>
      </Stack>
      <Card sx={{ bgcolor: 'var(--market-surface, #132f4c)' }}>
        <CardContent>
          <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))">
            Use advanced filters to discover trading opportunities based on technical and fundamental criteria.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
