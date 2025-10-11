"use client";

import * as React from 'react';
import Link from 'next/link';
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import type { Theme } from '@mui/material/styles';

export function LandingHeader(): React.JSX.Element {
  return (
    <AppBar
      color="transparent"
      elevation={0}
      position="sticky"
      sx={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(4, 2, 25, 0.75)', borderBottom: 1, borderColor: 'divider' }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 80 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
            <Box
              sx={(theme: Theme) => ({
                alignItems: 'center',
                borderRadius: '50%',
                display: 'flex',
                height: 40,
                justifyContent: 'center',
                width: 40,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.success.main})`,
              })}
            >
              <Typography variant="h6" component="span" sx={{ color: 'common.white', fontWeight: 700 }}>
                TS
              </Typography>
            </Box>
            <Typography variant="h6" component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>
              TradeSphere
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button component={Link} href="/auth/sign-in" variant="text" color="inherit">
              Login
            </Button>
            <Button component={Link} href="/auth/sign-up" variant="contained" color="primary" sx={{ borderRadius: 999 }}>
              Sign Up
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
