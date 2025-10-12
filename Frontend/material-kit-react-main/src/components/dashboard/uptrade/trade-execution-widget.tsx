'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
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
  const cardSurfaceSx = {
    bgcolor: 'rgba(19,47,76,0.92)',
    border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
    borderRadius: 3,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 20px 60px rgba(1,12,28,0.45)',
  } as const;

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
  const shouldShowTriggerPrice = formState.orderType !== 'market';
  const estimatedPrice = React.useMemo(
    () => (quote ? (formState.orderSide === 'buy' ? quote.ask : quote.bid) : undefined),
    [formState.orderSide, quote]
  );
  const estimatedNotional = React.useMemo(
    () =>
      estimatedPrice && Number.isFinite(formState.quantity)
        ? estimatedPrice * formState.quantity
        : undefined,
    [estimatedPrice, formState.quantity]
  );
  const quickSizes = React.useMemo(() => [25, 100, 250, 500], []);
  const isTriggerValid = !shouldShowTriggerPrice || (formState.limitPrice ?? 0) > 0;
  const isSymbolValid = Boolean(formState.symbol?.trim());
  const isQuantityValid = Number.isFinite(formState.quantity) && formState.quantity > 0;
  const canSubmit = isTriggerValid && isSymbolValid && isQuantityValid;
  const fieldStyles = {
    '& .MuiInputLabel-root': {
      color: 'var(--market-textSecondary, rgba(255,255,255,0.65))',
      '&.Mui-focused': {
        color: 'var(--market-accent, #0B6EFD)',
      },
    },
    '& .MuiOutlinedInput-root': {
      bgcolor: 'rgba(255,255,255,0.04)',
      color: 'var(--market-text, #ffffff)',
      '& fieldset': {
        borderColor: 'var(--market-border, rgba(255,255,255,0.12))',
      },
      '&:hover fieldset': {
        borderColor: 'var(--market-accent, #0B6EFD)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--market-accent, #0B6EFD)',
      },
    },
    '& .MuiInputBase-input': {
      color: 'var(--market-text, #ffffff)',
    },
    '& .MuiFormHelperText-root': {
      color: 'var(--market-textSecondary, rgba(255,255,255,0.65))',
    },
  } as const;

  return (
    <Card component="section" sx={{ ...cardSurfaceSx, ...sx }}>
      <CardHeader
        title="Trade Execution"
        subheader={`Simulate orders on the ${marketLabel}`}
        titleTypographyProps={{ sx: { color: 'var(--market-text, #ffffff)', fontWeight: 600 } }}
        subheaderTypographyProps={{ sx: { color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' } }}
      />
      <Divider />
      <CardContent>
        <Grid
          container
          component="form"
          direction="column"
          rowSpacing={3}
          onSubmit={handleSubmit}
        >
          <Grid size={{ xs: 12 }}>
            <Grid container columnSpacing={2} rowSpacing={2}>
            {showSymbolSelect ? (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    label="Currency Pair"
                    value={formState.symbol}
                    onChange={(event) => setFormState((prev) => ({ ...prev, symbol: event.target.value }))}
                    fullWidth
                    helperText="Select from supported instruments"
                    sx={fieldStyles}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            bgcolor: 'rgba(6,17,36,0.92)',
                            '& .MuiMenuItem-root': {
                              color: 'var(--market-text, #ffffff)',
                              '&.Mui-selected': {
                                bgcolor: 'rgba(11,110,253,0.25)',
                              },
                              '&:hover': {
                                bgcolor: 'rgba(11,110,253,0.18)',
                              },
                            },
                          },
                        },
                      },
                    }}
                  >
                    {availableSymbols?.map((symbol) => (
                      <MenuItem key={symbol} value={symbol} sx={{ color: 'var(--market-text, #ffffff)' }}>
                        {symbol}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
            ) : (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Ticker"
                    value={formState.symbol}
                    onChange={(event) => setFormState((prev) => ({ ...prev, symbol: event.target.value.toUpperCase() }))}
                    fullWidth
                    placeholder="e.g. AAPL or RELIANCE.NS"
                    sx={fieldStyles}
                  />
                </Grid>
            )}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={formState.quantity}
                  inputProps={{ min: 1, step: 1 }}
                  onChange={(event) => setFormState((prev) => ({ ...prev, quantity: Number(event.target.value) }))}
                  fullWidth
                  sx={fieldStyles}
                />
              </Grid>
            </Grid>
            <Stack direction="row" flexWrap="wrap" gap={1.5} mt={1}>
              <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.65))', fontSize: '0.75rem' }}>
                Quick size:
              </Typography>
              {quickSizes.map((size) => {
                const isActive = formState.quantity === size;
                return (
                  <Chip
                    key={size}
                    label={size}
                    onClick={() => setFormState((prev) => ({ ...prev, quantity: size }))}
                    variant={isActive ? 'filled' : 'outlined'}
                    color={isActive ? 'primary' : 'default'}
                    sx={{
                      borderColor: isActive ? 'transparent' : 'var(--market-border, rgba(255,255,255,0.18))',
                      bgcolor: isActive ? 'rgba(11,110,253,0.25)' : 'transparent',
                      color: '#fff',
                      fontWeight: 600,
                    }}
                  />
                );
              })}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Grid container columnSpacing={2} rowSpacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <ToggleButtonGroup
                  exclusive
                  value={formState.orderSide}
                  onChange={(_event, value: OrderSide | null) => {
                    if (value) {
                      setFormState((prev) => ({ ...prev, orderSide: value }));
                    }
                  }}
                  fullWidth
                  color={formState.orderSide === 'buy' ? 'success' : 'error'}
                >
                  <ToggleButton value="buy">Buy</ToggleButton>
                  <ToggleButton value="sell">Sell</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <ToggleButtonGroup
                  exclusive
                  value={formState.orderType}
                  onChange={(_event, value: OrderType | null) => {
                    if (value) {
                      setFormState((prev) => ({
                        ...prev,
                        orderType: value,
                        limitPrice: value === 'market' ? undefined : prev.limitPrice,
                      }));
                    }
                  }}
                  fullWidth
                >
                  <ToggleButton value="market">Market</ToggleButton>
                  <ToggleButton value="limit">Limit</ToggleButton>
                  <ToggleButton value="stop">Stop</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>
          </Grid>

          {shouldShowTriggerPrice && (
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Trigger Price"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                value={formState.limitPrice ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, limitPrice: event.target.value ? Number(event.target.value) : undefined }))
                }
                fullWidth
                error={!isTriggerValid}
                helperText={
                  isTriggerValid ? undefined : 'Enter a price above zero to arm limit or stop orders.'
                }
                sx={fieldStyles}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <ToggleButton
              value="shortSell"
              selected={formState.shortSell}
              onChange={() => setFormState((prev) => ({ ...prev, shortSell: !prev.shortSell }))}
              sx={(theme) => ({
                borderRadius: 1,
                borderColor: formState.shortSell ? theme.palette.error.main : 'var(--market-border, rgba(255,255,255,0.12))',
                color: formState.shortSell ? theme.palette.error.main : 'var(--market-text, #ffffff)',
                backgroundColor: formState.shortSell ? alpha(theme.palette.error.main, 0.08) : 'rgba(255,255,255,0.04)',
                px: 2,
                '&:hover': {
                  backgroundColor: formState.shortSell
                    ? alpha(theme.palette.error.main, 0.12)
                    : 'rgba(255,255,255,0.08)',
                },
              })}
            >
              Enable Short Sell
            </ToggleButton>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button type="submit" variant="contained" size="large" fullWidth sx={{ py: 1.5 }} disabled={!canSubmit}>
              Submit Order
            </Button>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                borderRadius: 2,
                border: '1px solid var(--market-border, rgba(255,255,255,0.14))',
                bgcolor: 'rgba(255,255,255,0.03)',
                px: 2,
                py: 1.5,
              }}
            >
              <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', fontSize: '0.75rem', mb: 1 }}>
                Order summary
              </Typography>
              <Stack spacing={0.5}>
                <Typography sx={{ color: 'var(--market-text, #ffffff)', fontWeight: 600 }}>
                  {formState.orderSide.toUpperCase()} {isQuantityValid ? formState.quantity : '—'} {formState.symbol || '—'}
                </Typography>
                <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' }}>
                  {formState.orderType === 'market' ? 'Market execution' : `${formState.orderType.toUpperCase()} order`}
                  {isTriggerValid && shouldShowTriggerPrice && formState.limitPrice
                    ? ` · trigger at ${formState.limitPrice}`
                    : ''}
                </Typography>
                {estimatedPrice ? (
                  <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' }}>
                    Est. price {estimatedPrice.toFixed(5)} → Notional
                    <Typography
                      component="span"
                      sx={{ color: 'var(--market-text, #ffffff)', fontWeight: 600, ml: 0.5 }}
                    >
                      {estimatedNotional === undefined
                        ? '—'
                        : estimatedNotional.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </Typography>
                  </Typography>
                ) : (
                  <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.6))' }}>
                    Notional will populate once a live quote is available.
                  </Typography>
                )}
              </Stack>
            </Box>
          </Grid>

          {quote ? (
            <Grid size={{ xs: 12 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' }} variant="body2">
                    Bid: <Typography component="span" sx={{ fontWeight: 600, color: 'var(--market-text, #ffffff)' }}>{quote.bid.toFixed(5)}</Typography>
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', textAlign: 'right' }} variant="body2">
                    Ask: <Typography component="span" sx={{ fontWeight: 600, color: 'var(--market-text, #ffffff)' }}>{quote.ask.toFixed(5)}</Typography>
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' }}>
                    Spread: {quote.spread.toFixed(1)} pips
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          ) : null}

          {lastSubmission ? (
            <Grid size={{ xs: 12 }}>
              <Alert severity="info" sx={{ mt: 1 }}>
                Last simulated order: {lastSubmission.orderSide.toUpperCase()} {lastSubmission.quantity} shares of {lastSubmission.symbol}{' '}
                via {lastSubmission.orderType.toUpperCase()} order
              </Alert>
            </Grid>
          ) : null}
        </Grid>
      </CardContent>
    </Card>
  );
}
