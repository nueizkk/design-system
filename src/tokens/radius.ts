/**
 * 모서리 곡률 (Figma Radius 토큰 테이블 기준 12종)
 *
 * theme.borderRadius를 통째로 교체하므로 Tailwind 기본 rounded(4px)는 생성되지 않는다.
 * 6xl(64px)은 XD 확인 결과 폐기되어 full로 대체됨.
 */
export const radius = {
  none: '0px',
  '2xs': '2px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '28px',
  '4xl': '32px',
  '5xl': '36px',
  full: '9999px',
};

export type TokenRadiusType = keyof typeof radius;
