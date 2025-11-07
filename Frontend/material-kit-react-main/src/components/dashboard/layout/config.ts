import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'usa', title: 'USA Forex Market', href: paths.dashboard.usa, icon: 'globe-west' },
  { key: 'india', title: 'India Market', href: paths.dashboard.india, icon: 'globe-east' },
] satisfies NavItemConfig[];
