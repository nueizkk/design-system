import { cva } from 'class-variance-authority';

import { DateCellStatus, SizeType } from '../config';
import { cn } from '../../utils/cn';

interface IDateCellProps extends DateCellStatus {
  size: SizeType;
  day: number;
  onClick: () => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
  testId: string;
  className?: string;
}

const DateCell = ({
  size,
  disabled,
  today,
  selected,
  inRange,
  day,
  onClick,
  onMouseOver,
  onMouseOut,
  testId,
  className,
}: IDateCellProps) => {
  const unlessDisabled = (fn: () => void) => (disabled ? undefined : fn);

  return (
    <div
      className={cn(
        DateCellVariants({ size, disabled, today, selected, inRange }),
        className,
      )}
      onClick={unlessDisabled(onClick)}
      onMouseOver={unlessDisabled(onMouseOver)}
      onMouseOut={unlessDisabled(onMouseOut)}
      data-testid={testId}
    >
      <p className={cn(size === 'lg' ? 'typo-body-1' : 'typo-body-2')}>{day}</p>
    </div>
  );
};

export default DateCell;

// Header.tsx의 이전/다음 달 버튼도 크기 클래스를 공유한다.
export const DateCellVariants = cva(
  'flex justify-center items-center rounded-sm bg-background-normal text-label-normal',
  {
    variants: {
      size: {
        sm: 'w-[36px] h-[36px]',
        lg: 'w-[52px] h-[52px] min-w-[52px] min-h-[52px]',
      },
      disabled: {
        true: 'cursor-not-allowed text-label-disable',
        false: 'interaction after:rounded-sm cursor-pointer',
      },
      today: {
        true: '',
        false: '',
      },
      selected: {
        true: 'bg-primary-normal text-static-white',
        false: '',
      },
      inRange: {
        true: 'bg-interaction-active text-primary-normal',
        false: '',
      },
    },
    defaultVariants: {
      disabled: false,
      today: false,
      selected: false,
      inRange: false,
    },
    compoundVariants: [
      // 오늘 표시(파란 링)는 selected·inRange가 아닐 때만 보인다. disabled여도 보인다.
      {
        today: true,
        selected: false,
        inRange: false,
        className: 'border border-primary-normal rounded-full',
      },
    ],
  },
);
