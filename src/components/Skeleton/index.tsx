import { cva } from 'class-variance-authority';
import { tokens, TokenRadiusType } from 'tokens';

import { cn } from '../utils/cn';

interface ISkeletonProps {
  height?: string;
  minHeight?: string | null;
  maxHeight?: string;
  width?: string;
  minWidth?: string | null;
  maxWidth?: string;
  rounded?: TokenRadiusType;
  className?: string;
  play?: boolean;
}
export const Skeleton = ({
  height = '100%',
  minHeight = null,
  maxHeight = '100%',
  width = '100%',
  minWidth = null,
  maxWidth = '100%',
  rounded = 'xl',
  className,
  play = true,
}: ISkeletonProps) => {
  return (
    <div
      className={cn(SkeletonVariants({ play }), className)}
      style={{
        borderRadius: tokens.radius[rounded],
        width,
        minWidth: minWidth ?? 'auto',
        maxWidth,
        height,
        minHeight: minHeight ?? 'auto',
        maxHeight,
      }}
    />
  );
};

const SkeletonVariants = cva('bg-fill-strong', {
  variants: {
    play: {
      true: 'animate-skeleton',
      false: 'animate-none',
    },
  },
});
