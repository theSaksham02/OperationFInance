'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import { CaretLeft as CaretLeftIcon } from '@phosphor-icons/react/dist/ssr/CaretLeft';
import { CaretRight as CaretRightIcon } from '@phosphor-icons/react/dist/ssr/CaretRight';
import { Flag as FlagIcon } from '@phosphor-icons/react/dist/ssr/Flag';
import { ChartLine as ChartLineIcon } from '@phosphor-icons/react/dist/ssr/ChartLine';
import { Columns as ColumnsIcon } from '@phosphor-icons/react/dist/ssr/Columns';
import { ShoppingCart as ShoppingCartIcon } from '@phosphor-icons/react/dist/ssr/ShoppingCart';
import { ListBullets as ListBulletsIcon } from '@phosphor-icons/react/dist/ssr/ListBullets';
import { ArrowsClockwise as ArrowsClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowsClockwise';
import { Receipt as ReceiptIcon } from '@phosphor-icons/react/dist/ssr/Receipt';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { Funnel as FunnelIcon } from '@phosphor-icons/react/dist/ssr/Funnel';
import { Newspaper as NewspaperIcon } from '@phosphor-icons/react/dist/ssr/Newspaper';
import { CalendarBlank as CalendarBlankIcon } from '@phosphor-icons/react/dist/ssr/CalendarBlank';
import { ShieldCheck as ShieldCheckIcon } from '@phosphor-icons/react/dist/ssr/ShieldCheck';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { Calculator as CalculatorIcon } from '@phosphor-icons/react/dist/ssr/Calculator';
import { Question as QuestionIcon } from '@phosphor-icons/react/dist/ssr/Question';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';

import { useMarketTheme } from '@/contexts/market-theme-context';
import type { MarketType } from '@/contexts/market-theme-context';

const EXPANDED_WIDTH = 280;
const COLLAPSED_WIDTH = 64;

interface NavItem {
  key: string;
  title: string;
  icon: React.ElementType;
  href?: string;
  marketSwitch?: MarketType;
  children?: NavItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'Markets',
    items: [
      { key: 'usa', title: 'USA Market', icon: FlagIcon, href: '/dashboard/usa', marketSwitch: 'usa' },
      { key: 'india', title: 'India Market', icon: FlagIcon, href: '/dashboard/india', marketSwitch: 'india' },
    ],
  },
  {
    title: 'Trading',
    items: [
      { key: 'dashboard', title: 'Dashboard Home', icon: ColumnsIcon, href: '/dashboard/home' },
      {
        key: 'orders-group',
        title: 'Order Tickets',
        icon: ShoppingCartIcon,
        children: [
          { key: 'order-stocks', title: 'Stocks/ETFs', icon: ShoppingCartIcon, href: '/dashboard/orders/stocks' },
          { key: 'order-short', title: 'Short Sell', icon: ShoppingCartIcon, href: '/dashboard/orders/short' },
          {
            key: 'order-derivatives',
            title: 'Derivatives',
            icon: ShoppingCartIcon,
            href: '/dashboard/orders/derivatives',
          },
        ],
      },
      { key: 'positions', title: 'Open Positions', icon: ListBulletsIcon, href: '/dashboard/positions' },
      { key: 'orders', title: 'Orders', icon: ArrowsClockwiseIcon, href: '/dashboard/orders' },
      { key: 'transactions', title: 'Transactions', icon: ReceiptIcon, href: '/dashboard/transactions' },
      { key: 'shortable', title: 'Shortable List', icon: ListBulletsIcon, href: '/dashboard/shortable' },
    ],
  },
  {
    title: 'Analysis',
    items: [
      { key: 'watchlists', title: 'Watchlists', icon: EyeIcon, href: '/dashboard/watchlists' },
      { key: 'screeners', title: 'Screeners', icon: FunnelIcon, href: '/dashboard/screeners' },
      { key: 'chart', title: 'Advanced Chart', icon: ChartLineIcon, href: '/dashboard/chart' },
      { key: 'news', title: 'Market News', icon: NewspaperIcon, href: '/dashboard/news' },
      { key: 'calendar', title: 'Economic Calendar', icon: CalendarBlankIcon, href: '/dashboard/calendar' },
    ],
  },
  {
    title: 'Risk',
    items: [{ key: 'risk', title: 'Equity & Margin Center', icon: ShieldCheckIcon, href: '/dashboard/risk' }],
  },
  {
    title: 'Tools',
    items: [
      { key: 'alerts', title: 'Alerts', icon: BellIcon, href: '/dashboard/alerts' },
      { key: 'calculators', title: 'Calculators', icon: CalculatorIcon, href: '/dashboard/calculators' },
      { key: 'help', title: 'Help/Chatbot', icon: QuestionIcon, href: '/dashboard/help' },
    ],
  },
  {
    title: 'Admin',
    items: [
      { key: 'admin-users', title: 'Users/Tiers', icon: UsersIcon, href: '/dashboard/admin/users' },
      { key: 'admin-refresh', title: 'Shortable Refresh', icon: GearSixIcon, href: '/dashboard/admin/refresh' },
    ],
  },
];

export interface TradingSidebarProps {
  open?: boolean;
}

export function TradingSidebar({ open: initialOpen = true }: TradingSidebarProps): React.JSX.Element {
  const [expanded, setExpanded] = React.useState(initialOpen);
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set());
  const pathname = usePathname();
  const router = useRouter();
  const { marketTheme, setMarket } = useMarketTheme();

  const handleToggle = (): void => {
    setExpanded((prev) => !prev);
  };

  const handleGroupToggle = (groupKey: string): void => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  };

  const handleNavClick = (item: NavItem): void => {
    if (item.marketSwitch) {
      setMarket(item.marketSwitch);
    }
    if (item.href) {
      router.push(item.href);
    }
    if (item.children) {
      handleGroupToggle(item.key);
    }
  };

  const isActive = (item: NavItem): boolean => {
    if (item.href) {
      return pathname === item.href || pathname.startsWith(`${item.href}/`);
    }
    return false;
  };

  return (
    <Drawer
      anchor="left"
      open
      sx={{
        width: expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'var(--market-surface, #132f4c)',
          borderRight: '1px solid var(--market-border, rgba(255,255,255,0.12))',
          transition: 'width 0.2s ease-in-out',
          overflowX: 'hidden',
        },
      }}
      variant="permanent"
    >
      <Stack
        spacing={0}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header with toggle */}
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{
            p: 2,
            minHeight: 64,
            borderBottom: '1px solid var(--market-border, rgba(255,255,255,0.12))',
          }}
        >
          {expanded ? (
            <Typography color="var(--market-accent, #0B6EFD)" sx={{ fontWeight: 600 }} variant="h6">
              Uptrade
            </Typography>
          ) : null}
          <IconButton onClick={handleToggle} size="small" sx={{ color: 'var(--market-text, #fff)' }}>
            {expanded ? <CaretLeftIcon /> : <CaretRightIcon />}
          </IconButton>
        </Stack>

        {/* Navigation groups */}
        <Stack sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 2 }}>
          {navGroups.map((group) => (
            <Stack key={group.title} spacing={0.5}>
              {expanded ? (
                <Typography
                  color="var(--market-textSecondary, rgba(255,255,255,0.7))"
                  sx={{ px: 2, py: 1, fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}
                  variant="overline"
                >
                  {group.title}
                </Typography>
              ) : (
                <Divider sx={{ my: 1 }} />
              )}
              <List disablePadding>
                {group.items.map((item) => (
                  <React.Fragment key={item.key}>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                      <Tooltip arrow placement="right" title={expanded ? '' : item.title}>
                        <ListItemButton
                          onClick={() => {
                            handleNavClick(item);
                          }}
                          selected={isActive(item)}
                          sx={{
                            minHeight: 48,
                            justifyContent: expanded ? 'initial' : 'center',
                            px: 2.5,
                            '&.Mui-selected': {
                              bgcolor: 'var(--market-accent, #0B6EFD)',
                              color: '#fff',
                              '&:hover': {
                                bgcolor: 'var(--market-accentHover, #0958d9)',
                              },
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: expanded ? 3 : 'auto',
                              justifyContent: 'center',
                              color: 'inherit',
                            }}
                          >
                            <item.icon fontSize="var(--icon-fontSize-md)" weight="bold" />
                          </ListItemIcon>
                          {expanded ? <ListItemText primary={item.title} /> : null}
                        </ListItemButton>
                      </Tooltip>
                    </ListItem>
                    {item.children && expanded ? (
                      <Collapse in={expandedGroups.has(item.key)} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {item.children.map((child) => (
                            <ListItem key={child.key} disablePadding sx={{ display: 'block' }}>
                              <ListItemButton
                                onClick={() => {
                                  handleNavClick(child);
                                }}
                                selected={isActive(child)}
                                sx={{
                                  minHeight: 40,
                                  pl: 7,
                                  '&.Mui-selected': {
                                    bgcolor: 'var(--market-accent, #0B6EFD)',
                                    color: '#fff',
                                  },
                                }}
                              >
                                <ListItemText primary={child.title} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    ) : null}
                  </React.Fragment>
                ))}
              </List>
            </Stack>
          ))}
        </Stack>

        {/* Bottom announcements */}
        {expanded ? (
          <Stack
            sx={{
              p: 2,
              bgcolor: 'rgba(0,0,0,0.2)',
              borderTop: '1px solid var(--market-border, rgba(255,255,255,0.12))',
            }}
          >
            <Typography color="var(--market-textSecondary, rgba(255,255,255,0.7))" sx={{ fontSize: '0.75rem' }}>
              🎉 New: Advanced charting tools
            </Typography>
          </Stack>
        ) : null}
      </Stack>
    </Drawer>
  );
}
