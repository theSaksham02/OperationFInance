'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export interface SamAssistantLauncherProps {
  onLaunch?: () => void;
}

export function SamAssistantLauncher({ onLaunch }: SamAssistantLauncherProps): React.JSX.Element {
  const [isHovered, setIsHovered] = React.useState(false);
  const [ping, setPing] = React.useState(true);

  React.useEffect(() => {
    const interval: ReturnType<typeof setInterval> = globalThis.setInterval(() => setPing((prev) => !prev), 3200);
    return () => {
      globalThis.clearInterval(interval);
    };
  }, []);

  return (
    <Grid
      container
      sx={{
        position: 'fixed',
        bottom: { xs: 24, md: 32 },
        right: { xs: 16, md: 32 },
        zIndex: 1200,
        width: 'auto',
      }}
    >
      <Grid size={{ xs: 12 }}>
        <Tooltip
          title="Launch Sam · Uptrade Copilot"
          placement="left"
          slotProps={{ popper: { modifiers: [{ name: 'offset', options: { offset: [0, -4] } }] } }}
        >
          <Button
            onClick={onLaunch}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            variant="contained"
            sx={{
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(11,110,253,0.88), rgba(29,78,216,0.88))',
              color: '#ffffff',
              fontWeight: 700,
              textTransform: 'none',
              px: 3,
              py: 1.5,
              borderRadius: 9999,
              boxShadow: isHovered ? '0 18px 55px rgba(11,110,253,0.55)' : '0 12px 35px rgba(11,110,253,0.35)',
              transform: isHovered ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
              transition: 'transform 160ms ease, box-shadow 160ms ease',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(37,99,235,0.92), rgba(14,116,144,0.92))',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: -6,
                borderRadius: 'inherit',
                background: 'linear-gradient(135deg, rgba(11,110,253,0.25), rgba(59,130,246,0.25))',
                opacity: ping ? 0.35 : 0.15,
                filter: 'blur(12px)',
                transition: 'opacity 320ms ease',
              },
            }}
          >
            <Typography sx={{ fontWeight: 700 }}>Chat with Sam</Typography>
          </Button>
        </Tooltip>
      </Grid>
    </Grid>
  );
}
