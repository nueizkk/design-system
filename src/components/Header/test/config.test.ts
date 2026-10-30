import { getFormattedTime, getTimeUnitCount } from '../config';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

describe('getTimeUnitCount', () => {
  it('처음 남은 시간이 자릿수를 정한다', () => {
    expect(getTimeUnitCount(2 * HOUR)).toBe(3);
    expect(getTimeUnitCount(HOUR)).toBe(3);
    expect(getTimeUnitCount(HOUR - SECOND)).toBe(2);
    expect(getTimeUnitCount(MINUTE)).toBe(2);
    expect(getTimeUnitCount(MINUTE - SECOND)).toBe(1);
    expect(getTimeUnitCount(0)).toBe(1);
  });
});

describe('getFormattedTime', () => {
  it('시로 시작하면 끝까지 시 자리를 유지한다', () => {
    expect(getFormattedTime(2 * HOUR, 3)).toBe('02:00:00');
    expect(getFormattedTime(5 * MINUTE + 3 * SECOND, 3)).toBe('00:05:03');
    expect(getFormattedTime(9 * SECOND, 3)).toBe('00:00:09');
    expect(getFormattedTime(0, 3)).toBe('00:00:00');
  });

  it('분으로 시작하면 끝까지 분 자리를 유지한다', () => {
    expect(getFormattedTime(30 * MINUTE, 2)).toBe('30:00');
    expect(getFormattedTime(9 * SECOND, 2)).toBe('00:09');
    expect(getFormattedTime(0, 2)).toBe('00:00');
  });

  it('초로 시작하면 초만 보여준다', () => {
    expect(getFormattedTime(45 * SECOND, 1)).toBe('45');
    expect(getFormattedTime(9 * SECOND, 1)).toBe('09');
    expect(getFormattedTime(0, 1)).toBe('00');
  });

  it('자릿수를 넘는 시간은 버리지 않고 맨 앞자리에 쌓는다', () => {
    expect(getFormattedTime(HOUR, 2)).toBe('60:00');
    expect(getFormattedTime(2 * MINUTE + 5 * SECOND, 1)).toBe('125');
  });

  it('음수는 0으로 본다', () => {
    expect(getFormattedTime(-5 * SECOND, 3)).toBe('00:00:00');
  });
});
