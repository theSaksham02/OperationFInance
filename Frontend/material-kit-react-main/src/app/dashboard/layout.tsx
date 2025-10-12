import * as React from 'react';
import Box from '@mui/material/Box';
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
              '--TradingSidebar-current': '280px',
              '--TopBar-height': '64px',
              margin: 0,
              backgroundColor: 'var(--market-background, #0a1929)',
              color: 'var(--market-text, #fff)',
            },
          }}
        />
        <TradingSidebar />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            ml: 'var(--TradingSidebar-current)',
            backgroundColor: 'var(--market-background, #0a1929)',
            color: 'var(--market-text, #fff)',
            overflowX: 'hidden',
            transition: 'margin-left 0.2s ease-in-out',
          }}
        >
          <TopBar />
          <Box
            component="main"
            sx={{
              flex: 1,
              width: '100%',
              py: 3,
              px: { xs: 1.5, sm: 2, md: 3 },
              overflowX: 'hidden',
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 1440,
                mx: 'auto',
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>
      </MarketThemeProvider>
    </AuthGuard>
  );
}
