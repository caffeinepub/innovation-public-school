// Single source of truth for site navigation links
export interface NavigationLink {
  name: string;
  path: string;
}

export const navigationLinks: NavigationLink[] = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Academics', path: '/academics' },
  { name: 'Admissions', path: '/admissions' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

// Helper function to deduplicate navigation links by path
export function deduplicateLinks(links: NavigationLink[]): NavigationLink[] {
  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.path)) {
      return false;
    }
    seen.add(link.path);
    return true;
  });
}
