"use client";

import * as React from 'react';
import Link from 'next/link';
import { Box, Container, IconButton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

import { DynamicLogo } from '@/components/core/logo';
import { GithubLogo, LinkedinLogo, TwitterLogo } from '@phosphor-icons/react/dist/ssr';

export function LandingFooter(): React.JSX.Element {
  return (
    <Box
      component="footer"
      id="company"
      sx={(theme: Theme) => ({
        background: 'linear-gradient(180deg, rgba(3, 7, 18, 0.9), rgba(2, 3, 10, 0.92))',
        borderTop: 1,
        borderColor: alpha(theme.palette.common.white, 0.08),
        py: 6,
      })}
    >
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Stack spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }}>
            <DynamicLogo colorDark="light" colorLight="dark" height={36} width={124} />
            <Typography variant="body2" sx={{ color: 'rgba(169, 187, 222, 0.76)' }}>
              © {new Date().getFullYear()} UpTrade Labs. All rights reserved.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2.5}>
            <IconButton
              component={Link}
              href="https://github.com"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'common.white' } }}
            >
              <GithubLogo size={20} weight="fill" />
            </IconButton>
            <IconButton
              component={Link}
              href="https://twitter.com"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'common.white' } }}
            >
              <TwitterLogo size={20} weight="fill" />
            </IconButton>
            <IconButton
              component={Link}
              href="https://www.linkedin.com"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'common.white' } }}
            >
              <LinkedinLogo size={20} weight="fill" />
            </IconButton>
          </Stack>
          <Stack direction="row" spacing={3} flexWrap="wrap">
            <Typography component={Link} href="/terms" variant="body2" sx={{ color: 'rgba(169, 187, 222, 0.7)', textDecoration: 'none' }}>
              Terms
            </Typography>
            <Typography component={Link} href="/privacy" variant="body2" sx={{ color: 'rgba(169, 187, 222, 0.7)', textDecoration: 'none' }}>
              Privacy
            </Typography>
            <Typography component={Link} href="/support" variant="body2" sx={{ color: 'rgba(169, 187, 222, 0.7)', textDecoration: 'none' }}>
              Support
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
