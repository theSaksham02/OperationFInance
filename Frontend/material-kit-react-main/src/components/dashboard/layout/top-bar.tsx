'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

import { UserPopover } from '@/components/dashboard/layout/user-popover';
import { useUser } from '@/hooks/use-user';
import { useMarketTheme } from '@/contexts/market-theme-context';

export function TopBar(): React.JSX.Element {
  const pathname = usePathname();
  const { marketTheme } = useMarketTheme();
  const [userPopoverAnchor, setUserPopoverAnchor] = React.useState<HTMLElement | null>(null);
  
  // Mock user for demo mode
  const user = { 
    avatar: null, 
    name: 'Demo User',
    username: 'demo',
    email: 'demo@uptrade.global'
  };

  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.slice(1).map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 2).join('/')}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replaceAll('-', ' ');
    return { label, href };
  });

  const handleUserPopoverOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setUserPopoverAnchor(event.currentTarget);
  };

  const handleUserPopoverClose = (): void => {
    setUserPopoverAnchor(null);
  };

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
        sx={{
          height: 'var(--TopBar-height, 64px)',
          px: 3,
          borderBottom: '1px solid var(--market-border, rgba(255,255,255,0.12))',
          bgcolor: 'var(--market-surface, #132f4c)',
        }}
      >
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 ? (
          <Breadcrumbs
            separator="›"
            sx={{
              flex: 1,
              '& .MuiBreadcrumbs-separator': { color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' },
            }}
          >
            <Link color="inherit" href="/dashboard" underline="hover">
              <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))" variant="body2">
                Dashboard
              </Typography>
            </Link>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return isLast ? (
                <Typography color="var(--market-text, #fff)" key={crumb.href} variant="body2">
                  {crumb.label}
                </Typography>
              ) : (
                <Link color="inherit" href={crumb.href} key={crumb.href} underline="hover">
                  <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))" variant="body2">
                    {crumb.label}
                  </Typography>
                </Link>
              );
            })}
          </Breadcrumbs>
        ) : (
          <Stack sx={{ flex: 1 }}>
            <Typography color="var(--market-text, #fff)" variant="h6">
              Dashboard
            </Typography>
          </Stack>
        )}

        {/* Quick search */}
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MagnifyingGlassIcon color="var(--market-textSecondary, rgba(255,255,255,0.7))" fontSize={20} />
              </InputAdornment>
            ),
          }}
          placeholder="Search symbols, screens..."
          size="small"
          sx={{
            width: 300,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'rgba(255,255,255,0.05)',
              '& fieldset': { borderColor: 'var(--market-border, rgba(255,255,255,0.12))' },
              '&:hover fieldset': { borderColor: 'var(--market-accent, #0B6EFD)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--market-accent, #0B6EFD)' },
            },
            '& .MuiInputBase-input': {
              color: 'var(--market-text, #fff)',
            },
          }}
        />

        {/* Market indicator */}
        <Stack
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 1,
            bgcolor: 'var(--market-accent, #0B6EFD)',
            color: '#fff',
          }}
        >
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }} variant="caption">
            {marketTheme.market === 'usa' ? 'USA' : 'India'}
          </Typography>
        </Stack>

        {/* User avatar */}
        <IconButton onClick={handleUserPopoverOpen} sx={{ p: 0 }}>
          <Avatar
            sx={{
              height: 40,
              width: 40,
              cursor: 'pointer',
              bgcolor: 'var(--market-accent, #0B6EFD)',
            }}
          >
            D
          </Avatar>
        </IconButton>
      </Stack>

      <UserPopover anchorEl={userPopoverAnchor} onClose={handleUserPopoverClose} open={Boolean(userPopoverAnchor)} />
    </>
  );
}
