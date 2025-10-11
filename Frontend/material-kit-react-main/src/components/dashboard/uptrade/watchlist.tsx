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
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
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

  const handleAdd = () => {
    if (!inputValue.trim()) {
      return;
    }
    onAdd?.(inputValue.trim().toUpperCase());
    setInputValue('');
  };

  return (
    <Card sx={sx}>
      <CardHeader title="Watchlist" subheader="Track tickers across global markets" />
      <Divider />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1}>
            <TextField
              label="Add symbol"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              fullWidth
              placeholder="e.g. TSLA, INFY.NS"
            />
            <IconButton color="primary" onClick={handleAdd} aria-label="Add symbol">
              <PlusIcon fontSize="var(--icon-fontSize-lg)" />
            </IconButton>
          </Stack>
          <Divider flexItem sx={{ my: 1 }} />
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
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" fontWeight={600}>
                          {entry.symbol}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {entry.price.toLocaleString(undefined, {
                            style: 'currency',
                            currency,
                            maximumFractionDigits: 2,
                          })}
                        </Typography>
                      </Stack>
                    }
                    secondary={
                      <span style={{ display: 'inline-flex', marginTop: 8 }}>
                        <Chip
                          label={`${entry.changePercent > 0 ? '+' : ''}${entry.changePercent.toFixed(2)}%`}
                          size="small"
                          sx={{
                            width: 'fit-content',
                            fontWeight: 600,
                            color,
                            backgroundColor: alpha(color, 0.12),
                          }}
                        />
                      </span>
                    }
                    primaryTypographyProps={{ component: 'div' }}
                    secondaryTypographyProps={{ component: 'span' }}
                  />
                </ListItem>
              );
            })}
            {entries.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No symbols tracked yet. Add your first ticker above.
              </Typography>
            )}
          </List>
        </Stack>
      </CardContent>
    </Card>
  );
}
