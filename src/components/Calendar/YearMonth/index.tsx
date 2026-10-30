import { useState } from "react";

import dayjs from "dayjs";

import { MonthNumberType, SizeType, stepMonth } from "../config";
import CalendarHeader from "../Header";
import useCalendar from "../useCalendar";
import Month from "./Month";
import Year from "./Year";
import { MONTH_NAME } from "../../../constant";
import { cn } from "../../utils/cn";

interface ICalendarYearMonthProps {
  onClose: () => void;
  size: SizeType;
}

const CalendarYearMonth = ({ onClose, size }: ICalendarYearMonthProps) => {
  const { setYear, setMonth, year, month, generateDates } = useCalendar({});

  const [selectedMonth, setSelectedMonth] = useState<MonthNumberType>(month);
  const [selectedYear, setSelectedYear] = useState<number>(year);

  /**
   * 고른 값을 실제 달력에 반영하고 닫는다. 헤더의 "월 연도" 텍스트를 누르거나
   * **월을 고르면** 호출된다 — Figma Calendar 문서(`37428:5876`)가 "월 click 시
   * 패널이 닫히고 해당 년·월의 Dates로 복귀합니다"로 못 박았다. 연도는 월
   * 그리드만 갈아끼우고 패널에 머문다.
   *
   * 월 클릭은 방금 누른 값을 인자로 넘긴다 — `setSelectedMonth`를 먼저 불러도
   * 그 렌더 전에는 `selectedMonth`가 아직 이전 값이다.
   */
  const applySelection = (
    nextYear = selectedYear,
    nextMonth = selectedMonth,
  ) => {
    setYear(nextYear);
    setMonth(nextMonth);
    generateDates(nextYear, nextMonth);
    onClose();
  };

  const handleStep = (direction: "prev" | "next") => {
    const { year: nextYear, month: nextMonth } = stepMonth(
      selectedYear,
      selectedMonth,
      direction,
    );
    setSelectedMonth(nextMonth);
    setSelectedYear(nextYear);
  };

  /** 패널을 닫고 오늘이 있는 달의 날짜 화면으로 간다. 고른 날짜는 건드리지 않는다. */
  const handleToday = () => {
    const today = dayjs();
    applySelection(
      today.get("year"),
      (today.get("month") + 1) as MonthNumberType,
    );
  };

  return (
    <div className={cn("flex flex-col", size === "lg" ? "gap-4" : "gap-2.5")}>
      <CalendarHeader
        size={size}
        label={`${MONTH_NAME[selectedMonth]} ${selectedYear}`}
        caretDirection="up"
        onPrev={() => handleStep("prev")}
        onNext={() => handleStep("next")}
        onToggle={() => applySelection()}
        onToday={handleToday}
      />
      <div
        className={cn(
          "flex items-start",
          size === "lg" ? "py-4" : "py-2.5",
        )}
      >
        <Year selected={selectedYear} onClick={setSelectedYear} size={size} />
        <div
          className={cn(
            "bg-line-normal mr-4 w-px",
            size === "lg" ? "h-[368px]" : "h-[272px]",
          )}
        />
        <Month
          selected={selectedMonth}
          onClick={(value) =>
            applySelection(selectedYear, value as MonthNumberType)
          }
          size={size}
        />
      </div>
    </div>
  );
};

export default CalendarYearMonth;
