import { useEffect, useState } from "react";

import dayjs, { Dayjs } from "dayjs";

import DateCell, { DateCellVariants } from "./DateCell";
import { DateCellStatus, IDateRangeProps, SizeType } from "../config";
import CalendarHeader from "../Header";
import useCalendar from "../useCalendar";
import { MONTH_NAME } from "../../../constant";
import { cn } from "../../utils/cn";

export { DateCellVariants };

// 요일 라벨 — Dates 화면에서만 쓴다.
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface IGetDateCellStatusOptions {
  startDate: string | null;
  endDate: string | null;
  hoverDate: string;
  isRange: boolean;
  today: Dayjs | null;
  minDate?: string;
  maxDate?: string;
}

// DateCell 상태 계산 — Dates 화면에서만 쓴다.
const getDateCellStatus = (
  date: string,
  {
    startDate,
    endDate,
    hoverDate,
    isRange,
    today,
    minDate,
    maxDate,
  }: IGetDateCellStatusOptions,
): DateCellStatus => {
  // start이거나 end인지
  if (date === startDate || date === endDate) return { selected: true };

  const hoverDateDay = dayjs(hoverDate);
  const dateDay = dayjs(date);
  const startDateDay = dayjs(startDate);
  const endDateDay = dayjs(endDate);

  // start를 찍고 end 찍기 전 움직일 때 표시
  if (
    startDate &&
    !endDate &&
    dateDay.isAfter(startDateDay) &&
    (dateDay.isSame(hoverDateDay, "date") ||
      dateDay.isBefore(hoverDateDay, "date")) &&
    isRange
  )
    return { inRange: true };

  // start와 end 사이에 들어갔는지
  if (
    startDate &&
    endDate &&
    dateDay.isAfter(startDateDay) &&
    dateDay.isBefore(endDateDay)
  )
    return { inRange: true };

  // 오늘인지 — Figma는 항상 표시되는 상태라 별도 토글 없이 판단한다.
  // today는 CalendarProvider가 마운트 직후 채워준다(SSR-safe, context.tsx 참고).
  if (today && dateDay.isSame(today, "day")) return { today: true };

  // minDate~maxDate 범위 밖인지
  if (
    (minDate && dateDay.isBefore(minDate, "day")) ||
    (maxDate && dateDay.isAfter(maxDate, "day"))
  )
    return { disabled: true };

  return {};
};

type ICalendarDatesProps = IDateRangeProps<{
  size: SizeType;
  onOpenYearMonth: () => void;
}>;

const CalendarDates = (props: ICalendarDatesProps) => {
  const { size, startDate, onOpenYearMonth, setStartDate, minDate, maxDate } =
    props;
  const endDate = props.endDate ?? null;
  const isRange = props.isRange ?? true;

  const [hoverDate, setHoverDate] = useState("");

  const {
    handleDateClick,
    handleMonth,
    handleToday,
    month,
    year,
    today,
    dates: weeks,
  } = useCalendar(
    props.isRange === false
      ? { startDate, setStartDate, isRange: false }
      : {
          startDate,
          endDate: props.endDate,
          setStartDate,
          setEndDate: props.setEndDate,
          isRange: true,
        },
  );

  useEffect(() => {
    setHoverDate("");
  }, [startDate, endDate]);

  return (
    <>
      <CalendarHeader
        size={size}
        label={`${MONTH_NAME[month]} ${year}`}
        caretDirection="down"
        onPrev={() => handleMonth("prev")}
        onNext={() => handleMonth("next")}
        onToggle={onOpenYearMonth}
        onToday={handleToday}
      />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between gap-2">
          {DAYS.map((weekday) => (
            <div
              className={cn(
                "flex items-center justify-center",
                size === "lg" ? "h-[52px] w-[52px]" : "h-[36px] w-[36px]",
              )}
              key={weekday}
            >
              {/** Figma: sm은 caption-1(12/18), lg는 body-2(14/20). */}
              <p className={size === "lg" ? "typo-body-2" : "typo-caption-1"}>
                {weekday}
              </p>
            </div>
          ))}
        </div>
        {weeks.map((week, weekIndex) => (
          <div className="flex justify-between gap-2" key={`week-${weekIndex}`}>
            {week.map((date) => {
              const dateDay = dayjs(date);
              const status = getDateCellStatus(date, {
                startDate,
                endDate,
                hoverDate,
                isRange,
                today,
                minDate,
                maxDate,
              });
              // 이번 달이 아닌 날짜(패딩용)는 DateCell이 알 필요 없는 표시 문제라
              // 여기서 계산해서 흐리게 보여주는 스타일만 얹어준다.
              const isOtherMonth = dateDay.get("month") + 1 !== month;
              return (
                <DateCell
                  key={date}
                  size={size}
                  {...status}
                  day={dateDay.date()}
                  onClick={() => handleDateClick(date, status)}
                  onMouseOver={() => setHoverDate(date)}
                  onMouseOut={() => setHoverDate(date)}
                  testId={date}
                  className={isOtherMonth ? "text-label-disable" : undefined}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

export default CalendarDates;
