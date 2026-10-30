import { ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { TableSizeType } from '../types';

interface IDataRowProps {
  children: ReactNode;
  size?: TableSizeType;
  /**
   * 마지막 행이면 아래 구분선을 긋지 않는다(Figma `border=false`). prop으로 받지
   * 않고 행의 위치에서 유도하라는 뜻이라, 목록을 그리는 쪽에서 넘긴다.
   */
  isLast?: boolean;
  /**
   * 행을 눌렀을 때. **넘기지 않으면 hover 음영도 커서도 없다** — 누를 수 없는 표가
   * 눌릴 것처럼 보이지 않게 한다.
   */
  onClick?: () => void;
}

/**
 * 데이터 행(Figma `Data` 36720:7003).
 *
 * **배경이 없다.** 칠하는 건 헤더뿐이고 데이터 행은 투명이라, 표를 흰 카드 위에
 * 얹어도 겹쳐 보이지 않는다.
 *
 * 구분선은 `lg`에만 있고 좌우 8px씩 들어온다. `sm`은 행 사이가 비어 있다.
 */
export function DataRow({
  children,
  size = 'lg',
  isLast = false,
  onClick,
}: IDataRowProps) {
  const hasBorder = size === 'lg' && !isLast;

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-8',
        size === 'lg' ? 'h-14 px-10' : 'h-10',
        onClick && 'interaction cursor-pointer rounded-sm after:rounded-sm',
        hasBorder &&
          'before:bg-line-normal before:absolute before:bottom-0 before:left-0 before:right-0 before:mx-2 before:h-px before:content-[""]',
      )}
    >
      {children}
    </div>
  );
}

export default DataRow;
