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
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
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

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--TradingSidebar-current', expanded ? `${EXPANDED_WIDTH}px` : `${COLLAPSED_WIDTH}px`);
  }, [expanded]);

  const marketCards: Array<{ id: MarketType; title: string; subtitle: string }> = [
    { id: 'usa', title: 'USA Desk', subtitle: 'USD · New York Session' },
    { id: 'india', title: 'India Desk', subtitle: 'INR · Mumbai Session' },
  ];

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
          bgcolor: 'transparent',
          background: 'linear-gradient(180deg, rgba(6,17,36,0.95) 0%, rgba(10,25,41,0.98) 60%, rgba(8,17,32,1) 100%)',
          borderRight: '1px solid var(--market-border, rgba(255,255,255,0.12))',
          transition: 'width 0.2s ease-in-out',
          overflowX: 'hidden',
        },
      }}
      variant="permanent"
    >
      <Grid
        container
        direction="column"
        wrap="nowrap"
        sx={{
          height: '100%',
          color: 'var(--market-text, #fff)',
        }}
      >
        {/* Header with toggle */}
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 2,
            py: 1.75,
            minHeight: 64,
            borderBottom: '1px solid var(--market-border, rgba(255,255,255,0.12))',
          }}
        >
          {expanded ? (
            <Grid container alignItems="center" columnSpacing={1.5} wrap="nowrap">
              <Grid size={{ xs: 'auto' }}>
                <Typography sx={{ fontWeight: 700, letterSpacing: 1 }} color="var(--market-accent, #0B6EFD)" variant="h6">
                  Uptrade Pro
                </Typography>
              </Grid>
              <Grid size={{ xs: 'auto' }}>
                <Chip
                  label={`${marketTheme.currency.code} · ${marketTheme.market.toUpperCase()}`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.08)',
                    color: 'var(--market-textSecondary, rgba(255,255,255,0.7))',
                    fontWeight: 600,
                    letterSpacing: 0.4,
                  }}
                />
              </Grid>
            </Grid>
          ) : null}
          <IconButton
            onClick={handleToggle}
            size="small"
            sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.65))' }}
          >
            {expanded ? <CaretLeftIcon /> : <CaretRightIcon />}
          </IconButton>
        </Grid>

        {/* Quick market toggles */}
        {expanded ? (
          <Grid size={{ xs: 12 }} sx={{ px: 2, pt: 2 }}>
            <Typography
              sx={{
                color: 'var(--market-textSecondary, rgba(255,255,255,0.7))',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: 0.8,
                mb: 1,
              }}
            >
              Trading Desks
            </Typography>
            <Grid container spacing={1.5}>
              {marketCards.map((card) => {
                const isActiveMarket = marketTheme.market === card.id;
                return (
                  <Grid key={card.id} size={{ xs: 6 }}>
                    <ListItemButton
                      onClick={() => {
                        setMarket(card.id);
                        const targetNav = navGroups[0]?.items.find((item) => item.marketSwitch === card.id);
                        if (targetNav) {
                          handleNavClick(targetNav);
                        }
                      }}
                      sx={{
                        alignItems: 'flex-start',
                        borderRadius: 2,
                        px: 2,
                        py: 1.5,
                        minHeight: 0,
                        bgcolor: isActiveMarket ? 'rgba(11,110,253,0.18)' : 'rgba(255,255,255,0.04)',
                        border: isActiveMarket
                          ? '1px solid var(--market-accent, #0B6EFD)'
                          : '1px solid rgba(255,255,255,0.04)',
                        color: 'var(--market-textSecondary, rgba(255,255,255,0.7))',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          bgcolor: 'rgba(11,110,253,0.25)',
                          borderColor: 'var(--market-accent, #0B6EFD)',
                          color: '#ffffff',
                        },
                      }}
                    >
                      <Grid container direction="column" rowSpacing={0.5} wrap="nowrap">
                        <Grid size={{ xs: 12 }}>
                          <Typography sx={{ fontWeight: 600 }} color="#ffffff" variant="subtitle2">
                            {card.title}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Typography sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                            {card.subtitle}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItemButton>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        ) : (
          <Divider sx={{ my: 1 }} />
        )}

        {/* Navigation groups */}
        <Grid
          size={{ xs: 12 }}
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            py: 2,
            px: expanded ? 0 : 0,
          }}
        >
          <Grid container direction="column" rowSpacing={1.5} sx={{ px: expanded ? 2 : 0 }}>
            {navGroups.map((group) => (
              <Grid key={group.title} size={{ xs: 12 }}>
                {expanded ? (
                  <Typography
                    color="var(--market-textSecondary, rgba(255,255,255,0.65))"
                    sx={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1, mb: 0.5 }}
                    variant="overline"
                  >
                    {group.title}
                  </Typography>
                ) : (
                  <Divider sx={{ my: 1, borderColor: 'var(--market-border, rgba(255,255,255,0.12))' }} />
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
                              justifyContent: expanded ? 'flex-start' : 'center',
                              px: expanded ? 2 : 1.5,
                              borderRadius: expanded ? 2 : 1,
                              position: 'relative',
                              color: 'var(--market-textSecondary, rgba(255,255,255,0.7))',
                              transition: 'all 0.2s ease-in-out',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: '8px auto 8px 8px',
                                width: 3,
                                borderRadius: 999,
                                bgcolor: 'var(--market-accent, #0B6EFD)',
                                opacity: isActive(item) ? 1 : 0,
                                transition: 'opacity 0.2s ease-in-out',
                              },
                              '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.08)',
                                color: '#ffffff',
                              },
                              '&.Mui-selected': {
                                bgcolor: 'rgba(11,110,253,0.3)',
                                boxShadow: '0 10px 30px rgba(11,110,253,0.35)',
                                color: '#ffffff',
                                '&:hover': {
                                  bgcolor: 'rgba(11,110,253,0.45)',
                                },
                                '& .MuiListItemIcon-root': {
                                  color: '#ffffff',
                                },
                              },
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: expanded ? 2 : 0,
                                justifyContent: 'center',
                                color: 'inherit',
                                transition: 'color 0.2s ease-in-out',
                              }}
                            >
                              <item.icon fontSize="var(--icon-fontSize-md)" weight="bold" />
                            </ListItemIcon>
                            {expanded ? (
                              <ListItemText
                                primary={item.title}
                                primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: isActive(item) ? 600 : 500 }}
                              />
                            ) : null}
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
                                    borderRadius: 2,
                                    color: 'var(--market-textSecondary, rgba(255,255,255,0.75))',
                                    '&:hover': {
                                      bgcolor: 'rgba(255,255,255,0.08)',
                                      color: '#ffffff',
                                    },
                                    '&.Mui-selected': {
                                      bgcolor: 'rgba(11,110,253,0.22)',
                                      color: '#ffffff',
                                    },
                                  }}
                                >
                                  <ListItemText primary={child.title} primaryTypographyProps={{ fontSize: '0.85rem' }} />
                                </ListItemButton>
                              </ListItem>
                            ))}
                          </List>
                        </Collapse>
                      ) : null}
                    </React.Fragment>
                  ))}
                </List>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Bottom announcements */}
        {expanded ? (
          <Grid
            size={{ xs: 12 }}
            sx={{
              px: 2,
              py: 2,
              borderTop: '1px solid var(--market-border, rgba(255,255,255,0.12))',
              bgcolor: 'rgba(0,0,0,0.25)',
            }}
          >
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', mb: 0.75 }}>
              🎉 Platform Update
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: 'var(--market-textSecondary, rgba(255,255,255,0.65))' }}>
              Advanced chart overlays and auto-risk checks are live for both desks.
            </Typography>
          </Grid>
        ) : null}
      </Grid>
    </Drawer>
  );
}
