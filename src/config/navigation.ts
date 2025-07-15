type NavigationItem = {
  label: string;
  action: 'scroll' | 'navigate';
  target: string;
};

export const navigationItems: NavigationItem[] = [
  {
    label: 'Home',
    action: 'navigate',
    target: '/',
  },
  {
    label: 'Our Services',
    action: 'scroll',
    target: 'services',
  },
  {
    label: 'About Us',
    action: 'scroll',
    target: 'about',
  },
  {
    label: 'Contact',
    action: 'scroll',
    target: 'contact',
  },
];
