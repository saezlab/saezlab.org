import { getInternalLink } from '../lib/utils';

export interface NavItem {
  href: string;
  label: string;
}

export const navigationItems: NavItem[] = [
  { href: getInternalLink('/'), label: 'Home' },
  { href: getInternalLink('/publications'), label: 'Publications' },
  { href: getInternalLink('/team'), label: 'Team' },
  { href: 'https://github.com/saezlab', label: 'Software' },
  { href: getInternalLink('/funding'), label: 'Funding' },
  { href: getInternalLink('/jobs'), label: 'Jobs' },
  { href: getInternalLink('/contact'), label: 'Contact' },
]; 