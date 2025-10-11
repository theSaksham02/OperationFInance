'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

interface TradeExecutionWidgetProps {
  onSubmit?: (payload: TradeFormState) => void;
  defaultSymbol?: string;
  availableSymbols?: string[];
  quotes?: Record<string, QuoteInfo>;
  marketLabel?: string;
  sx?: SxProps<Theme>;
}

type OrderSide = 'buy' | 'sell';
type OrderType = 'market' | 'limit' | 'stop';

export interface QuoteInfo {
  bid: number;
  ask: number;
  spread: number;
}

export interface TradeFormState {
  symbol: string;
  quantity: number;
  orderSide: OrderSide;
  orderType: OrderType;
  limitPrice?: number;
  shortSell: boolean;
}

const DEFAULT_FORM: TradeFormState = {
  symbol: '',
  quantity: 100,
  orderSide: 'buy',
  orderType: 'market',
  limitPrice: undefined,
  shortSell: false,
};

export function TradeExecutionWidget({
  onSubmit,
  defaultSymbol = 'AAPL',
  availableSymbols,
  quotes,
  marketLabel = 'Global Markets',
  sx,
}: TradeExecutionWidgetProps): React.JSX.Element {
  const [formState, setFormState] = React.useState<TradeFormState>({ ...DEFAULT_FORM, symbol: defaultSymbol });
  const [lastSubmission, setLastSubmission] = React.useState<TradeFormState | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLastSubmission(formState);
    onSubmit?.(formState);
  };

  React.useEffect(() => {
    if (availableSymbols && availableSymbols.length > 0 && !availableSymbols.includes(formState.symbol)) {
      setFormState((prev) => ({ ...prev, symbol: availableSymbols[0] }));
    }
  }, [availableSymbols, formState.symbol]);

  const quote = quotes?.[formState.symbol];
  const showSymbolSelect = Boolean(availableSymbols && availableSymbols.length > 0);

  return (
    <Card component="section" sx={sx}>
      <CardHeader title="Trade Execution" subheader={`Simulate orders on the ${marketLabel}`} />
      <Divider />
      <CardContent>
        <Stack component="form" spacing={3} onSubmit={handleSubmit}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            {showSymbolSelect ? (
              <TextField
                select
                label="Currency Pair"
                value={formState.symbol}
                onChange={(event) => setFormState((prev) => ({ ...prev, symbol: event.target.value }))}
                fullWidth
                helperText="Select from supported instruments"
              >
                {availableSymbols?.map((symbol) => (
                  <MenuItem key={symbol} value={symbol}>
                    {symbol}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                label="Ticker"
                value={formState.symbol}
                onChange={(event) => setFormState((prev) => ({ ...prev, symbol: event.target.value.toUpperCase() }))}
                fullWidth
                placeholder="e.g. AAPL or RELIANCE.NS"
              />
            )}
            <TextField
              label="Quantity"
              type="number"
              value={formState.quantity}
              inputProps={{ min: 1, step: 1 }}
              onChange={(event) => setFormState((prev) => ({ ...prev, quantity: Number(event.target.value) }))}
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <ToggleButtonGroup
              exclusive
              value={formState.orderSide}
              onChange={(_event, value: OrderSide | null) => {
                if (value) {
                  setFormState((prev) => ({ ...prev, orderSide: value }));
                }
              }}
              fullWidth
            >
              <ToggleButton value="buy">Buy</ToggleButton>
              <ToggleButton value="sell">Sell</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              exclusive
              value={formState.orderType}
              onChange={(_event, value: OrderType | null) => {
                if (value) {
                  setFormState((prev) => ({ ...prev, orderType: value, limitPrice: value === 'market' ? undefined : prev.limitPrice }));
                }
              }}
              fullWidth
            >
              <ToggleButton value="market">Market</ToggleButton>
              <ToggleButton value="limit">Limit</ToggleButton>
              <ToggleButton value="stop">Stop</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          {formState.orderType !== 'market' && (
            <TextField
              label="Trigger Price"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              value={formState.limitPrice ?? ''}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, limitPrice: event.target.value ? Number(event.target.value) : undefined }))
              }
              fullWidth
            />
          )}
          <ToggleButton
            value="shortSell"
            selected={formState.shortSell}
            onChange={() => setFormState((prev) => ({ ...prev, shortSell: !prev.shortSell }))}
            sx={(theme) => ({
              borderRadius: 1,
              borderColor: formState.shortSell ? theme.palette.error.main : undefined,
              color: formState.shortSell ? theme.palette.error.main : undefined,
              backgroundColor: formState.shortSell ? alpha(theme.palette.error.main, 0.08) : undefined,
            })}
          >
            Enable Short Sell
          </ToggleButton>
          <Button type="submit" variant="contained" size="large">
            Submit Order
          </Button>
          {quote ? (
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Bid: <Typography component="span" fontWeight={600}>{quote.bid.toFixed(5)}</Typography>
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                  Ask: <Typography component="span" fontWeight={600}>{quote.ask.toFixed(5)}</Typography>
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">
                  Spread: {quote.spread.toFixed(1)} pips
                </Typography>
              </Grid>
            </Grid>
          ) : null}
          {lastSubmission ? (
            <Alert severity="info" sx={{ mt: 1 }}>
              Last simulated order: {lastSubmission.orderSide.toUpperCase()} {lastSubmission.quantity} shares of {lastSubmission.symbol}{' '}
              via {lastSubmission.orderType.toUpperCase()} order
            </Alert>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
