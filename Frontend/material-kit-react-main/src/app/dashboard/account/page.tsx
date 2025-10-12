import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';
import { ProfileCompletionCard } from '@/components/dashboard/account/profile-completion-card';
import { AvatarUploaderCard } from '@/components/dashboard/account/avatar-uploader-card';
import { AccountActivityFeed } from '@/components/dashboard/account/account-activity-feed';
import { AccessFootprintMap } from '@/components/dashboard/account/access-footprint-map';
import { SamAssistant } from '@/components/dashboard/shared/sam-assistant';

export const metadata: Metadata = { title: `Account | Dashboard | ${config.site.name}` };

export default function Page(): React.JSX.Element {
  const heroCardSx = {
    background: 'linear-gradient(135deg, rgba(11,110,253,0.25), rgba(3,16,34,0.95))',
    border: '1px solid rgba(11,110,253,0.35)',
    borderRadius: 3,
    boxShadow: '0 30px 80px rgba(5,15,32,0.55)',
  } as const;

  const completionMilestones = [
    { id: 'kyc', label: 'KYC verified · Tier 1', completed: true },
    { id: 'contact', label: 'Desk contacts refreshed', completed: true },
    { id: 'documents', label: 'Signed USA/India NDAs', completed: false },
    { id: '2fa', label: 'Hardware token linked', completed: true },
  ];

  return (
    <Grid container direction="column" rowSpacing={3}>
      <Grid size={{ xs: 12 }}>
        <Card sx={heroCardSx}>
          <CardContent>
            <Grid container spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography
                  sx={{
                    color: 'var(--market-textSecondary, rgba(255,255,255,0.7))',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: 2,
                  }}
                >
                  Profile Control Center
                </Typography>
                <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: { xs: '2rem', md: '2.35rem' }, mt: 1 }}>
                  Manage your Uptrade identity
                </Typography>
                <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.75))', maxWidth: 520, mt: 1.5 }}>
                  Keep personal info current, upload a desk-ready avatar, and review security settings across the multi-market platform.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Grid container rowSpacing={1.5}>
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', letterSpacing: 1 }}>
                      QUICK SUMMARY
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Chip
                      label="Dual-market access active"
                      sx={{ bgcolor: 'rgba(11,110,253,0.28)', color: '#fff', fontWeight: 600, mr: 1 }}
                    />
                    <Chip
                      label="2FA enabled"
                      sx={{ bgcolor: 'rgba(16,185,129,0.32)', color: '#b7ffe1', fontWeight: 600 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.14)' }} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.75)' }}>
                      Last updated profile · 12 days ago
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', mt: 0.5 }}>
                      Keep your phone number and residency information current to avoid desk interruptions.
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <AccountInfo />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <ProfileCompletionCard completion={84} milestones={completionMilestones} />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <AccessFootprintMap />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }} id="avatar-studio">
            <AvatarUploaderCard />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <AccountActivityFeed />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <AccountDetailsForm />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <SamAssistant />
      </Grid>
    </Grid>
  );
}

