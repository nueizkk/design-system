/**
 * 시각적 무게 (Figma Typography 페이지의 Weight 사용 규정표 기준)
 * light 보조 표기 · regular 본문 · semibold 제목 · bold 최강 강조
 *
 * tailwindConfig에서 theme.fontWeight를 통째로 교체하는 소스라
 * 이 4종 외의 font-medium 같은 Tailwind 기본 클래스는 생성되지 않는다.
 * Text 전용이 아니라 preset 전역 토큰이다.
 */
export const weight = {
  light: '300',
  regular: '400',
  semibold: '600',
  bold: '700',
};

export type TokenWeightType = keyof typeof weight;
