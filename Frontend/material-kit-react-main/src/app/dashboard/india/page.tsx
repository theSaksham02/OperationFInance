import type { Metadata } from 'next';
import { config } from '@/config';
import { TradingDashboardContainer } from '@/components/dashboard/uptrade/trading-dashboard-container';

export const metadata = { title: `India Market | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <TradingDashboardContainer market="india" />;
}
