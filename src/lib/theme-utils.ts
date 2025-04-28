
import { theme } from '@/config/theme';

export const getThemeColor = (color: string) => {
  return `var(--color-${color})`;
};

export const getCssVariable = (category: string, value: string) => {
  return `var(--${category}-${value})`;
};
