import { CSSRuleObject } from 'tailwindcss/types/config';

/**
 * 고정 타이포그래피 스케일 (Client/Admin 기본값, Figma Typography 기준)
 * 1rem = 16px, letter-spacing은 36px 이상에만 -0.02em(Figma -2%)을 적용한다.
 */
export const typography = {
  'headline-1': {
    fontSize: '3.75rem',
    lineHeight: '4.5rem',
    letterSpacing: '-0.02em',
  },
  'headline-2': {
    fontSize: '3rem',
    lineHeight: '3.75rem',
    letterSpacing: '-0.02em',
  },
  'headline-3': {
    fontSize: '2.25rem',
    lineHeight: '3rem',
    letterSpacing: '-0.02em',
  },
  'headline-4': {
    fontSize: '1.875rem',
    lineHeight: '2.375rem',
  },
  'subtitle-1': {
    fontSize: '1.5rem',
    lineHeight: '2rem',
  },
  'subtitle-2': {
    fontSize: '1.25rem',
    lineHeight: '1.875rem',
  },
  'body-1': {
    fontSize: '1rem',
    lineHeight: '1.5rem',
  },
  'body-2': {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
  'caption-1': {
    fontSize: '0.75rem',
    lineHeight: '1.125rem',
  },
  'caption-2': {
    fontSize: '0.625rem',
    lineHeight: '1rem',
  },
};

export type TokenTypographyType = keyof typeof typography;

const MD = '@media (min-width: 768px)';
const XL = '@media (min-width: 1280px)';

/**
 * corp(홈페이지) 전용 반응형 축소값 — [XS(base), MD(768~1279)]
 * XL(1280~)은 고정값과 동일해 typography를 그대로 재사용한다.
 * body-1 · body-2 · caption-2는 Figma에서 전 구간 고정이므로 여기에 없다.
 * Figma: Typography - Responsive Set
 */
const responsiveShrink: Partial<
  Record<TokenTypographyType, [CSSRuleObject, CSSRuleObject]>
> = {
  'headline-1': [
    { fontSize: '2.25rem', lineHeight: '3rem', letterSpacing: '-0.02em' },
    { fontSize: '3rem', lineHeight: '3.75rem', letterSpacing: '-0.02em' },
  ],
  'headline-2': [
    { fontSize: '1.5rem', lineHeight: '2rem' },
    { fontSize: '2.25rem', lineHeight: '3rem', letterSpacing: '-0.02em' },
  ],
  'headline-3': [
    { fontSize: '1.5rem', lineHeight: '2rem' },
    { fontSize: '1.875rem', lineHeight: '2.375rem' },
  ],
  'headline-4': [
    { fontSize: '1.25rem', lineHeight: '1.875rem' },
    { fontSize: '1.875rem', lineHeight: '2.375rem' },
  ],
  'subtitle-1': [
    { fontSize: '1rem', lineHeight: '1.5rem' },
    { fontSize: '1rem', lineHeight: '1.5rem' },
  ],
  'subtitle-2': [
    { fontSize: '0.875rem', lineHeight: '1.25rem' },
    { fontSize: '1rem', lineHeight: '1.5rem' },
  ],
  'caption-1': [
    { fontSize: '0.625rem', lineHeight: '1rem' },
    { fontSize: '0.625rem', lineHeight: '1rem' },
  ],
};

export const typographyUtilities: { [key: string]: CSSRuleObject } = {
  ...Object.fromEntries(
    Object.entries(typography).map(([name, value]) => [
      `.typo-${name}`,
      value,
    ]),
  ),
  ...Object.fromEntries(
    Object.entries(typography).map(([name, xl]) => {
      const shrink = responsiveShrink[name as TokenTypographyType];
      return [
        `.typo-responsive-${name}`,
        shrink ? { ...shrink[0], [MD]: shrink[1], [XL]: xl } : xl,
      ];
    }),
  ),
};
