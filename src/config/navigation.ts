
type NavigationItem = {
  label: string;
  action: 'scroll' | 'navigate';
  target: string;
};

export const navigationItems: NavigationItem[] = [
  {
    label: 'Home',
    action: 'navigate',
    target: '/'
  },
  {
    label: 'About',
    action: 'scroll',
    target: 'about'
  },
  {
    label: 'Services',
    action: 'scroll',
    target: 'services'
  },
  {
    label: 'Contact',
    action: 'scroll',
    target: 'contact'
  }
];
