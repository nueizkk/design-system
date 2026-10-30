import { ComponentPropsWithRef, forwardRef, ReactNode } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '../utils/cn';

export type SizeType = 'sm' | 'lg';

interface ICardProps extends ComponentPropsWithRef<'div'> {
  children: ReactNode;
  size?: SizeType;
}

const cardVariants = cva(
  'bg-background-normal border-line-normal w-full border',
  {
    variants: {
      size: {
        sm: 'rounded-sm p-6',
        lg: 'rounded-lg p-10',
      },
    },
  },
);

export const Card = forwardRef<HTMLDivElement, ICardProps>(
  ({ children, className, size = 'lg', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ size }), className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
