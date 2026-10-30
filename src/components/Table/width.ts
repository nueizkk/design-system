import { CellType } from './types';

/**
 * 컬럼 `type`이 정하는 칸의 폭 — 최소/최대 한 쌍이다(디자이너 확정, 2026-10-14).
 *
 * ```
 * shortText    24 / 72
 * middleText   72 / 128
 * longText    128 / 채움
 * status       40 / 120
 * icon         16 / 72
 * button       내용만큼(hug)
 * ```
 *
 * `flex-1`로 남는 자리를 나눠 갖되 최대에서 멈추고, 최소 아래로는 줄지 않는다.
 * 말줄임은 칸이 아니라 **칸 안의 글자**가 맡는다 — `DataCell`의 값 span이
 * `min-w-0 truncate`를 들고 있어서, 칸이 최소 폭이어도 글자는 더 줄어든다.
 *
 * `longText`만 최대가 없어 남는 자리를 전부 먹는다. 해시·주소처럼 길이를 예측할 수
 * 없는 값이 들어가는 자리다.
 */
export const CELL_WIDTH: Record<CellType, string> = {
  shortText: 'min-w-[24px] max-w-[72px] flex-1',
  middleText: 'min-w-[72px] max-w-[128px] flex-1',
  longText: 'min-w-[128px] flex-1',
  status: 'min-w-[40px] max-w-[120px] flex-1',
  icon: 'min-w-[16px] max-w-[72px] flex-1',
  button: 'w-fit shrink-0',
};
