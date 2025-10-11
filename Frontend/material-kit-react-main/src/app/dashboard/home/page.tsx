import * as React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { config } from '@/config';

export const metadata: Metadata = { title: `Dashboard | ${config.site.name}` };

export default function Page(): never {
  redirect('/dashboard/usa');
}
