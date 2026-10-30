/**
 * color 폴더 밖으로 나가는 통로. 패키지 공개 API는 tokens/index.ts가 따로 정한다.
 *
 * 팔레트(palette.ts)는 의도적으로 내보내지 않는다 — 폴더 밖에서는 시맨틱 컬러와
 * 그래프 컬러만 소비한다. 원시 색이 필요하면 시맨틱을 먼저 정의한다.
 * getColors는 tailwindConfig 전용이라 여기까지만 나가고 공개 API에는 없다.
 *
 * TokenSemanticColorType(opacity 없는 35개)과 TokenSemanticColorWithOpacityType(opacity 조합
 * 포함 440개)은 둘 다 공개 API다. createColorClasses로 만든 클래스 맵을 쓰는
 * fill·stroke·text 피커(Icon·Text 등)는 opacity 조합을 지원하지 않으므로
 * TokenSemanticColorType을, `bg-${...}` 같은 원시 클래스 템플릿은 opacity 조합까지
 * 필요하므로 TokenSemanticColorWithOpacityType을 쓴다.
 *
 * 폴더 안 파일은 이 배럴이 아니라 형제 파일을 직접 참조한다(순환 참조 방지).
 */
export {
  lightSemanticColors,
  darkSemanticColors,
  hasBakedOpacity,
  type TokenSemanticColorType,
  type TokenSemanticColorWithOpacityType,
} from './semantic';
export { graphColors, type TokenGraphColorType } from './graph';
export { getColors } from './getColors';
export { createColorClasses } from './createColorClasses';
export { getRgba } from './getRgba';
