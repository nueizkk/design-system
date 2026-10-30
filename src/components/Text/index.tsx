import {
  ElementType,
  forwardRef,
  HTMLAttributes,
  ReactNode,
} from 'react';

import { cva, VariantProps } from 'class-variance-authority';
import {
  TokenSemanticColorType,
  TokenTypographyType,
  TokenWeightType,
} from 'tokens';

import { cn } from '../utils/cn';

export type TextVariantsType = VariantProps<typeof TextVariants>;

interface ITextProps
  extends TextVariantsType,
    Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /**
   * 렌더할 엘리먼트. 기본은 `span`이며 **시각적 외형에 영향을 주지 않는다** —
   * 글자 크기(`variant`)와 문서 구조는 별개 축이다. 문단이면 `p`, 문서 제목이면
   * `h1`~`h6`, 폼 라벨이면 `label`을 명시한다.
   */
  as?: ElementType;
  /** 시맨틱 컬러 토큰. 생략하면 `label-normal`이다. */
  color?: TokenSemanticColorType;
  /**
   * 텍스트와 인라인 엘리먼트(`a`·`b`·`strong` 등)만 넣는다. 기본값 `span` 안에
   * `div` 같은 블록 요소를 넣으면 유효하지 않은 HTML이므로, 블록이 필요하면
   * `as="div"`로 바꾼다.
   */
  children?: ReactNode;
}

/**
 * ref 타입은 기본값인 `span` 기준이다. `as`로 다른 엘리먼트를 쓰면 호출부가
 * 그에 맞는 ref 타입을 지정한다 — `as`가 `ElementType`이라 타입 수준에서
 * 엘리먼트별 ref를 추론할 수 없다.
 */
export const Text = forwardRef<HTMLElement, ITextProps>(
  (
    {
      as: Tag = 'span',
      weight,
      variant,
      color = 'label-normal',
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          TextVariants({ variant, weight }),
          `text-${color}`,
          className,
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);

Text.displayName = 'Text';

/**
 * Figma Typography 스케일 10종. tokens의 typography 키를 전수 커버해야 하며,
 * 규정 외 스케일을 쓰면 컴파일 단계에서 걸린다.
 */
const VARIANT_STYLE = {
  'headline-1': 'typo-headline-1',
  'headline-2': 'typo-headline-2',
  'headline-3': 'typo-headline-3',
  'headline-4': 'typo-headline-4',
  'subtitle-1': 'typo-subtitle-1',
  'subtitle-2': 'typo-subtitle-2',
  'body-1': 'typo-body-1',
  'body-2': 'typo-body-2',
  'caption-1': 'typo-caption-1',
  'caption-2': 'typo-caption-2',
} satisfies Record<TokenTypographyType, string>;

/**
 * Figma Weight 사용 규정 4종. tokens의 weight 키를 전수 커버해야 하며,
 * 규정 외 굵기를 쓰면 컴파일 단계에서 걸린다.
 */
const WEIGHT_STYLE = {
  light: 'font-light',
  regular: 'font-regular',
  semibold: 'font-semibold',
  bold: 'font-bold',
} satisfies Record<TokenWeightType, string>;

/**
 * 색은 여기 두지 않는다 — `text-${color}`는 `tokens/tailwindConfig.ts`의
 * safelist가 CSS 생성을 보장하므로 런타임 맵(`createColorClasses`)이 필요 없다.
 * 맵을 두면 클래스 이름을 만들려고 색상값 테이블 전체를 번들에 끌고 온다.
 */
const TextVariants = cva('', {
  variants: {
    variant: VARIANT_STYLE,
    weight: WEIGHT_STYLE,
  },
  defaultVariants: {
    variant: 'body-1',
    weight: 'regular',
  },
});
