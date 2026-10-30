import { lightSemanticColors, TokenSemanticColorType } from './semantic';

export const createColorClasses = (
  prefix?: string,
): Record<TokenSemanticColorType, string> => {
  const classes: Partial<Record<TokenSemanticColorType, string>> = {}; // Partial을 사용하여 초기에는 빈 객체를 허용
  for (const key in lightSemanticColors) {
    if (prefix) {
      classes[key as TokenSemanticColorType] = `${prefix}-${key}`; // 타입 안정성을 유지하면서 값 할당
    } else {
      classes[key as TokenSemanticColorType] = `${key}`;
    }
  }
  return classes as Record<TokenSemanticColorType, string>; // 최종적으로 완성된 객체를 명시적으로 타입 변환
};
