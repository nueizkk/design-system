import { CSSRuleObject } from 'tailwindcss/types/config';

/**
 * Foundation · Opacity - Gradient
 * 색상이 아닌 불투명도의 그라디언트로, mask-image로 구현한다.
 * 클래스명의 방향 = 불투명한 엣지이며 반대쪽으로 사라진다.
 * ponytail: 16 stop은 Figma export(Gradient Ease cubic-bezier(0.25, 0.1, 0.25, 1))
 * 실측값 하드코딩. 곡선이 바뀌면 Figma에서 다시 뽑는다.
 */
const gradientFade =
  'rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.97917) 4.6963%, ' +
  'rgba(0, 0, 0, 0.95603) 8.9037%, rgba(0, 0, 0, 0.9296) 12.8%, ' +
  'rgba(0, 0, 0, 0.8989) 16.563%, rgba(0, 0, 0, 0.86296) 20.3704%, ' +
  'rgba(0, 0, 0, 0.8208) 24.4%, rgba(0, 0, 0, 0.77144) 28.8296%, ' +
  'rgba(0, 0, 0, 0.7139) 33.837%, rgba(0, 0, 0, 0.6472) 39.6%, ' +
  'rgba(0, 0, 0, 0.57037) 46.2963%, rgba(0, 0, 0, 0.48243) 54.1037%, ' +
  'rgba(0, 0, 0, 0.3824) 63.2%, rgba(0, 0, 0, 0.2693) 73.763%, ' +
  'rgba(0, 0, 0, 0.14216) 85.9704%, rgba(0, 0, 0, 0) 100%';

export const gradient = {
  top: 'to bottom',
  right: 'to left',
  bottom: 'to top',
  left: 'to right',
} as const;

export type TokenGradientType = keyof typeof gradient;

export const gradientUtilities: { [key: string]: CSSRuleObject } =
  Object.fromEntries(
    Object.entries(gradient).map(([name, to]) => [
      `.gradient-${name}`,
      {
        maskImage: `linear-gradient(${to}, ${gradientFade})`,
        WebkitMaskImage: `linear-gradient(${to}, ${gradientFade})`,
      },
    ]),
  );
