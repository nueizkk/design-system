import { ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { TableSizeType } from '../types';

interface ITitleRowProps {
  children: ReactNode;
  size?: TableSizeType;
}

/**
 * 헤더 행(Figma `Title` 36720:6903). 표당 하나다.
 *
 * `lg`는 배경을 깔고(`fill-normal`, radius 8), `sm`은 배경 없이 아래 줄만 긋는다.
 * 실측값이다 — 두 크기가 구분 방식 자체를 다르게 쓴다.
 *
 * 높이 32는 두 크기가 같다. 칸 높이(18)를 뺀 14가 위아래 7씩이다.
 */
export function TitleRow({ children, size = 'lg' }: ITitleRowProps) {
  return (
    <div
      className={cn(
        'flex h-8 items-center gap-8',
        size === 'lg'
          ? 'bg-fill-normal rounded-sm px-10'
          : 'border-line-normal border-b',
      )}
    >
      {children}
    </div>
  );
}

export default TitleRow;
