import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { DATE_FORMAT } from '../../../utils/date';

dayjs.extend(customParseFormat);

/** 날짜 범위 빠른 선택 버튼. 이 파일 밖에서는 쓰이지 않는다. */
export type CalendarPresetType = 'week' | 'month' | 'year' | 'direct';

export interface IDateRange {
  startDate: string | null;
  endDate: string | null;
}

export const EMPTY_RANGE: IDateRange = { startDate: null, endDate: null };

export const isValidDateValue = (value: string | null) =>
  value === null || dayjs(value, DATE_FORMAT, true).isValid();

/**
 * 쿼리 파라미터 등 외부에서 형식이 깨진 값이 들어올 수 있어, 유효하지 않은
 * 쪽은 없는 값으로 취급한다.
 */
export const toValidRange = ({ startDate, endDate }: IDateRange): IDateRange => ({
  startDate: isValidDateValue(startDate) ? startDate : null,
  endDate: isValidDateValue(endDate) ? endDate : null,
});

/** 완료는 start/end가 둘 다 있거나 둘 다 없을 때만 활성화 */
export const getSubmitDisabled = ({ startDate, endDate }: IDateRange) =>
  Boolean(startDate) !== Boolean(endDate);

const PRESET_RANGES: Partial<
  Record<CalendarPresetType, [number, dayjs.ManipulateType]>
> = {
  week: [7, 'day'],
  month: [30, 'day'],
  year: [1, 'year'],
};

/** 프리셋이 뜻하는 구간을 오늘 기준으로 계산한다. '직접'처럼 구간이 없으면 빈 값 */
export const getPresetRange = (preset: string): IDateRange => {
  const range = PRESET_RANGES[preset as CalendarPresetType];
  if (!range) return EMPTY_RANGE;

  const [amount, unit] = range;
  return {
    startDate: dayjs().subtract(amount, unit).format(DATE_FORMAT),
    endDate: dayjs().format(DATE_FORMAT),
  };
};

/**
 * 선택된 구간을 거꾸로 프리셋에 대응시킨다 — 캘린더로 고른 날짜가 마침
 * 프리셋 구간과 일치하면 그 칩이 켜지고, 값이 있는데 어느 구간과도 안 맞으면
 * '직접'이 켜진다. 프리셋 칩을 따로 상태로 들고 있지 않고 항상 날짜에서
 * 파생시키므로 두 방향이 자동으로 맞물린다.
 */
export const getMatchedPreset = ({
  startDate,
  endDate,
}: IDateRange): CalendarPresetType | null => {
  if (!startDate && !endDate) return null;
  if (!startDate || !endDate) return 'direct';

  if (endDate === dayjs().format(DATE_FORMAT)) {
    const matched = Object.entries(PRESET_RANGES).find(
      ([, [amount, unit]]) =>
        startDate === dayjs().subtract(amount, unit).format(DATE_FORMAT),
    );
    if (matched) return matched[0] as CalendarPresetType;
  }

  return 'direct';
};
