'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { useUser } from '@/hooks/use-user';

export function AccountInfo(): React.JSX.Element {
  const { user } = useUser();

  const cardSurfaceSx = {
    bgcolor: 'rgba(19,47,76,0.92)',
    border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
    borderRadius: 3,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 20px 60px rgba(1,12,28,0.45)',
  } as const;

  return (
    <Card sx={cardSurfaceSx}>
      <CardContent>
        <Grid container direction="column" alignItems="center" rowSpacing={2.5}>
          <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              src={user?.avatar}
              sx={{
                height: 96,
                width: 96,
                border: '3px solid rgba(11,110,253,0.45)',
                boxShadow: '0 0 35px rgba(11,110,253,0.35)',
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: '#ffffff', fontWeight: 600, fontSize: '1.35rem' }}>
              {user?.name || 'Sofia Rivers'}
            </Typography>
            <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', mt: 0.5 }} variant="body2">
              {user?.email || 'sofia.rivers@devias.io'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Chip
              label="Desk Lead · Multi-market"
              sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#ffffff', fontWeight: 600 }}
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <Grid container sx={{ px: 3, py: 2 }}>
        <Grid size={{ xs: 12 }}>
          <Button
            fullWidth
            component="a"
            href="#avatar-studio"
            variant="contained"
            sx={{
              bgcolor: 'var(--market-accent, #0B6EFD)',
              '&:hover': { bgcolor: 'var(--market-accentHover, #0958d9)' },
              borderRadius: 2,
              py: 1.25,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Open avatar studio
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}
