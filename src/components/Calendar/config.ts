import dayjs from 'dayjs';

import { DATE_FORMAT } from '../utils/date';

import { MONTH_NAME } from '../../constant';

/**
 * DateCell 하나가 가질 수 있는 상태. 서로 배타적으로만 쓰이지만(먼저 매칭되는 것 하나만
 * true) DateCell 입장에선 독립된 boolean이면 충분해서 enum 대신 이 형태로 준다.
 * "이번 달이 아닌 날짜"인지는 여기 안 넣는다 — DateCell이 알 필요 없는, Dates가 알아서
 * 흐리게 보여주면 되는 표시 문제라서 Dates 쪽에서 별도로 계산한다.
 */
export interface DateCellStatus {
  disabled?: boolean;
  today?: boolean;
  selected?: boolean;
  inRange?: boolean;
}
export type SizeType = 'sm' | 'lg';
export type MonthNumberType = keyof typeof MONTH_NAME;

interface IDateRangeCommonProps {
  startDate: string | null;
  setStartDate: (date: string | null) => void;
  minDate?: string;
  maxDate?: string;
}

/**
 * "range면 setEndDate 필수, single이면 endDate/setEndDate 자체를 못 받음"이라는
 * discriminated union을 여러 컴포넌트(Calendar, Dates)가 공유해서 쓴다. T에는
 * 그 컴포넌트만의 나머지 prop을 넣는다.
 */
export type IDateRangeProps<T extends object = object> = T &
  IDateRangeCommonProps &
  (
    | {
        isRange?: true;
        endDate?: string | null;
        setEndDate: (date: string | null) => void;
      }
    | { isRange: false; endDate?: never; setEndDate?: never }
  );

export const FIRST_MONTH = 1;
export const LAST_MONTH = 12;

/** 월 하나 이동. 1월에서 이전으로 가면 작년 12월로, 12월에서 다음으로 가면 내년 1월로 넘어간다. */
export const stepMonth = (
  year: number,
  month: MonthNumberType,
  direction: 'prev' | 'next',
): { year: number; month: MonthNumberType } => {
  let nextYear = year;
  let nextMonth: number = month;

  if (direction === 'prev') {
    if (month === FIRST_MONTH) {
      nextMonth = LAST_MONTH;
      nextYear--;
    } else {
      nextMonth--;
    }
  } else {
    if (month === LAST_MONTH) {
      nextMonth = FIRST_MONTH;
      nextYear++;
    } else {
      nextMonth++;
    }
  }

  return { year: nextYear, month: nextMonth as MonthNumberType };
};

const WEEK_DAYS = 7;

export const generateCalendar = (year: number, month: number) => {
  const calendar: string[][] = [];

  // 현재 바라보고 있는 날짜, 초기값은 이번달 첫 날
  let firstDay = dayjs(`${year}-${month}-1`);
  // 이번달 마지막 날
  const lastDay = firstDay.endOf('month');

  // 첫 번째 날짜를 일요일로 설정
  firstDay = firstDay.subtract((firstDay.day() + WEEK_DAYS) % WEEK_DAYS, 'day');

  // 현재 바라보고 있는 날짜가 이번달 마지막 날보다 이전이거나 같은지
  while (firstDay.isSameOrBefore(lastDay, 'day')) {
    // 현재 주 일요일부터 토요일까지 하나의 배열을 만들어 push
    const week: string[] = [];

    for (let i = 0; i < WEEK_DAYS; i++) {
      week.push(firstDay.format(DATE_FORMAT));
      firstDay = firstDay.add(1, 'day');
    }
    calendar.push(week);
  }

  return calendar;
};
