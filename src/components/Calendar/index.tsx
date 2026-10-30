import { memo, useEffect, useState } from 'react';

import dayjs from 'dayjs';

import {
  generateCalendar,
  IDateRangeProps,
  MonthNumberType,
  SizeType,
} from './config';
import { CalendarProvider, useCalendarStore } from './context';
import CalendarDates from './Dates';
import CalendarYearMonth from './YearMonth';
import { cn } from '../utils/cn';

export type ICalendarProps = IDateRangeProps<{ size?: SizeType }>;

/**
 * 클라이언트 렌더링을 권장합니다. 실행 환경의 로컬 시간(`dayjs()`)으로 "오늘"과
 * 초기에 보여줄 달을 계산하는데, 이 계산은 마운트 직후(레이아웃 이펙트)에 실제 값으로
 * 확정됩니다. SSR로 그려질 경우 서버가 보낸 최초 HTML에는 방문자의 실제 로컬 날짜와
 * 무관한 고정 플레이스홀더(2000년 1월)가 잠깐 나타났다가 하이드레이션 직후 교체됩니다.
 */
export const Calendar = (props: ICalendarProps) => {
  return (
    <CalendarProvider>
      <CalendarMain {...props} />
    </CalendarProvider>
  );
};

const CalendarMain = memo((props: ICalendarProps) => {
  const { size = 'sm', startDate, endDate } = props;
  const [mode, setMode] = useState<'dates' | 'yearMonth'>('dates');

  const { setMonth, setYear, setDates } = useCalendarStore();

  /** 화면에 보이는 달/연도를 이 날짜가 포함된 달로 옮기고 그리드를 다시 만든다. */
  const jumpToMonthOf = (dateString: string) => {
    const date = dayjs(dateString);
    const dateYear = date.get('year');
    const dateMonth = (date.get('month') + 1) as MonthNumberType;
    setMonth(dateMonth);
    setYear(dateYear);
    setDates(generateCalendar(dateYear, Number(dateMonth)));
  };

  // 컨트롤드 컴포넌트라 startDate/endDate가 바깥에서(예: 부모의 프리셋 버튼으로) 바뀔 수
  // 있다. endDate는 startDate 없이 단독으로도 바뀔 수 있어(예: 끝 날짜만 프리셋 세팅)
  // 둘 다 각자 감시한다.
  useEffect(() => {
    if (startDate) jumpToMonthOf(startDate);
  }, [startDate]);

  useEffect(() => {
    if (endDate) jumpToMonthOf(endDate);
  }, [endDate]);

  return (
    <div
      className={cn(
        'bg-background-normal border-line-normal flex flex-col rounded-sm border px-6 pb-6',
        size === 'lg' ? 'w-[460px] gap-4 pt-5' : 'w-[348px] gap-2.5 pt-4',
      )}
    >
      {mode === 'yearMonth' ? (
        <CalendarYearMonth onClose={() => setMode('dates')} size={size} />
      ) : (
        <CalendarDates
          {...props}
          size={size}
          onOpenYearMonth={() => setMode('yearMonth')}
        />
      )}
    </div>
  );
});
