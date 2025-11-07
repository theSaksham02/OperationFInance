'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Question as QuestionIcon } from '@phosphor-icons/react/dist/ssr/Question';

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack alignItems="center" direction="row" spacing={2}>
        <QuestionIcon color="var(--market-accent, #0B6EFD)" fontSize={32} weight="bold" />
        <Typography color="var(--market-text, #fff)" variant="h4">
          Help & Support
        </Typography>
      </Stack>
      <Card sx={{ bgcolor: 'var(--market-surface, #132f4c)' }}>
        <CardContent>
          <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))">
            Get help with platform features, troubleshooting, and trading questions via our AI chatbot.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
