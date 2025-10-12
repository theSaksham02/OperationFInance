'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import type { SxProps, Theme } from '@mui/material/styles';

const previewEmail = `Subject: Uptrade | Trade execution alert \n\nHi Sofia,\nOrder #98231 on EUR/USD executed at 1.07842.\nMargin headroom now 118% (USA desk).\n\n— Uptrade Sam`;

export function Notifications(): React.JSX.Element {
  const cardSurfaceSx = {
    bgcolor: 'rgba(19,47,76,0.92)',
    border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
    borderRadius: 3,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 20px 60px rgba(1,12,28,0.45)',
  } as const;

  const controlLabelSx: SxProps<Theme> = {
    '& .MuiTypography-root': {
      color: 'var(--market-textSecondary, rgba(255,255,255,0.75))',
      fontWeight: 500,
    },
  };

  return (
    <Card sx={cardSurfaceSx}>
      <CardHeader
        subheader="Manage your notification preferences"
        title="Notifications"
        titleTypographyProps={{ sx: { color: '#ffffff', fontWeight: 600 } }}
        subheaderTypographyProps={{ sx: { color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' } }}
      />
      <Divider sx={{ borderColor: 'var(--market-border, rgba(255,255,255,0.12))' }} />
      <CardContent>
        <Grid container columnSpacing={3} rowSpacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container direction="column" rowSpacing={3}>
              <Grid size={{ xs: 12 }}>
                <FormGroup>
                  <Typography gutterBottom variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                    Email notifications
                  </Typography>
                  <FormControlLabel
                    control={<Checkbox defaultChecked sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: 'var(--market-accent, #0B6EFD)' } }} />}
                    label="Trade execution alerts"
                    sx={controlLabelSx}
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: 'var(--market-accent, #0B6EFD)' } }} />}
                    label="Market news updates"
                    sx={controlLabelSx}
                  />
                  <FormControlLabel
                    control={<Checkbox sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: 'var(--market-accent, #0B6EFD)' } }} />}
                    label="Weekly portfolio summary"
                    sx={controlLabelSx}
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: 'var(--market-accent, #0B6EFD)' } }} />}
                    label="Account security alerts"
                    sx={controlLabelSx}
                  />
                </FormGroup>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormGroup>
                  <Typography gutterBottom variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                    Push notifications
                  </Typography>
                  <FormControlLabel
                    control={<Checkbox defaultChecked sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: 'var(--market-accent, #0B6EFD)' } }} />}
                    label="Price alerts"
                    sx={controlLabelSx}
                  />
                  <FormControlLabel
                    control={<Checkbox sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: 'var(--market-accent, #0B6EFD)' } }} />}
                    label="Economic calendar events"
                    sx={controlLabelSx}
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: 'var(--market-accent, #0B6EFD)' } }} />}
                    label="Margin call warnings"
                    sx={controlLabelSx}
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Grid
              container
              direction="column"
              rowSpacing={2}
              sx={{
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 3,
                p: 2,
                background: 'rgba(11,110,253,0.08)',
                boxShadow: 'inset 0 0 24px rgba(11,110,253,0.28)',
              }}
            >
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>Preview</Typography>
                <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', fontSize: '0.85rem' }}>
                  Hover to pause — template mirrors actual alerts Sam dispatches to your desks.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography
                  component="pre"
                  sx={{
                    fontFamily: 'var(--font-mono, "Roboto Mono", monospace)',
                    color: 'rgba(255,255,255,0.85)',
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.8rem',
                    background: 'rgba(2,18,34,0.65)',
                    borderRadius: 2,
                    p: 1.5,
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'transform 180ms ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 18px 40px rgba(1,12,28,0.45)',
                    },
                  }}
                >
                  {previewEmail}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
