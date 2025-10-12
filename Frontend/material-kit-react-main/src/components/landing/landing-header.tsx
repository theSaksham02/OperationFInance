"use client";

import * as React from 'react';
import Link from 'next/link';
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { DynamicLogo } from '@/components/core/logo';

const NAV_LINKS = [
  { href: '/#platform', label: 'Platform' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#resources', label: 'Resources' },
  { href: '/#company', label: 'Company' },
];

export function LandingHeader(): React.JSX.Element {
  return (
    <AppBar
      color="transparent"
      elevation={0}
      position="sticky"
      sx={(theme) => ({
        backdropFilter: 'blur(18px)',
        background: 'linear-gradient(135deg, rgba(6, 10, 25, 0.92), rgba(4, 20, 44, 0.72))',
        borderBottom: 1,
        borderColor: alpha(theme.palette.common.white, 0.08),
        boxShadow: '0 18px 32px rgba(3, 6, 18, 0.35)',
      })}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 84 }}>
          <Stack direction="row" spacing={3} alignItems="center" sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <DynamicLogo colorDark="light" colorLight="dark" height={42} width={138} />
              <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.72)', letterSpacing: '0.28em' }}>
                PAPER TRADING PLATFORM
              </Typography>
            </Box>
            <Stack
              component="nav"
              direction="row"
              spacing={2.5}
              sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}
              justifyContent="flex-end"
            >
              {NAV_LINKS.map((item) => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  color="inherit"
                  variant="text"
                  sx={{
                    color: 'rgba(255,255,255,0.76)',
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    '&:hover': {
                      color: 'common.white',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              component={Link}
              href="/auth/sign-in"
              variant="text"
              color="inherit"
              sx={{ color: 'rgba(255,255,255,0.78)' }}
            >
              Log In
            </Button>
            <Button
              component={Link}
              href="/auth/sign-up"
              variant="contained"
              sx={{
                borderRadius: 999,
                background: 'linear-gradient(135deg, #0B6EFD, #12B886)',
                color: 'common.white',
                px: 3,
                boxShadow: '0 12px 24px rgba(11, 110, 253, 0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0A5ED1, #0FA672)',
                  boxShadow: '0 16px 28px rgba(15, 166, 114, 0.38)',
                },
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
