import { cva } from 'class-variance-authority';

import { SizeType } from './config';
import { DateCellVariants } from './Dates';
import { IconSizeType } from '../../icons';
import * as Icon from '../../icons';
import { Text } from '../Text';
import { cn } from '../utils/cn';
import { useStrings } from '../../i18n';

interface ICalendarHeaderProps {
  size: SizeType;
  label: string;
  /**
   * 닫혀서(날짜 그리드 보이는 중) 클릭하면 열리는 화살표는 down, 열려서(월/연도
   * 고르는 중) 클릭하면 적용되고 닫히는 화살표는 up — Dates와 YearMonth가 같은
   * 헤더를 쓰되 이 방향만 다르다.
   */
  caretDirection: 'up' | 'down';
  onPrev: () => void;
  onNext: () => void;
  onToggle: () => void;
  onToday: () => void;
}

interface ISizeConfig {
  clusterPadding: string;
  labelGap: string;
  labelVariant: 'body-2' | 'subtitle-2';
  chevronSize: IconSizeType;
  caretSize: IconSizeType;
  todayVariant: 'body-1' | 'body-2';
}

const SIZE_CONFIG: Record<SizeType, ISizeConfig> = {
  sm: {
    clusterPadding: 'p-2',
    labelGap: 'gap-2',
    labelVariant: 'body-2',
    chevronSize: 'md',
    caretSize: 'xs',
    todayVariant: 'body-2',
  },
  lg: {
    clusterPadding: 'p-3',
    labelGap: 'gap-3',
    labelVariant: 'subtitle-2',
    chevronSize: 'lg',
    caretSize: 'sm',
    todayVariant: 'body-1',
  },
};

const CalendarHeader = ({
  size,
  label,
  caretDirection,
  onPrev,
  onNext,
  onToggle,
  onToday,
}: ICalendarHeaderProps) => {
  const { clusterPadding, labelGap, labelVariant, chevronSize, caretSize, todayVariant } =
    SIZE_CONFIG[size];
  const strings = useStrings();
  const Caret =
    caretDirection === 'up' ? Icon.CaretUpSolid : Icon.CaretDownSolid;

  return (
    <div className={ContainerVariants({ size })}>
      <div
        className={cn(
          'flex flex-1 items-center justify-between',
          clusterPadding,
        )}
      >
        <div
          data-testid="previousMonth"
          className={DateCellVariants({ size })}
          onClick={onPrev}
        >
          <Icon.ChevronLeft
            size={chevronSize}
            cursor="pointer"
            color="label-normal"
          />
        </div>
        <div
          className={cn('flex cursor-pointer items-center', labelGap)}
          onClick={onToggle}
        >
          <Text
            variant={labelVariant}
            color="label-normal"
            className="shrink-0 whitespace-nowrap"
          >
            {label}
          </Text>
          <Caret size={caretSize} cursor="pointer" color="label-normal" />
        </div>
        <div
          data-testid="nextMonth"
          className={DateCellVariants({ size })}
          onClick={onNext}
        >
          <Icon.ChevronRight
            size={chevronSize}
            cursor="pointer"
            color="label-normal"
          />
        </div>
      </div>
      <Text
        variant={todayVariant}
        color="primary-normal"
        className="shrink-0 cursor-pointer"
        onClick={onToday}
      >
        {strings['today']}
      </Text>
    </div>
  );
};

export default CalendarHeader;

const ContainerVariants = cva(
  'w-full flex items-center justify-between select-none typo-body-2',
  {
    variants: {
      size: {
        sm: 'h-[36px] gap-8',
        lg: 'h-[54px] gap-10',
      },
    },
  },
);
