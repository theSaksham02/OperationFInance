'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const RECIPES = [
  {
    id: 'risk-snapshot',
    title: 'Risk snapshot to inbox',
    helper: '"Sam, email me risk snapshot for NY desk"',
    accent: 'rgba(11,110,253,0.25)',
  },
  {
    id: 'margin-check',
    title: 'Pre-trade margin check',
    helper: '"Sam, confirm margin on EUR/INR 2M"',
    accent: 'rgba(16,185,129,0.28)',
  },
  {
    id: 'support-escalation',
    title: 'Escalate ticket to ops',
    helper: '"Sam, hand over this chat to ops"',
    accent: 'rgba(248,113,113,0.28)',
  },
];

export function AutomationRecipesGallery(): React.JSX.Element {
  const surfaceSx = {
    bgcolor: 'rgba(19,47,76,0.92)',
    border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
    borderRadius: 3,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 20px 60px rgba(1,12,28,0.45)',
  } as const;

  return (
    <Card sx={surfaceSx} component="section">
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Grid container rowSpacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>Automation recipes</Typography>
            <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', fontSize: '0.85rem', mt: 0.75 }}>
              Launch Sam commands in one click — cards expand to copy usage straight into your clipboard.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Grid container spacing={2.5}>
              {RECIPES.map((recipe) => (
                <Grid key={recipe.id} size={{ xs: 12, md: 4 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      textTransform: 'none',
                      borderRadius: 3,
                      borderColor: 'rgba(255,255,255,0.14)',
                      color: '#ffffff',
                      background: `linear-gradient(135deg, ${recipe.accent}, rgba(3,17,36,0.92))`,
                      boxShadow: '0 14px 35px rgba(1,12,28,0.35)',
                      minHeight: 150,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      padding: 2,
                      transition: 'transform 180ms ease, box-shadow 180ms ease',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 22px 60px rgba(1,12,28,0.55)',
                        borderColor: 'var(--market-accent, #0B6EFD)',
                      },
                    }}
                    onClick={() => navigator.clipboard.writeText(recipe.helper).catch(() => { /* swallow clipboard errors */ })}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '1.05rem' }}>{recipe.title}</Typography>
                    <Chip
                      label={recipe.helper}
                      sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#ffffff', fontWeight: 500 }}
                    />
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
