import { ReactElement, ReactNode } from 'react';

import { StatusType } from '../Status';

/**
 * 셀 안에서 내용이 어느 쪽에 붙는지. Figma `TitleCell`·`DataCell`의 `align`이다.
 *
 * `Popover`의 `AlignType`(`start`·`center`·`end`)과 값 개수는 같지만 뜻이 다르다 —
 * 그쪽은 떠 있는 패널이 트리거의 어느 끝에 맞붙는지이고, 이쪽은 칸 안에서 글자가
 * 어느 쪽에 붙는지다. CSS도 `text-align`과 `justify-content`로 나눠 쓴다.
 */
export type CellAlignType = 'left' | 'center' | 'right';

/**
 * 셀의 종류. **컬럼의 폭 제약이자 내용의 성격**이다(Figma `type`).
 *
 * 한 컬럼의 `TitleCell`과 `DataCell`은 같은 `type`을 쓴다 — 헤더와 데이터의 폭이
 * 어긋나면 안 되기 때문이다. 그래서 `columns`에 한 번만 적는다.
 *
 * - `shortText` 짧은 고정폭 텍스트
 * - `middleText` 중간 폭 텍스트·수량
 * - `longText` 가변 폭 긴 텍스트·해시
 * - `status` 상태 칩
 * - `icon` 아이콘 단독
 * - `button` 버튼
 */
export type CellType =
  | 'shortText'
  | 'middleText'
  | 'longText'
  | 'status'
  | 'icon'
  | 'button';

/** 표 크기. 행 높이·좌우 여백·구분선 유무가 전부 여기서 갈린다(Figma `size`). */
export type TableSizeType = 'sm' | 'lg';

/** 정렬 방향. `undefined`는 이 컬럼으로 정렬하고 있지 않다는 뜻이다. */
export type SortDirectionType = 'asc' | 'desc';

/**
 * 컬럼 하나. `type`에 따라 받는 필드가 달라진다 — 글자 칸에만 `tooltip`이 있고,
 * 상태 칸에는 `status`가 반드시 있어야 하는 식이다. 잘못 조합하면 컴파일에서 걸린다.
 *
 * `align`과 `type`은 헤더와 데이터가 **같이** 쓴다. 한 컬럼의 TitleCell과 DataCell이
 * 어긋나면 안 되므로 여기 한 번만 적는다.
 */
type BaseColumn = {
  /**
   * 헤더에 그릴 것. 보통 글자지만 아이콘을 넣기도 하고, 제목 없는 칸이면
   * `null`이나 빈 문자열을 넘긴다(아이콘 열 등).
   *
   * `string`으로 좁히지 않는 이유는 소비앱이 실제로 JSX와 `null`을 넘기고 있어서다.
   */
  header: ReactNode;
  align?: CellAlignType;
  /** 정렬 가능한 컬럼인지. 실제 정렬은 `Table`의 `sort`·`onSortChange`로 밖에서 한다. */
  sort?: boolean;
};

type TextColumn<T> = BaseColumn & {
  type: 'shortText' | 'middleText' | 'longText';
  key: Extract<keyof T, string>;
  /**
   * 값을 가공해 그린다. 안 넘기면 `row[key]`를 그대로 쓴다.
   *
   * 무엇을 돌려주든 라이브러리가 겉을 감싸므로 폭·말줄임·타이포가 보장된다.
   * 툴팁과 복사에 쓸 글자는 **그려진 결과에서 뽑아낸다**(`textContent`).
   */
  cell?: (value: T[Extract<keyof T, string>], row: T) => ReactNode;
  /** 값 앞의 분류. `'일반'`을 돌려주면 `[일반]`으로 그린다 — 괄호는 라이브러리가 붙인다. */
  category?: (row: T) => string;
  /** 값 뒤의 자산 단위. `'ETH'`처럼 돌려준다. */
  currency?: (row: T) => string;
  copy?: boolean;
  /** 복사 완료 안내는 호출부 몫이다. 넘기지 않으면 복사만 되고 조용하다. */
  onCopy?: (text: string, row: T) => void;
  tooltip?: 'always';
};

type StatusColumn<T> = BaseColumn & {
  type: 'status';
  key: string;
  /** 상태 칩의 색과 글자. 상태값→색 매핑은 서비스 도메인이라 밖에서 정한다. */
  status: (row: T) => { type: StatusType; label: string };
};

type IconColumn<T> = BaseColumn & {
  type: 'icon';
  key: string;
  /** 그릴 아이콘. `null`을 돌려주면 그 행에는 아무것도 안 그린다. */
  icon: (row: T) => ReactElement | null;
};

type ButtonColumn<T> = BaseColumn & {
  type: 'button';
  key: string;
  button: (row: T) => {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
};

export type ColumnType<T> =
  | TextColumn<T>
  | StatusColumn<T>
  | IconColumn<T>
  | ButtonColumn<T>;

/**
 * 정렬 상태와 그것을 바꾸는 법. 한 자루로 묶는 이유는 `pagination`과 같다 —
 * 상태만 주고 콜백을 빼먹으면 눌러도 아무 일이 없는데, 떨어져 있으면 타입이
 * 그걸 막지 못한다.
 *
 * `key`가 `undefined`면 아무 컬럼으로도 정렬하고 있지 않다는 뜻이다.
 */
export type TableSortType = {
  key?: string;
  direction?: SortDirectionType;
  onChange: (sort: { key: string; direction: SortDirectionType } | undefined) => void;
};
