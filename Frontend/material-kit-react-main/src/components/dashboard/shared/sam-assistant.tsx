'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Link from 'next/link';

const surfaceSx = {
  bgcolor: 'rgba(19,47,76,0.92)',
  border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
  borderRadius: 3,
  backdropFilter: 'blur(18px)',
  boxShadow: '0 20px 60px rgba(1,12,28,0.45)',
} as const;

const steps: Array<{ title: string; description: string }> = [
  {
    title: 'Launch Sam from any dashboard view',
    description:
      'Use the footer chatbot button or press Shift + S. Sam opens as a side drawer without breaking your trading flow.',
  },
  {
    title: 'Ask market, risk, or account questions',
    description:
      'Sam has access to live desk data, margin policies, and platform docs. Keep prompts specific for faster answers.',
  },
  {
    title: 'Follow quick actions that Sam proposes',
    description:
      "Jump to trade tickets, risk center, or support tickets directly from Sam's suggested links.",
  },
  {
    title: 'Escalate with one command',
    description:
      'Type "hand over" and Sam exports the chat context to human support with current desk diagnostics attached.',
  },
];

const quickLinks: Array<{ href: string; label: string; helper: string }> = [
  { href: '/dashboard/help', label: 'Support Playbooks', helper: 'Troubleshoot, raise tickets' },
  { href: '/dashboard/news', label: 'Market Intelligence', helper: 'Latest headlines Sam references' },
  { href: '/dashboard/risk', label: 'Risk & Margin Center', helper: 'Review exposure before trade' },
];

export function SamAssistant(): React.JSX.Element {
  return (
    <Card sx={surfaceSx}>
      <CardHeader
        title="Sam · Uptrade Copilot"
        subheader="AI desk assistant for trade ops, risk, and support workflows"
        titleTypographyProps={{ sx: { color: '#ffffff', fontWeight: 600 } }}
        subheaderTypographyProps={{ sx: { color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' } }}
      />
      <Divider sx={{ borderColor: 'var(--market-border, rgba(255,255,255,0.12))' }} />
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.75))', mb: 2 }}>
              Sam stays online 24/6 across USA and India desks. Follow these steps to get answers, automate routine checks, and
              escalate issues instantly.
            </Typography>
            <Grid container direction="column" rowSpacing={1.75}>
              {steps.map((step, index) => (
                <Grid key={step.title} container columnSpacing={2} alignItems="flex-start" wrap="nowrap">
                  <Grid size={{ xs: 'auto' }}>
                    <Chip
                      label={`0${index + 1}`}
                      sx={{
                        bgcolor: 'rgba(11,110,253,0.25)',
                        color: '#ffffff',
                        fontWeight: 600,
                        minWidth: 44,
                        justifyContent: 'center',
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }} sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>{step.title}</Typography>
                    <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.75))', mt: 0.5 }}>
                      {step.description}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Grid container direction="column" rowSpacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>Sam responds best when you:</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Grid container direction="column" rowSpacing={1}>
                  {[
                    'Tag instruments or desks ("EUR/USD New York session?")',
                    'Reference risk thresholds before placing large orders',
                    'Paste order IDs or ticket numbers for faster lookups',
                  ].map((tip) => (
                    <Grid key={tip} size={{ xs: 12 }}>
                      <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.75))' }}>{tip}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ borderColor: 'var(--market-border, rgba(255,255,255,0.12))' }} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ color: '#ffffff', fontWeight: 600, mb: 1 }}>Quick integration links</Typography>
                <Grid container spacing={1.5}>
                  {quickLinks.map((link) => (
                    <Grid key={link.href} size={{ xs: 12 }}>
                      <Button
                        component={Link}
                        href={link.href}
                        fullWidth
                        variant="outlined"
                        sx={{
                          borderColor: 'rgba(255,255,255,0.18)',
                          color: '#ffffff',
                          justifyContent: 'space-between',
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 2,
                          '&:hover': {
                            borderColor: 'var(--market-accent, #0B6EFD)',
                            backgroundColor: 'rgba(11,110,253,0.12)',
                          },
                        }}
                      >
                        <span>{link.label}</span>
                        <Typography component="span" sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.65))', fontSize: '0.8rem' }}>
                          {link.helper}
                        </Typography>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', px: 3, py: 2 }}>
        <Button
          component={Link}
          href="/dashboard/help"
          variant="contained"
          sx={{
            bgcolor: 'var(--market-accent, #0B6EFD)',
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
            py: 1.25,
            borderRadius: 2,
            '&:hover': { bgcolor: 'var(--market-accentHover, #0958d9)' },
          }}
        >
          Start chat with Sam
        </Button>
      </CardActions>
    </Card>
  );
}
