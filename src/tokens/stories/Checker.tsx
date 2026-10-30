import type { ReactNode } from 'react';

/**
 * 투명·알파가 섞인 값(`transparent`, `material-dim`, dark의 line-*·fill-*, opacity
 * 전 구간)은 단색 배경 위에서 안 보이거나 실제보다 진해 보인다. 체커를 깔아
 * 알파를 눈으로 확인할 수 있게 한다.
 *
 * 색을 직접 받지 않고 children을 감싸기만 한다 — 위에 올리는 게 색인 경우도,
 * opacity만 다른 같은 색인 경우도 있어서다.
 */
export const Checker = ({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <span
    className={`border-line-strong block rounded border ${className}`}
    style={{
      background:
        'repeating-conic-gradient(#0000000f 0% 25%, #ffffff00 0% 50%) 50% / 12px 12px',
    }}
  >
    {children}
  </span>
);
