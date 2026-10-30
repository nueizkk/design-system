import { ReactNode } from 'react';

import * as Icon from '../../../icons';
import { Text } from '../../Text';
import { cn } from '../../utils/cn';
import { CellAlignType, SortDirectionType } from '../types';

export interface ITitleCellProps {
  children: ReactNode;
  align?: CellAlignType;
  /**
   * 정렬 가능한 컬럼이면 넘긴다. 라벨 우측에 정렬 아이콘이 붙고 눌러서 방향을
   * 바꾼다. `direction`이 없으면 "이 컬럼으로 정렬하고 있지 않음"이다.
   */
  sort?: {
    direction?: SortDirectionType;
    onToggle: () => void;
  };
}

const ALIGN: Record<CellAlignType, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

/**
 * 컬럼 제목(Figma `TitleCell` 21409:2952).
 *
 * 패딩이 없다 — 칸의 여백은 행(`Title`)이 정하고, 여기는 **글자와 아이콘 한 줄**만
 * 책임진다. 높이 18은 `caption-1`의 줄높이 그대로다.
 *
 * 폭 제약(`type`)은 이 컴포넌트가 아니라 행이 건다. 같은 컬럼의 `DataCell`과 폭이
 * 어긋나면 안 되고, 그 값은 `columns`에 한 번만 적기 때문이다.
 *
 * Figma에는 `dropdown` 축도 있으나 쓰는 곳이 없어 넣지 않았다.
 */
export function TitleCell({ children, align = 'left', sort }: ITitleCellProps) {
  const SortIcon = SORT_ICON[sort?.direction ?? 'none'];

  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-1',
        ALIGN[align],
        sort && 'cursor-pointer select-none',
      )}
      onClick={sort?.onToggle}
    >
      {/**
        * `min-w-0`이 없으면 글자가 줄어들지 않아 정렬 아이콘을 칸 밖으로 밀어낸다 —
        * flex 자식의 `min-width` 기본값이 `auto`라서다.
        */}
      <Text
        variant="caption-1"
        weight="semibold"
        className="min-w-0 truncate"
      >
        {children}
      </Text>
      {sort && (
        <SortIcon
          size="sm"
          cursor="pointer"
          /** 정렬 중인 컬럼만 파랗다. 쉬고 있는 컬럼은 아이콘 기본색이다. */
          color={sort.direction ? 'status-main-standby' : undefined}
        />
      )}
    </div>
  );
}

const SORT_ICON = {
  asc: Icon.SortUp,
  desc: Icon.SortDown,
  none: Icon.SortDefault,
};

export default TitleCell;
