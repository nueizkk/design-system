import { type ComponentType, type ReactNode, type SVGAttributes } from 'react';

import { cva } from 'class-variance-authority';
import { TokenSemanticColorType } from 'tokens';

import { cn } from '../components/utils/cn';

export const iconSize = {
  xs: '12px',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '28px',
  '2xl': '32px',
  '3xl': '56px',
} as const;

export type IconSizeType = keyof typeof iconSize;

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  size?: IconSizeType;
  /**
   * 시맨틱 컬러 토큰. `fill="currentColor"`이므로 `text-*` 유틸이 그대로 먹는다.
   * 생략하면 부모의 `color`를 상속한다.
   */
  color?: TokenSemanticColorType;
}

/**
 * 슬롯 prop(`leftIcon` 등)이 아이콘을 받을 때 쓰는 타입.
 *
 * 렌더된 엘리먼트가 아니라 **컴포넌트 자체**를 받는다 — 슬롯을 가진 쪽이
 * `size`·`color`를 상태에 따라 계산해 넣어야 하는데, 엘리먼트를 받으면
 * 그 값들을 덮어쓰느라 소비처가 지정한 값이 조용히 무시되기 때문이다.
 *
 * ```tsx
 * <Button leftIcon={Icon.Star} />
 * ```
 */
export type IconComponentType = ComponentType<IconProps>;

/**
 * Tailwind는 소스에 리터럴로 존재하는 클래스만 감지하므로, `w-[${value}]`처럼
 * 동적으로 조합하면 CSS가 생성되지 않는다. 각 크기를 리터럴 문자열로 명시한다.
 *
 * 색은 여기 두지 않는다 — `text-${color}`는 `tokens/tailwindConfig.ts`의
 * safelist가 CSS 생성을 보장하므로 런타임 맵(`createColorClasses`)이 필요 없다.
 */
const svgVariants = cva('', {
  variants: {
    size: {
      xs: 'w-[12px] min-w-[12px] h-[12px]',
      sm: 'w-[16px] min-w-[16px] h-[16px]',
      md: 'w-[20px] min-w-[20px] h-[20px]',
      lg: 'w-[24px] min-w-[24px] h-[24px]',
      xl: 'w-[28px] min-w-[28px] h-[28px]',
      '2xl': 'w-[32px] min-w-[32px] h-[32px]',
      '3xl': 'w-[56px] min-w-[56px] h-[56px]',
    } satisfies Record<IconSizeType, string>,
  },
});

/**
 * 모든 아이콘이 공유하는 래퍼. 각 아이콘 모듈은 자신의 `<path>`만 children으로
 * 넘기고, 크기·색은 여기서 처리한다.
 *
 * 소비처는 이 컴포넌트를 직접 쓰지 않는다. `Icon.Star`처럼 개별 아이콘을 쓴다.
 *
 * `memo`를 걸지 않는다 — 각 아이콘이 매번 새 `<path>` 엘리먼트를 children으로
 * 넘기므로 shallow 비교가 항상 실패해 아무것도 막지 못한다. 실제로 메모이제이션이
 * 필요해지면 여기가 아니라 아이콘 모듈 132개 각각을 감싸야 한다.
 */
export function IconBase({
  size = 'lg',
  color = 'label-normal',
  className,
  children,
  ...props
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn(svgVariants({ size }), `text-${color}`, className)}
      {...props}
    >
      {children}
    </svg>
  );
}
