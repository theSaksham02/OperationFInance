'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import type { SxProps, Theme } from '@mui/material/styles';

export interface MarketNewsArticle {
  id: string;
  headline: string;
  source: string;
  url: string;
  publishedAt: Date;
}

export interface MarketNewsProps {
  articles: MarketNewsArticle[];
  sx?: SxProps<Theme>;
}

export function MarketNews({ articles, sx }: MarketNewsProps): React.JSX.Element {
  const cardSurfaceSx = {
    bgcolor: 'rgba(19,47,76,0.92)',
    border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
    borderRadius: 3,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 20px 60px rgba(1,12,28,0.45)',
  } as const;

  return (
    <Card sx={{ ...cardSurfaceSx, ...sx }}>
      <CardHeader
        title="Market News"
        subheader="Curated insights from US & Indian exchanges"
        titleTypographyProps={{ sx: { color: 'var(--market-text, #ffffff)', fontWeight: 600 } }}
        subheaderTypographyProps={{ sx: { color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' } }}
      />
  <Divider sx={{ borderColor: 'var(--market-border, rgba(255,255,255,0.12))' }} />
      <CardContent>
        <Grid container direction="column" rowSpacing={3}>
          {articles.map((article) => (
            <Grid key={article.id} size={{ xs: 12 }}>
              <Grid container direction="column" rowSpacing={1}>
                <Grid size={{ xs: 12 }}>
                  <Link
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    variant="subtitle1"
                    sx={{ color: 'var(--market-text, #ffffff)', fontWeight: 600 }}
                  >
                    {article.headline}
                  </Link>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid size="auto">
                      <Chip label={article.source} variant="outlined" size="small" sx={{ color: 'var(--market-text, #ffffff)' }} />
                    </Grid>
                    <Grid size="auto">
                      <Typography variant="caption" sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' }}>
                        {article.publishedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
          {articles.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" sx={{ color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' }}>
                Market headlines will appear here once your feed is configured.
              </Typography>
            </Grid>
          ) : null}
        </Grid>
      </CardContent>
    </Card>
  );
}
