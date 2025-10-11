import * as React from 'react';
import Stack from '@mui/material/Stack';
import GlobalStyles from '@mui/material/GlobalStyles';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MarketThemeProvider } from '@/contexts/market-theme-context';
import { TradingSidebar } from '@/components/dashboard/layout/trading-sidebar';
import { TopBar } from '@/components/dashboard/layout/top-bar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <AuthGuard>
      <MarketThemeProvider>
        <GlobalStyles
          styles={{
            body: {
              '--TradingSidebar-expanded': '280px',
              '--TradingSidebar-collapsed': '64px',
              '--TopBar-height': '64px',
            },
          }}
        />
        <Stack
          direction="row"
          sx={{
            bgcolor: 'var(--market-background, #0a1929)',
            minHeight: '100vh',
            overflow: 'hidden',
          }}
        >
          <TradingSidebar />
          <Stack
            sx={{
              flex: 1,
              minWidth: 0,
              overflow: 'auto',
            }}
          >
            <TopBar />
            <Stack
              component="main"
              sx={{
                flex: 1,
                p: 3,
                bgcolor: 'var(--market-background, #0a1929)',
                color: 'var(--market-text, #fff)',
              }}
            >
              {children}
            </Stack>
          </Stack>
        </Stack>
      </MarketThemeProvider>
    </AuthGuard>
  );
}
