'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

export interface WatchlistEntry {
  symbol: string;
  price: number;
  changePercent: number;
}

export interface WatchlistProps {
  entries: WatchlistEntry[];
  onAdd?: (symbol: string) => void;
  onRemove?: (symbol: string) => void;
  currency?: string;
  sx?: SxProps<Theme>;
}

export function Watchlist({ entries, onAdd, onRemove, currency = 'USD', sx }: WatchlistProps): React.JSX.Element {
  const [inputValue, setInputValue] = React.useState('');
  const theme = useTheme();
  const cardSurfaceSx = {
    bgcolor: 'rgba(19,47,76,0.92)',
    border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
    borderRadius: 3,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 20px 60px rgba(1,12,28,0.45)',
  } as const;

  const handleAdd = () => {
    if (!inputValue.trim()) {
      return;
    }
    onAdd?.(inputValue.trim().toUpperCase());
    setInputValue('');
  };

  return (
    <Card sx={{ ...cardSurfaceSx, ...sx }}>
      <CardHeader
        title="Watchlist"
        subheader="Track tickers across global markets"
        titleTypographyProps={{ sx: { color: 'var(--market-text, #ffffff)', fontWeight: 600 } }}
        subheaderTypographyProps={{ sx: { color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' } }}
      />
  <Divider sx={{ borderColor: 'var(--market-border, rgba(255,255,255,0.12))' }} />
      <CardContent>
        <Grid container direction="column" rowSpacing={2}>
          <Grid size={{ xs: 12 }}>
            <Grid container columnSpacing={1} rowSpacing={1}>
              <Grid size={{ xs: 12, sm: 9 }}>
                <TextField
                  label="Add symbol"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  fullWidth
                  placeholder="e.g. TSLA, INFY.NS"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <IconButton
                  onClick={handleAdd}
                  aria-label="Add symbol"
                  sx={{
                    bgcolor: 'var(--market-accent, #0B6EFD)',
                    color: '#ffffff',
                    '&:hover': { bgcolor: 'var(--market-accentHover, #0958d9)' },
                    width: 48,
                    height: 48,
                  }}
                >
                  <PlusIcon fontSize="var(--icon-fontSize-lg)" />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider flexItem sx={{ my: 1, borderColor: 'var(--market-border, rgba(255,255,255,0.12))' }} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <List disablePadding>
              {entries.map((entry) => {
                const color = entry.changePercent >= 0 ? theme.palette.success.main : theme.palette.error.main;

                return (
                  <ListItem
                    key={entry.symbol}
                    secondaryAction={
                      <IconButton edge="end" aria-label="Remove" onClick={() => onRemove?.(entry.symbol)}>
                        <TrashIcon fontSize="var(--icon-fontSize-md)" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Grid container alignItems="center">
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'var(--market-text, #ffffff)' }}>
                              {entry.symbol}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                            <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' }} variant="body2">
                              {entry.price.toLocaleString(undefined, {
                                style: 'currency',
                                currency,
                                maximumFractionDigits: 2,
                              })}
                            </Typography>
                          </Grid>
                        </Grid>
                      }
                      secondary={
                        <Chip
                          label={`${entry.changePercent > 0 ? '+' : ''}${entry.changePercent.toFixed(2)}%`}
                          size="small"
                          sx={{
                            width: 'fit-content',
                            fontWeight: 600,
                            color,
                            backgroundColor: alpha(color, 0.12),
                            mt: 1,
                          }}
                        />
                      }
                      primaryTypographyProps={{ component: 'div' }}
                      secondaryTypographyProps={{ component: 'span' }}
                    />
                  </ListItem>
                );
              })}
              {entries.length === 0 ? (
                <Typography variant="body2" sx={{ py: 2, color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' }}>
                  No symbols tracked yet. Add your first ticker above.
                </Typography>
              ) : null}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
