import { OpacityType, opacity } from '../opacity';

import {
  hasBakedOpacity,
  lightSemanticColors,
  TokenSemanticColorType,
  TokenSemanticColorWithOpacityType,
} from './semantic';

/**
 * Tailwind theme.colors에 넘길 색 사전을 만든다.
 * 값은 hex가 아니라 CSS 변수 참조이며, 실제 값은 src/tailwind.ts의 setColors가 심는다.
 * 클래스는 고정이고 변수 값만 바뀌므로 다크모드 전환에 클래스 교체가 필요없다.
 *
 * 불투명도가 이미 박힌 토큰(material-dim, dark의 line-*·fill-* 등)에는
 * opacity 조합을 만들지 않는다 — hasBakedOpacity 참고.
 */
export const getColors = () => {
  const colors: Partial<Record<TokenSemanticColorWithOpacityType, string>> = {};
  (Object.keys(lightSemanticColors) as Array<TokenSemanticColorType>).forEach(
    (name) => {
      colors[name] = `var(--color-${name})`;

      if (hasBakedOpacity(name)) return;

      (Object.keys(opacity) as Array<OpacityType>).forEach((opacityItem) => {
        colors[`${name}/${opacityItem}`] = `var(--color-${name}-${opacityItem})`;
      });
    },
  );
  return colors as Record<TokenSemanticColorWithOpacityType, string>;
};
