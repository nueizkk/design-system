import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';

import dayjs, { Dayjs } from 'dayjs';

import { generateCalendar, MonthNumberType } from './config';

interface ICalendarState {
  dates: string[][];
  setDates: Dispatch<SetStateAction<string[][]>>;
  year: number;
  setYear: Dispatch<SetStateAction<number>>;
  month: MonthNumberType;
  setMonth: Dispatch<SetStateAction<MonthNumberType>>;
  /** "오늘"이 언제인지 — DateCell의 오늘 링 표시가 이 값을 그대로 가져다 쓴다. */
  today: Dayjs | null;
  setToday: Dispatch<SetStateAction<Dayjs | null>>;
}

const CalendarContext = createContext<ICalendarState | undefined>(undefined);

// 실제 "오늘"을 알기 전까지 서버/클라이언트 첫 렌더가 항상 똑같도록 쓰는 고정값.
// dayjs()는 실행 환경의 로컬 시간을 쓰므로 서버에서 계산하면 방문자의 실제 오늘과
// 다를 수 있다 — 그 값이 무엇이든 상관없이 하이드레이션 시점까지는 서버/클라이언트가
// 합의할 수 있는 값이기만 하면 된다.
const PLACEHOLDER_YEAR = 2000;
const PLACEHOLDER_MONTH = 1;

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [dates, setDates] = useState(() =>
    generateCalendar(PLACEHOLDER_YEAR, PLACEHOLDER_MONTH),
  );
  const [year, setYear] = useState(PLACEHOLDER_YEAR);
  const [month, setMonth] = useState<MonthNumberType>(
    PLACEHOLDER_MONTH as MonthNumberType,
  );
  const [today, setToday] = useState<Dayjs | null>(null);

  // 페인트 전에 실행되므로(레이아웃 이펙트) 사용자는 플레이스홀더를 보지 못하고
  // 바로 실제 "오늘이 보이는 달"을 보게 된다 — 다만 SSR로 그려질 경우 서버가 보낸
  // HTML엔 플레이스홀더가 실제로 찍혀 있다가 하이드레이션 후 이 값으로 교체된다.
  useLayoutEffect(() => {
    const now = dayjs();
    setToday(now);
    setYear(now.get('year'));
    setMonth((now.get('month') + 1) as MonthNumberType);
    setDates(generateCalendar(now.get('year'), now.get('month') + 1));
  }, []);

  return (
    <CalendarContext.Provider
      value={{ dates, month, setDates, setMonth, setYear, year, today, setToday }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarStore = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) throw new Error('Calendar 하위에서만 사용할 수 있습니다.');
  return context;
};
