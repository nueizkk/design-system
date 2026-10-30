import dayjs from 'dayjs';

import { DATE_FORMAT } from '../../../../utils/date';

import {
  getMatchedPreset,
  getPresetRange,
  getSubmitDisabled,
  isValidDateValue,
  toValidRange,
} from '../config';

const today = dayjs().format(DATE_FORMAT);
const daysAgo = (amount: number) =>
  dayjs().subtract(amount, 'day').format(DATE_FORMAT);
const yearsAgo = (amount: number) =>
  dayjs().subtract(amount, 'year').format(DATE_FORMAT);

describe('isValidDateValue', () => {
  it('YYYY-MM-DD 형식만 통과시킨다', () => {
    expect(isValidDateValue('2026-09-28')).toBe(true);
    expect(isValidDateValue('2026/09/28')).toBe(false);
    expect(isValidDateValue('garbage')).toBe(false);
    expect(isValidDateValue('')).toBe(false);
  });

  it('존재하지 않는 날짜는 걸러낸다', () => {
    expect(isValidDateValue('2026-13-45')).toBe(false);
    expect(isValidDateValue('2026-02-30')).toBe(false);
  });

  it('null은 "값 없음"이라 통과시킨다', () => {
    expect(isValidDateValue(null)).toBe(true);
  });
});

describe('toValidRange', () => {
  it('깨진 쪽만 null로 지우고 멀쩡한 쪽은 남긴다', () => {
    expect(
      toValidRange({ startDate: 'garbage', endDate: '2026-09-28' }),
    ).toEqual({ startDate: null, endDate: '2026-09-28' });
  });
});

describe('getSubmitDisabled', () => {
  it('둘 다 있거나 둘 다 없으면 활성화(false)한다', () => {
    expect(
      getSubmitDisabled({ startDate: '2026-09-21', endDate: '2026-09-28' }),
    ).toBe(false);
    expect(getSubmitDisabled({ startDate: null, endDate: null })).toBe(false);
  });

  it('한쪽만 있으면 비활성화(true)한다', () => {
    expect(getSubmitDisabled({ startDate: '2026-09-21', endDate: null })).toBe(
      true,
    );
    expect(getSubmitDisabled({ startDate: null, endDate: '2026-09-28' })).toBe(
      true,
    );
  });
});

describe('getPresetRange', () => {
  it('오늘을 종료일로 두고 프리셋만큼 거슬러 올라간다', () => {
    expect(getPresetRange('week')).toEqual({
      startDate: daysAgo(7),
      endDate: today,
    });
    expect(getPresetRange('month')).toEqual({
      startDate: daysAgo(30),
      endDate: today,
    });
    expect(getPresetRange('year')).toEqual({
      startDate: yearsAgo(1),
      endDate: today,
    });
  });

  it('구간이 없는 프리셋은 빈 값을 준다', () => {
    expect(getPresetRange('direct')).toEqual({
      startDate: null,
      endDate: null,
    });
  });
});

describe('getMatchedPreset', () => {
  it('프리셋 구간과 정확히 일치하면 그 프리셋을 찾아낸다', () => {
    expect(
      getMatchedPreset({ startDate: daysAgo(7), endDate: today }),
    ).toBe('week');
    expect(
      getMatchedPreset({ startDate: daysAgo(30), endDate: today }),
    ).toBe('month');
  });

  it('getPresetRange의 결과를 되돌려 받는다', () => {
    (['week', 'month', 'year'] as const).forEach((preset) => {
      expect(getMatchedPreset(getPresetRange(preset))).toBe(preset);
    });
  });

  it('어느 구간과도 안 맞으면 direct다', () => {
    expect(
      getMatchedPreset({ startDate: daysAgo(3), endDate: today }),
    ).toBe('direct');
  });

  it('종료일이 오늘이 아니면 프리셋으로 안 본다', () => {
    expect(
      getMatchedPreset({ startDate: daysAgo(8), endDate: daysAgo(1) }),
    ).toBe('direct');
  });

  it('한쪽만 있으면 direct, 둘 다 없으면 선택 없음(null)이다', () => {
    expect(getMatchedPreset({ startDate: daysAgo(7), endDate: null })).toBe(
      'direct',
    );
    expect(getMatchedPreset({ startDate: null, endDate: null })).toBeNull();
  });
});
