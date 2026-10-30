import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import {
  DateCellStatus,
  generateCalendar,
  MonthNumberType,
  stepMonth,
} from './config';
import { useCalendarStore } from './context';

dayjs.extend(isSameOrBefore);

interface IUseCalendarCommonProps {
  startDate?: string | null;
  setStartDate?: (date: string | null) => void;
}

type IUseCalendarRangeProps = IUseCalendarCommonProps & {
  isRange?: true;
  endDate?: string | null;
  setEndDate?: (date: string | null) => void;
};

type IUseCalendarSingleProps = IUseCalendarCommonProps & {
  isRange: false;
  endDate?: never;
  setEndDate?: never;
};

type IUseCalendarProps = IUseCalendarRangeProps | IUseCalendarSingleProps;

const useCalendar = (props: IUseCalendarProps) => {
  const { startDate, setStartDate = () => {} } = props;
  const endDate = props.endDate ?? null;
  const setEndDate = props.setEndDate ?? (() => {});
  const isRange = props.isRange ?? true;
  const { dates, month, setDates, setMonth, setYear, year, today, setToday } =
    useCalendarStore();

  const handleMonth = (direction: 'prev' | 'next') => {
    const { year: newYear, month: newMonth } = stepMonth(year, month, direction);
    setMonth(newMonth);
    setYear(newYear);
    setDates(generateCalendar(newYear, newMonth));
  };

  const handleDateClick = (date: string, status: DateCellStatus) => {
    if (status.disabled) return;

    const dateDay = dayjs(date);
    const startDay = dayjs(startDate);
    const dateMonth = dateDay.get('month') + 1;
    const dateYear = dateDay.get('year');

    // 현재 달과 다르다면
    if (dateMonth !== month) {
      setMonth(dateMonth as MonthNumberType);
      setYear(dateYear);
      setDates(generateCalendar(dateYear, dateMonth));
    }

    if (!isRange) {
      setStartDate(date);
      return;
    }

    // 시작 날짜와 끝 날짜가 있을 때
    if (startDate && endDate) {
      setStartDate(date);
      setEndDate(null);
      return;
    }

    // 시작 날짜가 있고 끝 날짜가 없을 때
    if (startDate && !endDate) {
      // 시작 날짜 이전이라면
      if (dateDay.isBefore(startDay, 'day')) {
        setStartDate(date);
        return;
      } else {
        setEndDate(date);
        return;
      }
    }

    // 시작 날짜가 없고 끝 날짜가 있을 때
    if (!startDate && endDate) {
      // 끝 날짜 이후라면
      if (dateDay.isAfter(endDate, 'day')) {
        setStartDate(date);
        setEndDate(null);
        return;
      } else {
        setStartDate(date);
        return;
      }
    }

    if (!startDate && !endDate) {
      setStartDate(date);
    }
  };

  const generateDates = (newYear: number, newMonth: number) => {
    setDates(generateCalendar(newYear, newMonth));
  };

  // 오늘이 보이는 달로 바로 이동(선택 상태는 건드리지 않음)
  // 이동과 "오늘" 링 표시가 같은 순간 기준이어야 해서 today도 이 dayjs()로 함께 갱신한다.
  const handleToday = () => {
    const now = dayjs();
    const todayYear = now.get('year');
    const todayMonth = (now.get('month') + 1) as MonthNumberType;

    setToday(now);
    setYear(todayYear);
    setMonth(todayMonth);
    setDates(generateCalendar(todayYear, todayMonth));
  };

  // 날짜 추가 후 필터 다시 열었을 떄 달력 이동을 위한 것

  return {
    handleDateClick,
    handleMonth,
    handleToday,
    month,
    year,
    dates,
    today,
    setYear,
    setMonth,
    generateDates,
  };
};

export default useCalendar;
