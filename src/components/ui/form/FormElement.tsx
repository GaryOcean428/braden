import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const formVariants = cva('', {
  variants: {
    size: {
      default: 'space-y-4',
      lg: 'space-y-6',
      xl: 'space-y-8',
    },
    color: {
      default: '',
      primary: 'text-braden-navy',
      secondary: 'text-braden-slate',
    },
  },
  defaultVariants: {
    size: 'default',
    color: 'default',
  },
});

export type FormElementProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof formVariants>;

export const FormElement = React.forwardRef<HTMLDivElement, FormElementProps>(
  ({ className, size, color, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(formVariants({ size, color }), className)}
      {...props}
    />
  )
);
FormElement.displayName = 'FormElement';
