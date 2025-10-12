import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import SvgIcon from '@mui/material/SvgIcon';

import { CaretDown } from '@phosphor-icons/react';

import { config } from '@/config';
import { Notifications } from '@/components/dashboard/settings/notifications';
import { UpdatePasswordForm } from '@/components/dashboard/settings/update-password-form';
import { SecurityHardeningCard } from '@/components/dashboard/settings/security-hardening-card';
import { AutomationRecipesGallery } from '@/components/dashboard/settings/automation-recipes-gallery';
import { SamAssistant } from '@/components/dashboard/settings/sam-assistant';

export const metadata: Metadata = { title: `Settings | Dashboard | ${config.site.name}` };

export default function Page(): React.JSX.Element {
  const heroCardSx = {
    background: 'linear-gradient(135deg, rgba(255,111,0,0.25), rgba(34,12,2,0.95))',
    border: '1px solid rgba(255,111,0,0.35)',
    borderRadius: 3,
    boxShadow: '0 30px 80px rgba(20,8,0,0.6)',
  } as const;

  const accordionSx = {
    bgcolor: 'rgba(19,47,76,0.92)',
    border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
    borderRadius: 3,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 20px 60px rgba(1,12,28,0.45)',
    '&::before': { display: 'none' },
    '& + &': { mt: 2.5 },
    '& .MuiAccordionSummary-root': {
      px: { xs: 2.5, md: 3 },
      py: 2,
    },
    '& .MuiAccordionDetails-root': {
      px: { xs: 2.5, md: 3 },
      pb: { xs: 2.5, md: 3 },
    },
  } as const;

  return (
    <Grid container direction="column" rowSpacing={3}>
      <Grid size={{ xs: 12 }}>
        <Card sx={heroCardSx}>
          <CardContent>
            <Grid container spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.75)',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: 2,
                  }}
                >
                  Platform preferences
                </Typography>
                <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: { xs: '2rem', md: '2.35rem' }, mt: 1 }}>
                  Tune notifications & security
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.75)', maxWidth: 540, mt: 1.5 }}>
                  Configure critical trade alerts, manage comms from the USA and India desks, and keep your credentials rotation-ready.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Grid container direction="column" rowSpacing={1.5}>
                  <Grid size={{ xs: 12 }}>
                    <Chip
                      label="3 notification channels"
                      sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#ffffff', fontWeight: 600 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Chip
                      label="Password age · 45 days"
                      sx={{ bgcolor: 'rgba(11,110,253,0.28)', color: '#ffffff', fontWeight: 600 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                      Tip: rotate desk passwords every 60 days and leave push notifications enabled for margin coverage alerts.
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Accordion defaultExpanded sx={accordionSx} TransitionProps={{ unmountOnExit: true }}>
          <AccordionSummary
            expandIcon={
              <SvgIcon fontSize="small" sx={{ color: '#ffffff' }}>
                <CaretDown weight="bold" />
              </SvgIcon>
            }
          >
            <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>Notification channels</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Notifications />
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded sx={accordionSx} TransitionProps={{ unmountOnExit: true }}>
          <AccordionSummary
            expandIcon={
              <SvgIcon fontSize="small" sx={{ color: '#ffffff' }}>
                <CaretDown weight="bold" />
              </SvgIcon>
            }
          >
            <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>Security & credentials</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <UpdatePasswordForm />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <SecurityHardeningCard />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={accordionSx} TransitionProps={{ unmountOnExit: true }}>
          <AccordionSummary
            expandIcon={
              <SvgIcon fontSize="small" sx={{ color: '#ffffff' }}>
                <CaretDown weight="bold" />
              </SvgIcon>
            }
          >
            <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>Sam automations & integrations</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 6 }}>
                <SamAssistant />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <AutomationRecipesGallery />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
}
