import { forwardRef } from 'react';

import { SizeType } from '../config';
import { Text } from '../../Text';
import { cn } from '../../utils/cn';

interface IYearMonthCellProps {
  size: SizeType;
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}

const YearMonthCell = forwardRef<HTMLDivElement, IYearMonthCellProps>(
  ({ size, active, disabled, label, onClick }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full items-center justify-center rounded-sm',
          !disabled && 'interaction after:rounded-sm cursor-pointer',
          active ? 'bg-primary-normal' : 'bg-transparent',
          size === 'lg' ? 'py-2.5' : 'py-[7px]',
        )}
        onClick={disabled ? undefined : onClick}
      >
        <Text
          variant={size === 'lg' ? 'body-2' : 'caption-1'}
          color={disabled ? 'label-disable' : active ? 'static-white' : 'label-normal'}
          weight={active ? 'semibold' : 'regular'}
        >
          {label}
        </Text>
      </div>
    );
  },
);

export default YearMonthCell;
