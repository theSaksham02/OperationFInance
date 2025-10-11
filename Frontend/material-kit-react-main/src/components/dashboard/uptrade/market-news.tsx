'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
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
  return (
    <Card sx={sx}>
      <CardHeader title="Market News" subheader="Curated insights from US & Indian exchanges" />
      <Divider />
      <CardContent>
        <Stack spacing={3}>
          {articles.map((article) => (
            <Stack key={article.id} spacing={1}>
              <Link href={article.url} target="_blank" rel="noopener noreferrer" underline="hover" variant="subtitle1">
                {article.headline}
              </Link>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={article.source} variant="outlined" size="small" />
                <Typography variant="caption" color="text.secondary">
                  {article.publishedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Stack>
            </Stack>
          ))}
          {articles.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Market headlines will appear here once your feed is configured.
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
