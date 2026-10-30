import { forwardRef, HTMLProps } from 'react';

import { cn } from '../utils/cn';

export const Toggle = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          `appearance-none relative rounded-md bg-status-main-off overflow-hidden w-[36px] h-[20px]
          disabled:bg-interaction-disable disabled:before:bg-interaction-disable disabled:before:border-[0.5px] disabled:before:border-line-neutral disabled:no-interaction
          checked:bg-primary-normal checked:disabled:bg-interaction-disable
          before:content-[''] before:absolute before:left-0 before:rounded-full before:bg-static-white before:transition-[left] before:duration-200 before:m-0.5 before:shadow-400 before:w-[16px] before:h-[16px] checked:before:left-[16px]`,
          className,
        )}
        type="checkbox"
        role="switch"
        ref={ref}
        {...props}
      />
    );
  },
);
