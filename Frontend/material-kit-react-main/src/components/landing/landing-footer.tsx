"use client";

import * as React from 'react';
import Link from 'next/link';
import { Box, Container, IconButton, Stack, Typography } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { GithubLogo, LinkedinLogo, TwitterLogo } from '@phosphor-icons/react/dist/ssr';

export function LandingFooter(): React.JSX.Element {
  return (
    <Box
      component="footer"
      sx={(theme: Theme) => ({
        backgroundColor: theme.palette.background.level1,
        borderTop: 1,
        borderColor: 'divider',
        py: 6,
      })}
    >
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              TradeSphere
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              © {new Date().getFullYear()} TradeSphere Labs. All rights reserved.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <IconButton component={Link} href="https://github.com" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <GithubLogo size={20} weight="fill" />
            </IconButton>
            <IconButton component={Link} href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <TwitterLogo size={20} weight="fill" />
            </IconButton>
            <IconButton component={Link} href="https://www.linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <LinkedinLogo size={20} weight="fill" />
            </IconButton>
          </Stack>
          <Stack direction="row" spacing={3} flexWrap="wrap">
            <Typography component={Link} href="/terms" variant="body2" sx={{ color: 'text.secondary', textDecoration: 'none' }}>
              Terms
            </Typography>
            <Typography component={Link} href="/privacy" variant="body2" sx={{ color: 'text.secondary', textDecoration: 'none' }}>
              Privacy
            </Typography>
            <Typography component={Link} href="/support" variant="body2" sx={{ color: 'text.secondary', textDecoration: 'none' }}>
              Support
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
