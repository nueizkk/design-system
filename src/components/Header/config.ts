/**
 * 밝기 모드. `Table/config.tsx`에도 같은 이름이 있으나 그쪽은 표 외형
 * (`'default' | 'rectangular'`)이라 뜻이 다르다.
 */
export type ThemeType = 'light' | 'dark';

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;

/** 남은 시간에 쓸 자릿수. 1이면 `ss`, 2면 `mm:ss`, 3이면 `HH:mm:ss`. */
export type TimeUnitCountType = 1 | 2 | 3;

/**
 * 처음 남은 시간이 자릿수를 정한다. 1시간 이상이면 시까지, 1분 이상이면 분까지,
 * 그 아래면 초만 쓴다.
 */
export const getTimeUnitCount = (leftMs: number): TimeUnitCountType =>
  leftMs >= HOUR_MS ? 3 : leftMs >= MINUTE_MS ? 2 : 1;

/** 자릿수별 한 칸의 크기(초). 뒤에서부터 `unitCount`개만 쓴다. */
const UNIT_SECONDS = [3600, 60, 1];

/**
 * 남은 시간 표시.
 *
 * 자릿수는 **처음 남은 시간으로 한 번만 정하고 유지한다**(`getTimeUnitCount`).
 * 매 틱 다시 판단하면 경계를 지나는 순간 `01:00:00` → `59:59`로 글자 폭이 줄어
 * 옆 칩들이 밀린다. 그래서 `02:00:00`으로 시작한 세션은 끝까지 `00:00:09`이고,
 * `45`초로 시작한 세션은 끝까지 `09` · `00`이다.
 *
 * 자릿수를 넘는 시간은 **버리지 않고 맨 앞자리에 쌓는다** — `mm:ss`에 1시간이
 * 들어오면 `60:00`이다. 연장으로 자릿수를 다시 정하기 전의 한 틱이나, 호출부가
 * 자릿수를 직접 줬을 때 시간이 조용히 잘리는 것보다 낫다.
 *
 * 전에는 `ServiceType`으로 `mm:ss`(admin) · `HH:mm:ss`(client)를 갈랐고, admin은
 * 2시간이 남아도 `59:59`로 잘라 보여줬다. 포맷은 서비스가 아니라 시간이 정한다.
 */
export const getFormattedTime = (
  leftMs: number,
  unitCount: TimeUnitCountType,
) => {
  let rest = Math.max(0, Math.floor(leftMs / 1000));

  return UNIT_SECONDS.slice(UNIT_SECONDS.length - unitCount)
    .map((seconds) => {
      const value = Math.floor(rest / seconds);
      rest %= seconds;
      return pad2(value);
    })
    .join(':');
};

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
