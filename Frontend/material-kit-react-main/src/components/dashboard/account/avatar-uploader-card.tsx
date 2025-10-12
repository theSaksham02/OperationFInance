'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';

import { useUser } from '@/hooks/use-user';

export function AvatarUploaderCard(): React.JSX.Element {
  const { user } = useUser();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = React.useState<string | undefined>(user?.avatar);
  const [zoom, setZoom] = React.useState(0);
  const [rotation, setRotation] = React.useState(0);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);

  React.useEffect(() => {
    return () => {
      if (preview && preview !== user?.avatar) {
        globalThis.URL.revokeObjectURL(preview);
      }
    };
  }, [preview, user?.avatar]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = globalThis.URL.createObjectURL(file);
    setPreview((prev) => {
      if (prev && prev !== user?.avatar) {
        globalThis.URL.revokeObjectURL(prev);
      }
      return url;
    });
    setLastUpdated(new Date());
  };

  const cardSurfaceSx = {
    bgcolor: 'rgba(19,47,76,0.92)',
    border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
    borderRadius: 3,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 20px 60px rgba(1,12,28,0.45)',
  } as const;

  const updatedLabel = lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'No recent upload';

  return (
    <Card sx={cardSurfaceSx} component="section">
      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Grid container rowSpacing={2.5}>
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>Avatar Studio</Typography>
            <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', mt: 0.75 }}>
              Upload a desk-ready portrait for Sam and ops to recognise you instantly across USA and India books.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              src={preview}
              sx={{
                height: 128,
                width: 128,
                border: '4px solid rgba(11,110,253,0.45)',
                boxShadow: '0 0 45px rgba(11,110,253,0.35)',
                transform: `scale(${1 + zoom / 100}) rotate(${rotation}deg)`,
                transition: 'transform 220ms ease',
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Grid container columnSpacing={2} rowSpacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', mb: 1 }}>Zoom</Typography>
                <Slider value={zoom} min={0} max={60} step={5} onChange={(_event, value) => setZoom(value as number)} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))', mb: 1 }}>Rotate</Typography>
                <Slider value={rotation} min={-15} max={15} step={1} onChange={(_event, value) => setRotation(value as number)} />
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Grid container columnSpacing={2} rowSpacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.25,
                    background: 'linear-gradient(135deg, rgba(11,110,253,0.9), rgba(37,99,235,0.9))',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(37,99,235,0.95), rgba(14,116,144,0.95))',
                    },
                  }}
                >
                  Upload portrait
                </Button>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setPreview(user?.avatar);
                    setZoom(0);
                    setRotation(0);
                    setLastUpdated(null);
                  }}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    py: 1.25,
                    '&:hover': { borderColor: 'var(--market-accent, #0B6EFD)', backgroundColor: 'rgba(11,110,253,0.12)' },
                  }}
                >
                  Reset adjustments
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Chip
              label={updatedLabel}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#ffffff', fontWeight: 500 }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
