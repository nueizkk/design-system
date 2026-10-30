import { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '../utils/cn';

export type SizeType = 'sm' | 'lg';

interface ISectionProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  size?: SizeType;
}

const sectionVariants = cva('bg-fill-alternative w-full', {
  variants: {
    size: {
      sm: 'rounded-sm p-6',
      lg: 'rounded-lg p-10',
    },
  },
});

export const Section = ({
  children,
  className,
  size = 'lg',
  ...props
}: ISectionProps) => {
  return (
    <div className={cn(sectionVariants({ size }), className)} {...props}>
      {children}
    </div>
  );
};
